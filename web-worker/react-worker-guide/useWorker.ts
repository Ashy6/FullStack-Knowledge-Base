import { useEffect, useRef, useState, useCallback } from 'react';
import type { WorkerMessage, WorkerResponse } from './worker';

// Worker 实例管理器（单例模式）
// 避免组件重渲染导致 Worker 重复创建
class WorkerSingleton {
  private static instance: Worker | null = null;

  static getInstance(): Worker {
    if (!this.instance) {
      // Vite 语法: new URL('./worker.ts', import.meta.url)
      // type: 'module' 允许在 Worker 中使用 import/export
      this.instance = new Worker(
        new URL('./worker.ts', import.meta.url), 
        { type: 'module' }
      );
    }
    return this.instance;
  }
}

/**
 * useWorker Hook
 * 封装了 Worker 的通信逻辑，让组件像使用普通 Hook 一样使用 Worker
 */
export function useWorker() {
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // 1. 获取 Worker 实例
    // 懒加载：只有当组件挂载时才初始化 Worker
    workerRef.current = WorkerSingleton.getInstance();

    // 2. 设置监听器
    const handleMessage = (e: MessageEvent<WorkerResponse>) => {
      const { type } = e.data;
      
      switch (type) {
        case 'RESULT':
          setResult(e.data.payload);
          setLoading(false);
          break;
        case 'ERROR':
          setError(e.data.error);
          setLoading(false);
          break;
      }
    };

    workerRef.current.addEventListener('message', handleMessage);

    // 3. 清理监听器（注意：通常不 terminate 单例 Worker，除非确定不再需要）
    return () => {
      workerRef.current?.removeEventListener('message', handleMessage);
    };
  }, []);

  // 暴露给 UI 的调用方法
  const compute = useCallback((data: number[]) => {
    setLoading(true);
    setError(null);
    
    workerRef.current?.postMessage({ 
      type: 'COMPUTE', 
      payload: data 
    } as WorkerMessage);
  }, []);

  return { compute, result, loading, error };
}
