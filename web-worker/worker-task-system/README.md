# Worker 任务系统设计与实现

这是一个演示如何构建健壮的 Web Worker 任务系统的 Demo。

## ✨ 特性

1. **Request ID 匹配**：
    - 主线程生成唯一 `requestId`。
    - Worker 在返回的所有消息（进度、成功、失败）中携带此 ID。
    - 主线程通过 Map 结构将 ID 映射回 Promise 的 `resolve/reject`。

2. **可取消 (Cancellation)**：
    - 主线程发送 `CANCEL_TASK` 消息。
    - Worker 维护一个 `activeTasks` Map，标记任务为已取消。
    - Worker 在耗时循环的关键节点（如每次循环开始）检查 `isCancelled(requestId)`，如果为 true 则抛出错误停止执行。

3. **进度反馈 (Progress)**：
    - Worker 周期性发送 `TASK_PROGRESS` 消息。
    - 主线程通过 `onProgress` 回调更新 UI。

4. **超时控制 (Timeout)**：
    - 主线程在 `runTask` 时启动 `setTimeout`。
    - 超时触发时，调用 `cancelTask` 主动放弃任务，并通知 Worker 停止计算。

## ❓ 核心问题解答

### 追问：Worker.terminate() 的代价是什么？

`terminate()` 是一个"核按钮"，它的代价主要体现在以下几个方面：

1. **状态彻底丢失**：
    - Worker 线程内的所有内存变量（全局变量、缓存、未完成的计算结果）会被立即销毁。
    - 如果 Worker 维护了大型数据索引（如本例中的倒排索引），重启后需要重新构建，成本巨大（可能需要几秒甚至更久）。

2. **所有并发任务失败**：
    - 不仅是超时的那个任务，所有正在排队或运行的其他任务都会被迫中断。
    - 主线程需要处理这些任务的 reject 逻辑。

3. **重新初始化成本**：
    - `new Worker()` 需要重新下载/解析 JS 文件。
    - 需要重新发送初始化数据（`INIT_DATA`），重新进行预处理。
    - 在初始化完成前，系统处于不可用状态。

### 最佳实践建议

- **优先使用软取消**：通过消息机制（如本 Demo 中的 `CANCEL_TASK`）通知 Worker 停止当前任务，保留 Worker 实例。
- **仅在死锁时 Terminate**：只有当 Worker 进入死循环（不再响应任何消息）时，才使用 `terminate()` 作为兜底手段。
- **使用 AbortController**：在现代浏览器中，也可以结合 `AbortController` 传递信号，但这通常用于 Fetch API，对于纯计算任务，还是需要 Worker 内部配合检查信号。

## 📂 文件结构

- `index.html`: 演示界面
- `main.js`: 任务管理器（主线程逻辑）
- `worker.js`: Worker 线程逻辑
