/**
 * Worker 线程逻辑
 * 实现了任务的可取消、进度上报和请求匹配
 */

// 存储当前正在运行的任务的取消标记
// Key: requestId, Value: Boolean (true 表示已取消)
const activeTasks = new Map();

self.onmessage = async function(e) {
    const { type, payload, requestId } = e.data;

    if (type === 'CANCEL_TASK') {
        handleCancel(payload.requestId);
        return;
    }

    if (type === 'START_TASK') {
        // 标记任务为活跃状态
        activeTasks.set(requestId, false);

        try {
            const result = await runTask(payload, requestId);
            
            // 任务完成后，发送成功消息（如果未被取消）
            if (!isCancelled(requestId)) {
                self.postMessage({
                    type: 'TASK_SUCCESS',
                    requestId,
                    payload: result
                });
            }
        } catch (error) {
            if (!isCancelled(requestId)) {
                self.postMessage({
                    type: 'TASK_ERROR',
                    requestId,
                    payload: error.message
                });
            }
        } finally {
            // 清理任务状态
            activeTasks.delete(requestId);
        }
    }
};

/**
 * 标记任务为已取消
 */
function handleCancel(requestId) {
    if (activeTasks.has(requestId)) {
        activeTasks.set(requestId, true); // 设置取消标记
        // 通知主线程确认已收到取消指令（可选）
        console.log(`Worker: 收到取消指令 Task ${requestId}`);
    }
}

/**
 * 检查任务是否被取消
 */
function isCancelled(requestId) {
    return activeTasks.get(requestId) === true;
}

/**
 * 模拟执行一个耗时任务
 * 支持分块进度和取消检查
 */
async function runTask(params, requestId) {
    const { duration = 5000, step = 100, failAt = -1 } = params;
    let progress = 0;
    const totalSteps = duration / step;

    for (let i = 0; i < totalSteps; i++) {
        // 1. 检查取消点：每次循环开始前检查
        if (isCancelled(requestId)) {
            throw new Error('Task Cancelled by User');
        }

        // 2. 模拟耗时操作
        await sleep(step);

        // 模拟随机失败
        if (failAt > 0 && progress >= failAt) {
            throw new Error('Task Failed: Simulated Error');
        }

        // 3. 更新进度
        progress = Math.floor(((i + 1) / totalSteps) * 100);
        
        // 4. 发送进度消息
        self.postMessage({
            type: 'TASK_PROGRESS',
            requestId,
            payload: { progress }
        });
    }

    return { message: 'Task Completed', timestamp: Date.now() };
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
