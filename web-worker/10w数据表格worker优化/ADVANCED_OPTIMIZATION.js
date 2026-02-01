/**
 * 高级优化方案和扩展思路
 * 用于理解和实现更复杂的场景
 */

/*
=============================================================================
                    1. Transferable Objects 优化
=============================================================================
*/

/**
 * 问题：大数据传输在线程间会被复制一份
 * 解决：使用 Transferable Objects（零复制传输）
 * 
 * 支持的对象类型：
 * - ArrayBuffer
 * - MessagePort
 * - ImageBitmap
 * - OffscreenCanvas
 * 
 * 使用场景：传输大量数值数据（如图片、音频、数学计算结果）
 */

// ===== Worker 中的优化版本 =====

// 1. 将数据转换为 TypedArray（可转移）
function dataToTypedArray(data) {
    const buffer = new ArrayBuffer(data.length * 100); // 粗略估计
    const view = new DataView(buffer);

    let offset = 0;
    data.forEach((item, index) => {
        // id (4 bytes)
        view.setInt32(offset, item.id, true);
        offset += 4;
        // score (4 bytes)
        view.setFloat32(offset, item.score, true);
        offset += 4;
        // category code (1 byte)
        view.setInt8(offset, item.category.charCodeAt(0) - 65, true);
        offset += 1;
    });

    return buffer.slice(0, offset);
}

// 2. 发送可转移对象
self.onmessage = function(e) {
    if (e.data.type === 'QUERY') {
        const results = processData(e.data.payload);
        const buffer = dataToTypedArray(results);

        // 第三个参数指定可转移对象列表
        self.postMessage(
            {
                type: 'QUERY_RESULT',
                data: buffer,
                count: results.length
            },
            [buffer] // 转移所有权，主线程接收后原线程就无法访问
        );
    }
};

// ===== 主线程中的接收 =====

function typedArrayToData(buffer, count) {
    const view = new DataView(buffer);
    const data = [];

    let offset = 0;
    for (let i = 0; i < count; i++) {
        const id = view.getInt32(offset, true);
        offset += 4;
        const score = view.getFloat32(offset, true);
        offset += 4;
        const categoryCode = view.getInt8(offset, true);
        offset += 1;
        const category = String.fromCharCode(65 + categoryCode);

        data.push({ id, score, category });
    }

    return data;
}

/*
=============================================================================
                    2. 多 Worker 并行处理
=============================================================================
*/

/**
 * 问题：单个 Worker 处理能力有限
 * 解决：使用 Worker 线程池，并行处理不同分片
 * 
 * 场景：100,000 条数据分成 4 份，各自在不同 Worker 处理
 */

class WorkerPool {
    constructor(workerScript, poolSize = 4) {
        this.workers = [];
        this.taskQueue = [];
        this.activeWorkers = new Set();

        // 创建 Worker 线程池
        for (let i = 0; i < poolSize; i++) {
            const worker = new Worker(workerScript);
            worker.onmessage = (e) => this.handleWorkerResult(worker, e);
            this.workers.push(worker);
        }
    }

    // 执行任务（自动负载均衡）
    executeTask(data, params) {
        return new Promise((resolve) => {
            const task = { data, params, resolve };

            // 如果有空闲 Worker，立即执行
            if (this.activeWorkers.size < this.workers.length) {
                this.runTask(task);
            } else {
                // 否则加入队列
                this.taskQueue.push(task);
            }
        });
    }

    // 运行单个任务
    runTask(task) {
        const worker = this.workers.find(
            (w) => !this.activeWorkers.has(w)
        );

        if (worker) {
            this.activeWorkers.add(worker);
            worker.taskData = task;

            worker.postMessage({
                type: 'PROCESS',
                payload: {
                    data: task.data,
                    params: task.params
                }
            });
        }
    }

    // 处理 Worker 结果
    handleWorkerResult(worker, e) {
        const task = worker.taskData;
        task.resolve(e.data);
        this.activeWorkers.delete(worker);

        // 处理队列中的下一个任务
        if (this.taskQueue.length > 0) {
            const nextTask = this.taskQueue.shift();
            this.runTask(nextTask);
        }
    }
}

// 使用示例
const workerPool = new WorkerPool('worker.js', 4);

