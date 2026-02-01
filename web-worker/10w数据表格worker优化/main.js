/**
 * 主线程文件
 * 负责 UI 渲染、虚拟列表、用户交互
 * 尽量减少 JS 计算，让主线程保持响应性
 */

// ========== 性能监控相关 ==========

class PerformanceMonitor {
    constructor() {
        this.metrics = {
            inputResponseTime: 0,
            searchTime: 0,
            renderTime: 0,
            fps: 60,
            longTasks: 0
        };
        this.lastFrameTime = performance.now();
        this.frameCount = 0;
        this.fpsInterval = 1000; // 每秒计算一次 FPS
        this.startFpsMonitoring();
    }

    // 记录输入响应时间（从用户输入到 Worker 返回结果）
    recordInputResponse(duration) {
        this.metrics.inputResponseTime = Math.round(duration * 100) / 100;
        document.getElementById('metric-inp').textContent = this.metrics.inputResponseTime;
    }

    // 记录搜索时间
    recordSearchTime(duration) {
        this.metrics.searchTime = Math.round(duration * 100) / 100;
        document.getElementById('metric-search').textContent = this.metrics.searchTime;
    }

    // 检测长任务（>50ms）
    recordLongTask(duration) {
        if (duration > 50) {
            this.metrics.longTasks++;
            console.warn(`⚠️ 检测到长任务: ${Math.round(duration)}ms`);
        }
    }

    // 使用 PerformanceObserver 监控主线程阻塞
    startFpsMonitoring() {
        // 使用 RAF 计算 FPS
        const measureFps = () => {
            this.frameCount++;
            const now = performance.now();
            const elapsed = now - this.lastFrameTime;

            if (elapsed >= this.fpsInterval) {
                this.metrics.fps = Math.round((this.frameCount * 1000) / elapsed);
                document.getElementById('metric-fps').textContent = this.metrics.fps;

                // 检测帧率下降（可能主线程阻塞）
                if (this.metrics.fps < 50) {
                    document.getElementById('metric-main-thread').textContent = '⚠️ 可能阻塞';
                } else {
                    document.getElementById('metric-main-thread').textContent = '✅ 正常';
                }

                this.frameCount = 0;
                this.lastFrameTime = now;
            }

            requestAnimationFrame(measureFps);
        };

        requestAnimationFrame(measureFps);
    }
}

// ========== 虚拟列表相关 ==========

class VirtualList {
    constructor(container, itemHeight = 48) {
        this.container = container;
        this.itemHeight = itemHeight;
        this.items = [];
        this.scrollTop = 0;
        this.containerHeight = container.clientHeight;

        // 计算可见区域
        this.updateVisibleRange();

        // 监听滚动事件，使用节流防止频繁更新
        this.container.addEventListener('scroll', () => this.onScroll(), { passive: true });
        window.addEventListener('resize', () => this.onResize());
    }

    // 计算可见范围（虚拟列表的核心）
    updateVisibleRange() {
        this.scrollTop = this.container.scrollTop;
        this.containerHeight = this.container.clientHeight;

        // 计算可见的行数范围（加上缓冲区，提前渲染）
        this.visibleStart = Math.max(0, Math.floor(this.scrollTop / this.itemHeight) - 5);
        this.visibleEnd = Math.min(
            this.items.length,
            Math.ceil((this.scrollTop + this.containerHeight) / this.itemHeight) + 5
        );
    }

    // 设置数据并重新渲染
    setItems(items) {
        this.items = items;
        this.render();
    }

    // 虚拟渲染（只渲染可见区域的行）
    render() {
        const tableBody = document.getElementById('table-body');
        tableBody.innerHTML = '';

        // 上方空白区域
        const topSpacerHeight = this.visibleStart * this.itemHeight;
        if (topSpacerHeight > 0) {
            const topSpacer = document.createElement('div');
            topSpacer.className = 'scroll-spacer';
            topSpacer.style.height = topSpacerHeight + 'px';
            tableBody.appendChild(topSpacer);
        }

        // 可见行
        const fragment = document.createDocumentFragment();
        for (let i = this.visibleStart; i < this.visibleEnd; i++) {
            if (i < this.items.length) {
                const row = this.createRow(this.items[i]);
                fragment.appendChild(row);
            }
        }
        tableBody.appendChild(fragment);

        // 下方空白区域
        const bottomSpacerHeight = (this.items.length - this.visibleEnd) * this.itemHeight;
        if (bottomSpacerHeight > 0) {
            const bottomSpacer = document.createElement('div');
            bottomSpacer.className = 'scroll-spacer';
            bottomSpacer.style.height = bottomSpacerHeight + 'px';
            tableBody.appendChild(bottomSpacer);
        }

        // 更新统计
        document.getElementById('stat-rendered').textContent = this.visibleEnd - this.visibleStart;
    }

