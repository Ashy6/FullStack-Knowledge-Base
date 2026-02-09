import { useState, useMemo } from 'react'

// 模拟昂贵计算
function expensiveCalculation(num) {
  console.log('💰 执行昂贵计算...')
  let result = 0
  for (let i = 0; i < 1000000; i++) {
    result += num
  }
  return result
}

function UseMemoDemo() {
  const [count, setCount] = useState(5)
  const [dark, setDark] = useState(false)
  const [calcCount, setCalcCount] = useState(0)

  // ✅ 使用 useMemo 缓存计算结果
  const memoizedResult = useMemo(() => {
    setCalcCount(c => c + 1)
    return expensiveCalculation(count)
  }, [count])

  // ✅ 使用 useMemo 缓存对象引用
  const themeStyles = useMemo(() => ({
    background: dark ? '#1a1a2e' : '#f5f5f5',
    color: dark ? '#fff' : '#333',
    padding: '16px',
    borderRadius: '8px',
    transition: 'all 0.3s',
    border: `2px solid ${dark ? '#3a3a5a' : '#ddd'}`
  }), [dark])

  return (
    <div className="demo-container">
      <div className="demo-section">
        <div className="demo-title">💾 昂贵计算缓存</div>
        <p style={{ color: '#888', fontSize: 14, marginBottom: 12 }}>
          只有当依赖值变化时才重新计算（查看控制台）
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <label>输入数字:</label>
          <input
            type="number"
            className="input"
            value={count}
            onChange={e => setCount(Number(e.target.value) || 0)}
            style={{ width: 100 }}
          />
        </div>

        <div className="demo-result">
          <p>输入值: <span className="highlight">{count}</span></p>
          <p>计算结果: <span className="highlight">{memoizedResult.toLocaleString()}</span></p>
          <p>计算次数: <span className="highlight">{calcCount}</span></p>
          <p style={{ fontSize: 12, marginTop: 8, color: '#888' }}>
            只有修改数字才会重新计算，切换主题不会
          </p>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-title">🎨 对象引用缓存</div>
        <p style={{ color: '#888', fontSize: 14, marginBottom: 12 }}>
          缓存样式对象，避免每次渲染创建新引用
        </p>

        <button
          className="btn"
          onClick={() => setDark(d => !d)}
        >
          切换主题: {dark ? '深色' : '浅色'}
        </button>

        <div style={themeStyles}>
          <p>这个盒子的样式被 useMemo 缓存</p>
          <p style={{ fontSize: 12, marginTop: 8, opacity: 0.7 }}>
            只有 dark 变化时才创建新的样式对象
          </p>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-title">🔬 验证缓存效果</div>
        <button
          className="btn btn-secondary"
          onClick={() => setDark(d => !d)}
        >
          切换主题（不触发计算）
        </button>
        <div className="demo-result">
          <p style={{ fontSize: 13 }}>
            切换主题只会更新样式，不会触发昂贵计算。
            查看控制台确认 "执行昂贵计算" 只在修改数字时出现。
          </p>
        </div>
      </div>
    </div>
  )
}

export default UseMemoDemo

export const code = `import { useState, useMemo } from 'react'

// 模拟昂贵计算
function expensiveCalculation(num) {
  console.log('执行昂贵计算...')
  let result = 0
  for (let i = 0; i < 1000000; i++) {
    result += num
  }
  return result
}

function Demo() {
  const [count, setCount] = useState(5)
  const [dark, setDark] = useState(false)

  // 1. 缓存昂贵计算结果
  // 只有 count 变化时才重新计算
  const result = useMemo(() => {
    return expensiveCalculation(count)
  }, [count])

  // 2. 缓存对象引用
  // 避免每次渲染创建新对象，导致子组件重渲染
  const themeStyles = useMemo(() => ({
    background: dark ? '#333' : '#fff',
    color: dark ? '#fff' : '#333'
  }), [dark])

  return (
    <div>
      <input
        value={count}
        onChange={e => setCount(Number(e.target.value))}
      />
      <p>结果: {result}</p>

      <button onClick={() => setDark(!dark)}>
        切换主题
      </button>
      <div style={themeStyles}>主题盒子</div>
    </div>
  )
}

/*
  💡 useMemo vs useCallback：
  - useMemo: 缓存计算结果（值）
  - useCallback: 缓存函数引用

  使用场景：
  1. 昂贵的计算（大数组过滤、排序等）
  2. 保持对象引用稳定
  3. 避免子组件不必要的重渲染

  注意：
  - 不要过度优化，简单计算不需要 useMemo
  - 依赖数组必须包含所有使用的变量
*/`