async function queryWithWorkerPool(params) {
    const data = window.app.allData;
    const chunkSize = Math.ceil(data.length / 4);
    const chunks = [];

    for (let i = 0; i < 4; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, data.length);
        chunks.push(data.slice(start, end));
    }

    // 并行处理 4 个分片
    const results = await Promise.all(
        chunks.map((chunk) => workerPool.executeTask(chunk, params))
    );

    // 合并结果
    return results.flat();
}

/*
=============================================================================
                    3. SharedArrayBuffer 零复制
=============================================================================
*/

/**
 * 问题：即使使用 Transferable，大数据仍需序列化
 * 解决：SharedArrayBuffer 允许主线程和 Worker 直接共享内存
 * 
 * ⚠️ 注意：
 * - 需要特殊的 HTTP 头 (Cross-Origin-Opener-Policy)
 * - 安全性考虑（可能被禁用）
 * - 需要手动同步（原子操作）
 */

// ===== 设置 SharedArrayBuffer =====

// 需要在 HTTP 响应头中添加：
// Cross-Origin-Opener-Policy: same-origin
// Cross-Origin-Embedder-Policy: require-corp

// ===== 使用 SharedArrayBuffer =====

const sharedBuffer = new SharedArrayBuffer(100000 * 100); // 10MB 共享内存
const sharedView = new Int32Array(sharedBuffer);

// Worker 和主线程都可以访问同一内存区域
worker.postMessage({ buffer: sharedBuffer }, []);

// Worker 中：
self.onmessage = function(e) {
    const view = new Int32Array(e.data.buffer);
    // 直接修改共享内存，主线程立即可见
    view[0] = 42;
    // 原子操作确保线程安全
    Atomics.store(view, 1, 100);
};

// 主线程中：
const value = Atomics.load(sharedView, 1);

/*
=============================================================================
                    4. IndexedDB 客户端存储
=============================================================================
*/

/**
 * 问题：页面刷新后，数据和索引需要重新构建
 * 解决：使用 IndexedDB 持久化存储
 * 
 * 优势：
 * - 本地存储大量数据（通常 50MB+）
 * - 异步 API，不阻塞主线程
 * - 支持复杂查询和索引
 */

class DataStore {
    constructor() {
        this.db = null;
        this.initDB();
    }

    // 初始化 IndexedDB
    initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('DataTableDB', 1);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                // 创建数据存储
                const dataStore = db.createObjectStore('data', { keyPath: 'id' });
                // 创建索引
                dataStore.createIndex('name', 'name', { unique: false });
                dataStore.createIndex('category', 'category', { unique: false });
                dataStore.createIndex('score', 'score', { unique: false });
            };
        });
    }

    // 保存数据
    async saveData(data) {
        const transaction = this.db.transaction(['data'], 'readwrite');
        const store = transaction.objectStore('data');

        data.forEach((item) => {
            store.put(item);
        });

        return new Promise((resolve, reject) => {
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        });
    }

    // 查询数据
    async queryData(criteria) {
        const transaction = this.db.transaction(['data'], 'readonly');
        const store = transaction.objectStore('data');

        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
}

// 使用示例
const dataStore = new DataStore();

async function initWithCache() {
    // 检查 IndexedDB 中是否有缓存数据
    const cachedData = await dataStore.queryData();

    if (cachedData.length > 0) {
        // 使用缓存数据
        console.log('使用缓存数据');
        window.app.allData = cachedData;
        window.app.virtualList.setItems(cachedData);
    } else {
        // 生成新数据并缓存
        console.log('生成新数据');
        await window.app.initData();
        await dataStore.saveData(window.app.allData);
    }
}

/*
=============================================================================
                    5. 实时搜索建议 (Autocomplete)
=============================================================================
*/

/**
 * 问题：搜索时需要实时显示建议
 * 解决：使用 Trie 树结构存储词汇，快速匹配前缀
 */

