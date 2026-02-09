import { useState, useLayoutEffect, useEffect, useRef } from 'react'

function UseLayoutEffectDemo() {
  const [show, setShow] = useState(false)
  const [position, setPosition] = useState({ width: 0, height: 0, top: 0, left: 0 })
  const boxRef = useRef()

  // useLayoutEffect: DOM 更新后、浏览器绘制前同步执行
  useLayoutEffect(() => {
    if (show && boxRef.current) {
      const rect = boxRef.current.getBoundingClientRect()
      setPosition({
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        top: Math.round(rect.top),
        left: Math.round(rect.left)
      })
    }
  }, [show])

  return (
    <div className="demo-container">
      <div className="demo-section">
        <div className="demo-title">📐 同步读取 DOM 尺寸</div>
        <p style={{ color: '#888', fontSize: 14, marginBottom: 12 }}>
          useLayoutEffect 在绘制前执行，避免布局闪烁
        </p>

        <button className="btn" onClick={() => setShow(s => !s)}>
          {show ? '隐藏' : '显示'} 元素
        </button>

        {show && (
          <div
            ref={boxRef}
            style={{
              width: '200px',
              height: '100px',
              background: 'linear-gradient(135deg, #61dafb 0%, #764ba2 100%)',
              borderRadius: 12,
              marginTop: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 'bold'
            }}
          >
            目标元素
          </div>
        )}

        <div className="demo-result" style={{ marginTop: 16 }}>
          <p>宽度: <span className="highlight">{position.width}px</span></p>
          <p>高度: <span className="highlight">{position.height}px</span></p>
          <p>top: <span className="highlight">{position.top}px</span></p>
          <p>left: <span className="highlight">{position.left}px</span></p>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-title">⚡ useLayoutEffect vs useEffect</div>
        <ComparisonDemo />
      </div>
    </div>
  )
}

// 对比演示组件
function ComparisonDemo() {
  const [value, setValue] = useState(0)
  const [layoutLog, setLayoutLog] = useState('')
  const [effectLog, setEffectLog] = useState('')

  useLayoutEffect(() => {
    setLayoutLog(`useLayoutEffect: ${value} (同步，绘制前)`)
  }, [value])

  useEffect(() => {
    setEffectLog(`useEffect: ${value} (异步，绘制后)`)
  }, [value])

  return (
    <div className="demo-result">
      <button
        className="btn"
        onClick={() => setValue(v => v + 1)}
        style={{ marginBottom: 12 }}
      >
        更新值: {value}
      </button>
      <div style={{ fontSize: 13, lineHeight: 1.8 }}>
        <p style={{ color: '#ff6b6b' }}>{layoutLog || '等待更新...'}</p>
        <p style={{ color: '#4ecdc4' }}>{effectLog || '等待更新...'}</p>
      </div>
      <div style={{ fontSize: 12, color: '#888', marginTop: 12, lineHeight: 1.6 }}>
        <p>🔴 useLayoutEffect: 同步执行，阻塞浏览器绘制</p>
        <p>🟢 useEffect: 异步执行，不阻塞绘制</p>
      </div>
    </div>
  )
}

export default UseLayoutEffectDemo

export const code = `import { useState, useLayoutEffect, useRef } from 'react'

function Demo() {
  const [show, setShow] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const boxRef = useRef()

  // useLayoutEffect: DOM 更新后、浏览器绘制前执行
  useLayoutEffect(() => {
    if (show && boxRef.current) {
      // 同步读取 DOM 布局信息
      const rect = boxRef.current.getBoundingClientRect()
      // 同步更新状态（不会看到闪烁）
      setPosition({ top: rect.top, left: rect.left })
    }
  }, [show])

  return (
    <div>
      <button onClick={() => setShow(!show)}>
        切换显示
      </button>

      {show && (
        <div ref={boxRef}>目标元素</div>
      )}

      <p>位置: {position.top}, {position.left}</p>
    </div>
  )
}

/*
  💡 useLayoutEffect vs useEffect：

  执行时机：
  ┌─────────────────────────────────────────────────┐
  │  渲染 → DOM更新 → useLayoutEffect → 浏览器绘制   │
  │                                    ↓            │
  │                              useEffect          │
  └─────────────────────────────────────────────────┘

  useLayoutEffect:
  - 同步执行，阻塞绘制
  - 用于需要同步读取/修改 DOM 的场景
  - 避免视觉闪烁

  useEffect:
  - 异步执行，不阻塞绘制
  - 用于大多数副作用（数据获取、订阅等）
  - 性能更好

  使用场景：
  - 测量 DOM 元素尺寸/位置
  - 基于 DOM 测量同步更新状态
  - 防止工具提示/弹窗位置闪烁
  - 初始滚动定位/恢复滚动
*/`

