import { useState, useEffect, use } from 'react'

function UseEffectDemo() {
  const [count, setCount] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [data, setData] = useState(null)
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(true)

  useEffect(() => {
    console.log('输入框内容:', inputValue)
  }, [inputValue])

  // 依赖 count 变化时执行
  useEffect(() => {
    document.title = `点击了 ${count} 次`
    return () => {
      document.title = 'React Hooks Demo'
    }
  }, [count])

  // 模拟数据获取（挂载时执行一次）
  useEffect(() => {
    const fetchData = async () => {
      await new Promise(r => setTimeout(r, 1500))
      setData({
        message: '数据加载成功！',
        time: new Date().toLocaleTimeString()
      })
    }
    fetchData()
  }, [])

  // 定时器（带清理函数）
  useEffect(() => {
    if (!isRunning) return

    const timer = setInterval(() => {
      setSeconds(s => s + 1)
    }, 1000)

    return () => clearInterval(timer) // 清理函数
  }, [isRunning])

  return (
    <div className="demo-container">
      {/* 输入框内容改变 */}
      <div className="demo-section">
        <div className="demo-title">✏️ 输入框（无依赖数组）</div>
        <input
          type="text"
          className="input"
          placeholder="输入内容，观察控制台日志"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
        />
      </div>

      {/* 文档标题更新 */}
      <div className="demo-section">
        <div className="demo-title">📄 更新文档标题（依赖数组）</div>
        <p style={{ color: '#888', fontSize: 14, marginBottom: 12 }}>
          点击按钮，观察浏览器标签页标题变化
        </p>
        <button className="btn" onClick={() => setCount(c => c + 1)}>
          点击次数: {count}
        </button>
      </div>

      {/* 数据获取 */}
      <div className="demo-section">
        <div className="demo-title">🔄 数据获取（空依赖数组）</div>
        <div className="demo-result">
          {data ? (
            <>
              <p>状态: <span className="highlight">{data.message}</span></p>
              <p>加载时间: <span className="highlight">{data.time}</span></p>
            </>
          ) : (
            <p className="loading">⏳ 数据加载中...</p>
          )}
        </div>
      </div>

      {/* 定时器 */}
      <div className="demo-section">
        <div className="demo-title">⏱️ 定时器（清理函数）</div>
        <div className="demo-result">
          <p>已运行: <span className="highlight">{seconds}</span> 秒</p>
          <p>状态: <span className="highlight">{isRunning ? '运行中' : '已暂停'}</span></p>
        </div>
        <button
          className={`btn ${isRunning ? 'btn-danger' : ''}`}
          onClick={() => setIsRunning(!isRunning)}
        >
          {isRunning ? '暂停' : '继续'}
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => setSeconds(0)}
        >
          重置
        </button>
      </div>
    </div>
  )
}

export default UseEffectDemo

export const code = `import { useState, useEffect } from 'react'

function UseEffectDemo() {
  const [count, setCount] = useState(0)
  const [data, setData] = useState(null)
  const [seconds, setSeconds] = useState(0)

  // 1. 依赖数组：当 count 变化时执行
  useEffect(() => {
    document.title = \`点击了 \${count} 次\`

    // 清理函数：组件卸载或下次执行前调用
    return () => {
      document.title = 'React App'
    }
  }, [count]) // 依赖数组

  // 2. 空依赖数组：仅在挂载时执行一次
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/data')
      const result = await response.json()
      setData(result)
    }
    fetchData()
  }, []) // 空数组 = 仅挂载时执行

  // 3. 定时器示例：必须清理防止内存泄漏
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(s => s + 1)
    }, 1000)

    // 清理：组件卸载时停止定时器
    return () => clearInterval(timer)
  }, [])

  return <div>...</div>
}

/*
  💡 要点：
  1. 依赖数组控制执行时机：
     - [dep1, dep2]：依赖变化时执行
     - []：仅挂载时执行一次
     - 不传：每次渲染都执行（慎用）

  2. 清理函数用于：
     - 取消订阅
     - 清除定时器
     - 取消网络请求
*/`
