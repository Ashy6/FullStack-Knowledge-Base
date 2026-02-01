/// <reference lib="webworker" />

// 1. 定义消息类型，确保类型安全
export type WorkerMessage = 
  | { type: 'COMPUTE'; payload: number[] }
  | { type: 'PING' };

export type WorkerResponse = 
  | { type: 'RESULT'; payload: number }
  | { type: 'PONG' }
  | { type: 'ERROR'; error: string };

// 2. 声明 self 类型
declare const self: DedicatedWorkerGlobalScope;

// 3. 核心逻辑
self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const { type } = e.data;

  try {
    switch (type) {
      case 'COMPUTE':
        // 模拟重计算
        const result = heavyComputation(e.data.payload);
        self.postMessage({ type: 'RESULT', payload: result });
        break;
        
      case 'PING':
        self.postMessage({ type: 'PONG' });
        break;
    }
  } catch (err) {
    self.postMessage({ 
      type: 'ERROR', 
      error: err instanceof Error ? err.message : 'Unknown error' 
    });
  }
};

// 模拟耗时操作
function heavyComputation(data: number[]): number {
  console.log('Worker: Starting heavy computation...');
  const start = performance.now();
  
  // 模拟大量计算
  const result = data.reduce((acc, curr) => acc + Math.sqrt(curr), 0);
  
  // 模拟耗时
  while (performance.now() - start < 1000) {} 
  
  return result;
}

export {}; // 确保这是个模块