class TrieNode {
    constructor() {
        this.children = new Map();
        this.isEnd = false;
        this.count = 0; // 词频
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    // 插入词汇
    insert(word, frequency = 1) {
        let node = this.root;
        for (const char of word) {
            if (!node.children.has(char)) {
                node.children.set(char, new TrieNode());
            }
            node = node.children.get(char);
        }
        node.isEnd = true;
        node.count = frequency;
    }

    // 前缀搜索（返回所有匹配的词及其频率）
    searchPrefix(prefix) {
        let node = this.root;
        for (const char of prefix) {
            if (!node.children.has(char)) {
                return [];
            }
            node = node.children.get(char);
        }

        // DFS 遍历子树找出所有词
        const results = [];
        const dfs = (node, currentWord) => {
            if (node.isEnd) {
                results.push({
                    word: currentWord,
                    frequency: node.count
                });
            }
            for (const [char, child] of node.children) {
                dfs(child, currentWord + char);
            }
        };

        dfs(node, prefix);

        // 按频率排序
        return results
            .sort((a, b) => b.frequency - a.frequency)
            .slice(0, 10); // 返回前 10 个建议
    }
}

// 在 Worker 中使用
const searchTrie = new Trie();

function buildSearchTrie(data) {
    const nameFreq = {};
    data.forEach((item) => {
        nameFreq[item.name] = (nameFreq[item.name] || 0) + 1;
    });

    for (const [name, freq] of Object.entries(nameFreq)) {
        searchTrie.insert(name.toLowerCase(), freq);
    }
}

self.onmessage = function(e) {
    if (e.data.type === 'GET_SUGGESTIONS') {
        const suggestions = searchTrie.searchPrefix(
            e.data.payload.prefix.toLowerCase()
        );
        self.postMessage({
            type: 'SUGGESTIONS',
            suggestions
        });
    }
};

/*
=============================================================================
                    6. 请求去重和合并
=============================================================================
*/

/**
 * 问题：用户快速改变搜索条件，可能发送大量重复请求
 * 解决：使用 RequestDeduplicator 去重和合并请求
 */

class RequestDeduplicator {
    constructor() {
        this.pending = new Map();
        this.debounceTimer = null;
        this.debounceDelay = 300;
    }

    // 添加请求到待处理队列
    addRequest(key, params) {
        return new Promise((resolve) => {
            // 清除旧的防抖计时器
            clearTimeout(this.debounceTimer);

            // 存储请求
            this.pending.set(key, { params, resolve });

            // 设置新的防抖计时器
            this.debounceTimer = setTimeout(() => {
                this.processRequests();
            }, this.debounceDelay);
        });
    }

    // 处理所有待处理的请求
    processRequests() {
        const requests = Array.from(this.pending.entries());
        this.pending.clear();

        // 按优先级处理（最后一个请求优先级最高）
        if (requests.length > 0) {
            const [key, request] = requests[requests.length - 1];

            // 发送给 Worker
            worker.postMessage({
                type: 'QUERY',
                payload: request.params
            });

            // 所有请求共用同一个结果
            const resultPromise = new Promise((resolve) => {
                const originalHandler = worker.onmessage;
                worker.onmessage = (e) => {
                    request.resolve(e.data);
                    // 其他请求也获得结果
                    requests.forEach(([_, req]) => {
                        if (req !== request) {
                            req.resolve(e.data);
                        }
                    });
                    // 恢复原始处理器
                    worker.onmessage = originalHandler;
                };
            });
        }
    }
}

// 使用示例
const deduplicator = new RequestDeduplicator();

// 用户快速输入 "zhang" "w" "wa" "wan" "wang"
// 只会发送最后一个查询 "wang" 给 Worker
searchInput.addEventListener('input', (e) => {
    const params = { search: e.target.value };
    deduplicator.addRequest('search', params).then((result) => {
        updateResults(result);
    });
});

/*
=============================================================================
                    7. 压缩和编码优化
=============================================================================
*/

/**
 * 问题：传输大量文本数据时，网络占用大
 * 解决：压缩数据，使用紧凑编码
 */

// 使用 LZ4 或 gzip 压缩
class DataCompressor {
    // 简单的 RLE (Run-Length Encoding) 压缩示例
    static compress(data) {
        const json = JSON.stringify(data);
        const bytes = new TextEncoder().encode(json);

        // 使用 CompressionStream API (现代浏览器支持)
        const stream = bytes.stream();
        const compressedStream = stream.pipeThrough(
            new CompressionStream('gzip')
        );
        return compressedStream;
    }

