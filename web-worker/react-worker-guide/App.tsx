import React from 'react';
import { useWorker } from './useWorker';

/**
 * 业务组件
 * 只关注 UI 状态（loading, result），不感知 Worker 存在
 */
const DataProcessor: React.FC = () => {
  const { compute, result, loading, error } = useWorker();

  const handleProcess = () => {
    // 生成一些测试数据
    const data = Array.from({ length: 10000 }, () => Math.random() * 100);
    compute(data);
  };

  return (
    <div className="card">
      <h2>📊 数据处理面板</h2>
      
      <div className="status-bar">
        {loading && <span className="tag loading">计算中...</span>}
        {error && <span className="tag error">错误: {error}</span>}
        {!loading && !error && <span className="tag idle">就绪</span>}
      </div>

      <div className="result-area">
        <h3>计算结果:</h3>
        <p className="result-value">{result !== null ? result.toFixed(2) : '--'}</p>
      </div>

      <button 
        onClick={handleProcess} 
        disabled={loading}
        className="primary-btn"
      >
        {loading ? '正在计算...' : '开始复杂计算'}
      </button>

      <p className="hint">
        点击按钮后，UI 不会卡顿，因为计算在 Worker 线程运行。
      </p>
    </div>
  );
};

export default DataProcessor;
