/**
 * Web Worker 文件
 * 负责数据的索引构建、搜索、排序、筛选
 * 所有计算密集操作都在这里执行，不会阻塞主线程
 */

let dataCache = null;           // 缓存完整数据集
let indexCache = {};            // 缓存搜索索引
let lastQueryParams = null;     // 缓存上一次查询参数
let lastFilteredData = null;    // 缓存上一次过滤结果

/**
 * 生成模拟数据
 * @param {number} count - 数据条数
 * @returns {Array} 数据数组
 */
function generateData(count) {
    const categories = ['A', 'B', 'C'];
    const firstNames = ['张', '王', '李', '赵', '刘', '陈', '杨', '黄', '吴', '周', '徐', '孙', '朱', '高', '林'];
    const lastNames = ['三', '五', '二', '四', '六', '七', '八', '九', '十', '一'];
    const domains = ['gmail.com', 'outlook.com', 'yahoo.com', 'qq.com', '163.com', 'qq.com'];

    const data = [];
    for (let i = 1; i <= count; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const name = firstName + lastName;
        const email = `${name}${i}@${domains[Math.floor(Math.random() * domains.length)]}`;
        const category = categories[Math.floor(Math.random() * categories.length)];
        const score = Math.floor(Math.random() * 100);

        data.push({
            id: i,
            name,
            email,
            score,
            category,
            // 用于搜索的组合字段
            searchText: `${name} ${email} ${category}`.toLowerCase()
        });
    }
    return data;
}

/**
 * 构建全文搜索索引
 * 使用简单的分词和反向索引
 * @param {Array} data - 数据数组
 * @returns {Object} 索引对象
 */
function buildSearchIndex(data) {
    const index = {};

    data.forEach((item) => {
        // 对搜索文本进行分词
        const words = item.searchText.split(/[\s@\.]/);

        words.forEach((word) => {
            if (word.length > 0) {
                if (!index[word]) {
                    index[word] = [];
                }
                index[word].push(item.id);
            }
        });
    });

    return index;
}

/**
 * 使用倒排索引快速搜索
 * @param {string} keyword - 搜索关键词
 * @param {Array} data - 数据数组
 * @param {Object} index - 索引对象
 * @returns {Array} 搜索结果 ID 数组
 */
function searchByKeyword(keyword, data, index) {
    if (!keyword || keyword.trim() === '') {
        return data.map(item => item.id);
    }

    const keywords = keyword.toLowerCase().split(/\s+/);
    let resultIds = null;

    // 取多个关键词搜索结果的交集
    for (const kw of keywords) {
        if (kw.length === 0) continue;

        // 前缀匹配
        const matches = [];
        for (const indexKey in index) {
            if (indexKey.startsWith(kw)) {
                matches.push(...index[indexKey]);
            }
        }

        const uniqueMatches = [...new Set(matches)];

        if (resultIds === null) {
            resultIds = uniqueMatches;
        } else {
            // 取交集
            resultIds = resultIds.filter(id => uniqueMatches.includes(id));
        }
    }

    return resultIds || [];
}

/**
 * 对数据进行过滤、搜索、排序
 * @param {Object} params - 查询参数
 * @param {string} params.search - 搜索关键词
 * @param {string} params.filter - 分类筛选
 * @param {string} params.sort - 排序方式
 * @returns {Array} 处理后的数据
 */
function processData(params) {
    // 步骤 1: 基础过滤（快）
    let filtered = dataCache;

    if (params.filter) {
        filtered = filtered.filter(item => item.category.toLowerCase().includes(params.filter.toLowerCase()));
    }

    // 步骤 2: 搜索过滤（使用索引加速）
    if (params.search) {
        const searchResultIds = searchByKeyword(params.search, filtered, indexCache);
        filtered = filtered.filter(item => searchResultIds.includes(item.id));
    }

    // 步骤 3: 排序
    if (params.sort) {
        const [field, direction] = params.sort.split('-');
        filtered = filtered.sort((a, b) => {
            let aVal = a[field];
            let bVal = b[field];

            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
                return direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            } else {
                return direction === 'asc' ? aVal - bVal : bVal - aVal;
            }
        });
    }

    return filtered;
}

/**
 * 分块返回数据（模拟增量加载）
 * @param {Array} data - 完整数据数组
 * @param {number} pageSize - 每页大小
 * @returns {Function} 生成器函数
 */
function* paginateData(data, pageSize = 100) {
    for (let i = 0; i < data.length; i += pageSize) {
        yield {
            data: data.slice(i, i + pageSize),
            start: i,
            end: Math.min(i + pageSize, data.length),
            total: data.length
        };
    }
}

/**
 * 监听来自主线程的消息
 */
self.onmessage = function (e) {
    const { type, payload } = e.data;

    try {
        switch (type) {
            // 初始化数据和索引
            case 'INIT_DATA': {
                const startTime = performance.now();

                // 生成数据
                dataCache = generateData(payload.count);

                // 构建搜索索引
                indexCache = buildSearchIndex(dataCache);

                const duration = performance.now() - startTime;

                self.postMessage({
                    type: 'INIT_DATA_DONE',
                    duration,
                    dataCount: dataCache.length
                });
                break;
            }

            // 处理查询请求
            case 'QUERY': {
                const startTime = performance.now();
                const params = payload;

                // 检查缓存：如果参数相同，直接使用上一次的结果
                const cacheKey = JSON.stringify(params);
                let filtered;

                if (lastQueryParams === cacheKey && lastFilteredData) {
                    filtered = lastFilteredData;
                } else {
                    // 执行新查询
                    filtered = processData(params);
                    lastQueryParams = cacheKey;
                    lastFilteredData = filtered;
                }

                const duration = performance.now() - startTime;

                // 分页返回数据（每批 100 条）
                const pageSize = 100;
                const totalPages = Math.ceil(filtered.length / pageSize);

                let batchIndex = 0;

                // 分块发送数据
                const sendNextBatch = () => {
                    const start = batchIndex * pageSize;
                    const end = Math.min(start + pageSize, filtered.length);
                    const batchData = filtered.slice(start, end);

                    self.postMessage({
                        type: 'QUERY_RESULT',
                        data: batchData,
                        batch: batchIndex,
                        totalBatches: totalPages,
                        total: filtered.length,
                        duration: batchIndex === 0 ? duration : 0,
                        // 使用可转移对象优化传输
                        // 实际项目中可以将数据转换为 TypedArray 使用 Transferable
                    });

                    batchIndex++;

                    // 立即发送下一批，让浏览器有时间渲染
                    if (batchIndex < totalPages) {
                        setTimeout(sendNextBatch, 0);
                    }
                };

                sendNextBatch();
                break;
            }

            // 清除缓存
            case 'CLEAR_CACHE': {
                lastQueryParams = null;
                lastFilteredData = null;

                self.postMessage({
                    type: 'CACHE_CLEARED'
                });
                break;
            }

            default:
                console.warn('Unknown message type:', type);
        }
    } catch (error) {
        self.postMessage({
            type: 'ERROR',
            error: error.message,
            stack: error.stack
        });
    }
};

console.log('Worker initialized and ready to process data');
