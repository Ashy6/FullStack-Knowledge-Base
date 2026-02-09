import { useState, useRef, useEffect } from 'react'

function UseRefDemo() {
  const [value, setValue] = useState('')
  const inputRef = useRef(null)
  const renderCount = useRef(0)
  const previousValue = useRef('')

  // 记录渲染次数（不触发重渲染）
  renderCount.current++

  // 记录上一次的值
  useEffect(() => {
    previousValue.current = value
  }, [value])

  return (
    <div className="demo-container">
      <div className="demo-section">
        <div className="demo-title">🔗 访问 DOM 元素</div>
        <p style={{ color: '#888', fontSize: 14, marginBottom: 12 }}>
          通过 ref 直接操作 DOM 元素
        </p>

        <input
          ref={inputRef}
          className="input"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="输入内容..."
          style={{ width: 200 }}
        />

        <div style={{ marginTop: 12 }}>
          <button
            className="btn"
            onClick={() => inputRef.current.focus()}
          >
            聚焦输入框
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => inputRef.current.select()}
          >
            选中文本
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => {
              inputRef.current.style.background = '#61dafb33'
              setTimeout(() => {
                inputRef.current.style.background = ''
              }, 500)
            }}
          >
            闪烁效果
          </button>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-title">📊 存储可变值（不触发重渲染）</div>
        <div className="demo-result">
          <p>当前值: <span className="highlight">{value || '(空)'}</span></p>
          <p>上一次值: <span className="highlight">{previousValue.current || '(空)'}</span></p>
          <p>渲染次数: <span className="highlight">{renderCount.current}</span></p>
        </div>
        <p style={{ fontSize: 12, color: '#888', marginTop: 8 }}>
          renderCount 使用 useRef 存储，更新时不会触发重渲染
        </p>
      </div>

      <div className="demo-section">
        <div className="demo-title">⏱️ 定时器 ID 存储示例</div>
        <TimerExample />
      </div>
    </div>
  )
}

// 定时器示例组件
function TimerExample() {
  const [count, setCount] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const timerRef = useRef(null)

  const start = () => {
    if (timerRef.current) return
    setIsRunning(true)
    timerRef.current = setInterval(() => {
      setCount(c => c + 1)
    }, 100)
  }

  const stop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
      setIsRunning(false)
    }
  }

  const reset = () => {
    stop()
    setCount(0)
  }

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  return (
    <div className="demo-result">
      <p style={{ fontSize: 24, fontWeight: 'bold', color: '#61dafb' }}>
        {(count / 10).toFixed(1)}s
      </p>
      <div style={{ marginTop: 8 }}>
        <button className="btn" onClick={start} disabled={isRunning}>
          开始
        </button>
        <button className="btn btn-secondary" onClick={stop} disabled={!isRunning}>
          停止
        </button>
        <button className="btn btn-danger" onClick={reset}>
          重置
        </button>
      </div>
      <p style={{ fontSize: 12, color: '#888', marginTop: 8 }}>
        定时器 ID 存储在 useRef 中，便于清理
      </p>
    </div>
  )
}

export default UseRefDemo

export const code = `import { useState, useRef, useEffect } from 'react'

function Demo() {
  const [value, setValue] = useState('')

  // 1. 访问 DOM 元素
  const inputRef = useRef(null)

  // 2. 存储可变值（不触发重渲染）
  const renderCount = useRef(0)
  const previousValue = useRef('')

  // 每次渲染递增（但不触发新渲染）
  renderCount.current++

  // 保存上一次的值
  useEffect(() => {
    previousValue.current = value
  }, [value])

  // 3. 存储定时器 ID
  const timerRef = useRef(null)

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      console.log('tick')
    }, 1000)
  }

  const stopTimer = () => {
    clearInterval(timerRef.current)
  }

  return (
    <div>
      <input
        ref={inputRef}
        value={value}
        onChange={e => setValue(e.target.value)}
      />

      {/* 操作 DOM */}
      <button onClick={() => inputRef.current.focus()}>
        聚焦
      </button>

      <p>渲染次数: {renderCount.current}</p>
      <p>上一次值: {previousValue.current}</p>
    </div>
  )
}

/*
  💡 useRef 特点：
  1. 返回一个可变的 ref 对象 { current: value }
  2. 在组件整个生命周期保持不变
  3. 修改 .current 不会触发重渲染

  使用场景：
  - 访问 DOM 元素
  - 存储定时器/订阅 ID
  - 保存上一次的值
  - 任何需要跨渲染保持的可变值
*/`
