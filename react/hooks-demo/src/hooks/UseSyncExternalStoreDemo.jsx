import { useSyncExternalStore, useCallback } from 'react'

// ==========================================
// 创建一个简单的外部 Store
// ==========================================
function createStore(initialState) {
  let state = initialState
  const listeners = new Set()

  return {
    getState: () => state,
    setState: (newState) => {
      state = typeof newState === 'function' ? newState(state) : newState
      listeners.forEach(listener => listener())
    },
    subscribe: (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    }
  }
}

// 全局计数器 Store
const counterStore = createStore({ count: 0, lastUpdate: null })

// 窗口尺寸快照（需要缓存以保持引用稳定）
let windowSizeSnapshot = { width: window.innerWidth, height: window.innerHeight }
function getWindowSizeSnapshot() {
  const { innerWidth: width, innerHeight: height } = window
  if (windowSizeSnapshot.width !== width || windowSizeSnapshot.height !== height) {
    windowSizeSnapshot = { width, height }
  }
  return windowSizeSnapshot
}

// ==========================================
// 演示组件
// ==========================================
function UseSyncExternalStoreDemo() {
  // 订阅外部 Store
  const { count, lastUpdate } = useSyncExternalStore(
    counterStore.subscribe,
    counterStore.getState
  )

  // 订阅浏览器 API：窗口尺寸
  const windowSize = useSyncExternalStore(
    useCallback((callback) => {
      window.addEventListener('resize', callback)
      return () => window.removeEventListener('resize', callback)
    }, []),
    getWindowSizeSnapshot
  )

  // 订阅浏览器 API：在线状态
  const isOnline = useSyncExternalStore(
    useCallback((callback) => {
      window.addEventListener('online', callback)
      window.addEventListener('offline', callback)
      return () => {
        window.removeEventListener('online', callback)
        window.removeEventListener('offline', callback)
      }
    }, []),
    () => navigator.onLine
  )

  const updateCounter = (delta) => {
    counterStore.setState(state => ({
      count: state.count + delta,
      lastUpdate: new Date().toLocaleTimeString()
    }))
  }

  return (
    <div className="demo-container">
      <div className="demo-section">
        <div className="demo-title">🔌 订阅外部 Store</div>
        <p style={{ color: '#888', fontSize: 14, marginBottom: 12 }}>
          使用自定义 Store（类似 Redux/Zustand）
        </p>

        <div className="counter-display">{count}</div>
        <div style={{ textAlign: 'center' }}>
          <button className="btn" onClick={() => updateCounter(1)}>+1</button>
          <button className="btn" onClick={() => updateCounter(-1)}>-1</button>
          <button
            className="btn btn-secondary"
            onClick={() => counterStore.setState({ count: 0, lastUpdate: null })}
          >
            重置
          </button>
        </div>

        <div className="demo-result" style={{ marginTop: 12 }}>
          <p>计数: <span className="highlight">{count}</span></p>
          <p>最后更新: <span className="highlight">{lastUpdate || '无'}</span></p>
          <p style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
            数据来自 React 外部的 Store
          </p>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-title">📐 订阅窗口尺寸</div>
        <div className="demo-result">
          <p>宽度: <span className="highlight">{windowSize.width}px</span></p>
          <p>高度: <span className="highlight">{windowSize.height}px</span></p>
          <p style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
            调整浏览器窗口大小查看变化
          </p>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-title">🌐 订阅网络状态</div>
        <div className="demo-result">
          <p>
            网络状态:{' '}
            <span className="highlight" style={{ color: isOnline ? '#4ecdc4' : '#ff6b6b' }}>
              {isOnline ? '🟢 在线' : '🔴 离线'}
            </span>
          </p>
          <p style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
            尝试断开网络连接
          </p>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-title">💡 工作原理</div>
        <div className="demo-result">
          <pre style={{ fontSize: 12, lineHeight: 1.6, margin: 0 }}>
{`useSyncExternalStore(
  subscribe,    // 订阅函数
  getSnapshot   // 获取当前状态
)

特点：
• 确保并发渲染时数据一致性
• 自动处理订阅/取消订阅
• SSR 支持（可选第三个参数）`}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default UseSyncExternalStoreDemo

export const code = `import { useSyncExternalStore } from 'react'

// 1. 创建外部 Store（类似 Redux/Zustand）
function createStore(initialState) {
  let state = initialState
  const listeners = new Set()

  return {
    getState: () => state,
    setState: (newState) => {
      state = typeof newState === 'function'
        ? newState(state)
        : newState
      // 通知所有订阅者
      listeners.forEach(listener => listener())
    },
    subscribe: (listener) => {
      listeners.add(listener)
      // 返回取消订阅函数
      return () => listeners.delete(listener)
    }
  }
}

const counterStore = createStore({ count: 0 })

// 2. 在组件中使用
function Counter() {
  const state = useSyncExternalStore(
    counterStore.subscribe,  // 订阅函数
    counterStore.getState    // 获取快照函数
  )

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() =>
        counterStore.setState(s => ({ count: s.count + 1 }))
      }>
        +1
      </button>
    </div>
  )
}

// 3. 订阅浏览器 API
function WindowSize() {
  const size = useSyncExternalStore(
    (callback) => {
      window.addEventListener('resize', callback)
      return () => window.removeEventListener('resize', callback)
    },
    () => ({ width: innerWidth, height: innerHeight })
  )

  return <p>{size.width} x {size.height}</p>
}

/*
  💡 要点：
  1. 用于订阅 React 外部的数据源
  2. 确保并发渲染时数据一致性
  3. 比 useEffect + useState 更可靠

  参数：
  - subscribe: (callback) => unsubscribe
  - getSnapshot: () => state
  - getServerSnapshot?: () => state (SSR)

  使用场景：
  - 状态管理库（Redux、Zustand 等）
  - 浏览器 API（resize、online/offline）
  - 第三方数据源
*/`