    // 创建一行 DOM 元素
    createRow(item) {
        const row = document.createElement('div');
        row.className = 'table-row';

        const categoryBadgeClass = `badge badge-${item.category}`;

        row.innerHTML = `
            <div class="table-row-id">#${item.id}</div>
            <div class="table-row-name">${this.escapeHtml(item.name)}</div>
            <div class="table-row-value">${this.escapeHtml(item.email)}</div>
            <div class="table-row-value">${item.score}</div>
            <div><span class="${categoryBadgeClass}">${item.category}</span></div>
        `;

        return row;
    }

    // XSS 防护
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    // 滚动事件处理（使用节流）
    onScroll() {
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }
        this.scrollTimeout = setTimeout(() => {
            this.updateVisibleRange();
            this.render();
        }, 16); // 大约 60fps
    }

    // 窗口 resize 事件处理
    onResize() {
        this.updateVisibleRange();
        this.render();
    }
}

// ========== Web Worker 管理 ==========
class WorkerManager {
    constructor() {
        this.worker = new Worker('./worker.js');
        this.messageCount = 0;
        this.pendingRequests = new Map();
        this.requestId = 0;

        this.worker.onmessage = (e) => {
            this.messageCount++;
            document.getElementById('stat-messages').textContent = this.messageCount;

            const { type, data } = e.data;

            if (type === 'INIT_DATA_DONE') {
                const callback = this.pendingRequests.get('init');
                if (callback) {
                    callback(e.data);
                    this.pendingRequests.delete('init');
                }
            } else if (type === 'QUERY_RESULT') {
                const callback = this.pendingRequests.get('query');
                if (callback) {
                    callback(e.data);
                }
            } else if (type === 'ERROR') {
                console.error('Worker Error:', e.data);
            }
        };

        this.worker.onerror = (error) => {
            console.error('Worker Error:', error.message);
        };
    }

    // 初始化数据
    initData(count) {
        return new Promise((resolve) => {
            this.pendingRequests.set('init', resolve);
            this.worker.postMessage({
                type: 'INIT_DATA',
                payload: { count }
            });
        });
    }

    // 执行查询
    query(params, onResult) {
        this.pendingRequests.set('query', onResult);
        this.worker.postMessage({
            type: 'QUERY',
            payload: params
        });
    }

    // 清除缓存
    clearCache() {
        this.worker.postMessage({
            type: 'CLEAR_CACHE'
        });
    }
}

// ========== 主应用程序 ==========
// 根文件
class DataTableApp {
    constructor() {
        this.performanceMonitor = new PerformanceMonitor();
        this.workerManager = new WorkerManager();
        this.virtualList = new VirtualList(document.getElementById('table-wrapper'));

        this.currentParams = {
            search: '',
            filter: '',
            sort: ''
        };

        this.allData = [];
        this.isLoading = false;

        this.setupEventListeners();
        this.initData(100000);
    }