    static decompress(compressed) {
        const stream = compressed.stream();
        const decompressedStream = stream.pipeThrough(
            new DecompressionStream('gzip')
        );

        return decompressedStream
            .getReader()
            .read()
            .then((chunk) => {
                const text = new TextDecoder().decode(chunk.value);
                return JSON.parse(text);
            });
    }
}

/*
=============================================================================
                    8. 性能持续监控
=============================================================================
*/

/**
 * 使用 PerformanceObserver 持续监控性能指标
 */

class PerformanceTracker {
    constructor() {
        this.metrics = {};
        this.setupObservers();
    }

    setupObservers() {
        // 监控长任务
        if ('PerformanceObserver' in window) {
            try {
                const longTaskObserver = new PerformanceObserver(
                    (entryList) => {
                        for (const entry of entryList.getEntries()) {
                            console.warn(
                                `检测到长任务: ${entry.duration.toFixed(0)}ms`,
                                entry
                            );
                        }
                    }
                );
                longTaskObserver.observe({ entryTypes: ['longtask'] });
            } catch (e) {
                console.log('长任务监控不可用');
            }

            // 监控资源加载
            const resourceObserver = new PerformanceObserver(
                (entryList) => {
                    for (const entry of entryList.getEntries()) {
                        console.log(`资源加载: ${entry.name}`, {
                            duration: entry.duration,
                            size: entry.transferSize
                        });
                    }
                }
            );
            resourceObserver.observe({ entryTypes: ['resource'] });

            // 监控用户交互
            const interactionObserver = new PerformanceObserver(
                (entryList) => {
                    for (const entry of entryList.getEntries()) {
                        console.log(`用户交互: ${entry.name}`, {
                            duration: entry.duration,
                            startTime: entry.startTime
                        });
                    }
                }
            );
            interactionObserver.observe({ entryTypes: ['interaction'] });
        }
    }

    // 获取 Web Vitals 指标
    getWebVitals() {
        const vitals = {
            LCP: this.getLCP(),
            FID: this.getFID(),
            CLS: this.getCLS(),
            INP: this.getINP()
        };

        console.log('Web Vitals:', vitals);
        return vitals;
    }

    getLCP() {
        // Largest Contentful Paint
        const entries = performance.getEntriesByType('largest-contentful-paint');
        return entries.length ? entries[entries.length - 1].startTime : 0;
    }

    getFID() {
        // First Input Delay
        const entries = performance.getEntriesByType('first-input');
        return entries.length ? entries[0].processingEnd - entries[0].startTime : 0;
    }

    getCLS() {
        // Cumulative Layout Shift
        let cls = 0;
        const entries = performance.getEntriesByType('layout-shift');
        entries.forEach((entry) => {
            if (!entry.hadRecentInput) {
                cls += entry.value;
            }
        });
        return cls;
    }

    getINP() {
        // Interaction to Next Paint
        const entries = performance.getEntriesByType('interaction');
        if (!entries.length) return 0;

        const latencies = entries.map((entry) => entry.duration);
        latencies.sort((a, b) => b - a);

        // 取 98 百分位数
        const p98Index = Math.ceil(latencies.length * 0.98) - 1;
        return latencies[p98Index];
    }
}

const tracker = new PerformanceTracker();

// 定期检查 Web Vitals
setInterval(() => {
    tracker.getWebVitals();
}, 5000);

/*
=============================================================================
                        总结：完整的优化路径
=============================================================================
*/

/**
 * 基础版本（已实现）
 * ├─ Web Worker 处理数据
 * ├─ 倒排索引搜索
 * ├─ 虚拟列表渲染
 * ├─ 缓存机制
 * └─ 性能监控
 * 
 * 中级优化
 * ├─ Transferable Objects 零复制传输
 * ├─ Worker 线程池并行处理
 * ├─ IndexedDB 持久化存储
 * └─ 请求去重和合并
 * 
 * 高级优化
 * ├─ SharedArrayBuffer 共享内存
 * ├─ Trie 树快速搜索建议
 * ├─ 数据压缩和编码
 * ├─ 流式处理大数据
 * └─ Web Vitals 持续监控
 */
