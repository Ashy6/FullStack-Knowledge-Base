/**
 * 任务管理器 (Main Thread)
 * 负责调度 Worker，处理超时、取消和 Promise 封装
 */

class WorkerTaskManager {
    constructor(workerPath) {
        this.worker = new Worker(workerPath);
        this.pendingTasks = new Map(); // 存储 { resolve, reject, onProgress, timeoutId }
        this.isTerminated = false;

        this.setupWorkerListeners();
    }

    setupWorkerListeners() {
        this.worker.onmessage = (e) => {
            const { type, requestId, payload } = e.data;
            const task = this.pendingTasks.get(requestId);

            if (!task) return; // 任务可能已被超时处理或取消

            switch (type) {
                case 'TASK_PROGRESS':
                    if (task.onProgress) {
                        task.onProgress(payload.progress);
                    }
                    break;
                
                case 'TASK_SUCCESS':
                    this.cleanupTask(requestId);
                    task.resolve(payload);
                    break;
                
                case 'TASK_ERROR':
                    this.cleanupTask(requestId);
                    task.reject(new Error(payload));
                    break;
            }
        };

        this.worker.onerror = (e) => {
            console.error('Worker Error:', e);
            // 发生严重错误时，拒绝所有挂起的任务
            for (const [requestId, task] of this.pendingTasks) {
                task.reject(new Error('Worker Internal Error'));
            }
            this.pendingTasks.clear();
        };
    }

    /**
     * 执行任务
     * @param {Object} payload 任务参数
     * @param {Object} options 配置 { timeout, onProgress }
     * @returns {Object} { requestId, result: Promise }
     */
    runTask(payload, options = {}) {
        if (this.isTerminated) {
            return { 
                requestId: null, 
                result: Promise.reject(new Error('Worker is terminated')) 
            };
        }

        const requestId = this.generateId();
        const { timeout = 0, onProgress } = options;

        const result = new Promise((resolve, reject) => {
            // 设置超时计时器
            let timeoutId = null;
            if (timeout > 0) {
                timeoutId = setTimeout(() => {
                    this.handleTimeout(requestId);
                }, timeout);
            }

            // 存储任务上下文
            this.pendingTasks.set(requestId, {
                resolve,
                reject,
                onProgress,
                timeoutId
            });

            // 发送消息给 Worker
            this.worker.postMessage({
                type: 'START_TASK',
                requestId,
                payload
            });
        });

        return { requestId, result };
    }

    /**
     * 取消任务
     * 发送取消指令给 Worker，并立即 reject Promise
     */
    cancelTask(requestId) {
        const task = this.pendingTasks.get(requestId);
        if (task) {
            // 1. 通知 Worker 取消
            this.worker.postMessage({
                type: 'CANCEL_TASK',
                payload: { requestId },
                requestId
            });

            // 2. 清理主线程状态
            this.cleanupTask(requestId);
            task.reject(new Error('Task Cancelled'));
            console.log(`Task ${requestId} cancelled by user`);
        }
    }

    /**
     * 处理超时
     * 可以选择仅 reject Promise，或者强制 terminate Worker
     */
    handleTimeout(requestId) {
        const task = this.pendingTasks.get(requestId);
        if (task) {
            // 策略 A: 仅在主线程放弃等待，Worker 可能还在跑 (Soft Timeout)
            // this.cancelTask(requestId); 
            
            // 策略 B: 强制终止 Worker (Hard Timeout) - 适用于任务无法响应取消信号的情况
            // this.terminateAndRestart(); 
            
            // 这里演示标准做法：尝试取消
            console.warn(`Task ${requestId} timed out!`);
            this.cancelTask(requestId);
            // 如果是硬超时，可以 task.reject(new Error('Timeout'))
        }
    }

    /**
     * 清理任务状态
     */
    cleanupTask(requestId) {
        const task = this.pendingTasks.get(requestId);
        if (task) {
            if (task.timeoutId) {
                clearTimeout(task.timeoutId);
            }
            this.pendingTasks.delete(requestId);
        }
    }

    /**
     * 强制终止 Worker
     * 代价：所有正在运行的任务都会失败，Worker 状态丢失
     */
    terminate() {
        this.worker.terminate();
        this.isTerminated = true;
        
        // 拒绝所有剩余任务
        for (const [requestId, task] of this.pendingTasks) {
            task.reject(new Error('Worker Terminated'));
        }
        this.pendingTasks.clear();
        console.warn('Worker terminated.');
    }

    /**
     * 重启 Worker
     */
    restart() {
        if (this.isTerminated) {
            this.worker = new Worker('worker.js');
            this.setupWorkerListeners();
            this.isTerminated = false;
            console.log('Worker restarted.');
        }
    }

    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
}