    // 设置事件监听
    setupEventListeners() {
        // 搜索输入框 - 使用防抖避免频繁查询
        const searchInput = document.getElementById('search-input');
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            const inputStartTime = performance.now();

            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.currentParams.search = e.target.value;
                // 搜索时清除缓存，重新执行查询
                this.workerManager.clearCache();
                this.query();

                const inputDuration = performance.now() - inputStartTime;
                this.performanceMonitor.recordInputResponse(inputDuration);
            }, 300); // 300ms 防抖
        });

        // 排序下拉框
        document.getElementById('sort-select').addEventListener('change', (e) => {
            this.currentParams.sort = e.target.value;
            this.query();
        });

        // 筛选下拉框
        document.getElementById('filter-select').addEventListener('change', (e) => {
            this.currentParams.filter = e.target.value;
            this.query();
        });

        // 清空过滤按钮
        document.getElementById('clear-btn').addEventListener('click', () => {
            document.getElementById('search-input').value = '';
            document.getElementById('sort-select').value = '';
            document.getElementById('filter-select').value = '';
            this.currentParams = { search: '', filter: '', sort: '' };
            this.query();
        });

        // 重新生成数据按钮
        document.getElementById('regenerate-btn').addEventListener('click', () => {
            this.initData(1000000);
        });
    }

    // 初始化数据
    async initData(num) {
        this.showLoading(true);
        const startTime = performance.now();

        try {
            // 发送初始化消息到 Worker
            const result = await this.workerManager.initData(num);

            console.log(`✅ 数据初始化完成: ${result.dataCount} 条数据, 耗时 ${result.duration.toFixed(2)}ms`);
            document.getElementById('stat-total').textContent = result.dataCount.toLocaleString();

            // 初始化完成后执行第一次查询
            this.query();
        } catch (error) {
            console.error('初始化数据失败:', error);
            this.showError('数据初始化失败');
        }
    }

    // 执行查询
    query() {
        if (this.isLoading) return;

        this.isLoading = true;
        this.showLoading(true);

        const queryStartTime = performance.now();

        // 发送查询参数到 Worker
        this.workerManager.query(this.currentParams, (result) => {
            const { type, data, batch, totalBatches, total, duration } = result;

            if (batch === 0) {
                // 第一批结果，记录查询耗时
                this.performanceMonitor.recordSearchTime(duration);
                this.allData = [];
            }

            // 累积数据
            this.allData.push(...data);

            // 最后一批数据到达
            if (batch === totalBatches - 1) {
                const totalDuration = performance.now() - queryStartTime;
                this.performanceMonitor.recordLongTask(totalDuration);

                // 更新统计信息
                document.getElementById('stat-filtered').textContent = total.toLocaleString();

                // 更新虚拟列表
                this.virtualList.setItems(this.allData);

                this.isLoading = false;
                this.showLoading(false);

                console.log(
                    `✅ 查询完成: 返回 ${total} 条结果, 分 ${totalBatches} 批, ` +
                    `总耗时 ${totalDuration.toFixed(2)}ms (Worker: ${duration.toFixed(2)}ms)`
                );
            }
        });
    }

    // 显示加载状态
    showLoading(show) {
        const tableBody = document.getElementById('table-body');

        if (show) {
            tableBody.innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                    <span>处理中...</span>
                </div>
            `;
        }
    }

    // 显示错误信息
    showError(message) {
        const tableBody = document.getElementById('table-body');
        tableBody.innerHTML = `
            <div class="empty-state">
                <div style="font-size: 40px; margin-bottom: 10px;">❌</div>
                <p>${message}</p>
            </div>
        `;
    }
}

// ========== 应用初始化 ==========

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 应用启动');

    // 创建应用实例
    window.app = new DataTableApp();

    // 添加一些调试信息
    console.log('💡 tips:');
    console.log('  - 打开开发者工具的 Performance 标签来监控性能');
    console.log('  - 在 Network 标签可以看到 Worker 的消息通信');
    console.log('  - 尝试快速输入搜索关键词，观察 INP 指标');
    console.log('  - 滚动表格，观察虚拟列表的效果（只渲染可见行）');
});

// 暴露一些全局方法用于调试
window.debugMetrics = () => {
    console.table({
        '输入响应时间 (INP)': window.app.performanceMonitor.metrics.inputResponseTime + 'ms',
        '搜索耗时': window.app.performanceMonitor.metrics.searchTime + 'ms',
        'FPS': window.app.performanceMonitor.metrics.fps,
        '检测长任务数': window.app.performanceMonitor.metrics.longTasks
    });
};

window.exportMetrics = () => {
    const data = {
        timestamp: new Date().toISOString(),
        metrics: window.app.performanceMonitor.metrics,
        totalMessages: window.app.workerManager.messageCount,
        dataCount: window.app.allData.length
    };
    console.log(JSON.stringify(data, null, 2));
    return data;
};
