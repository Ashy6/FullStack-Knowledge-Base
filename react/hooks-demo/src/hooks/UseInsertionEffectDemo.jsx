import { useState, useInsertionEffect, useLayoutEffect, useEffect } from 'react'

// 样式缓存
const styleCache = new Map()
let styleId = 0

// 模拟 CSS-in-JS 的 useCSS Hook
function useCSS(rule) {
  useInsertionEffect(() => {
    if (!styleCache.has(rule)) {
      const id = `dynamic-style-${styleId++}`
      const style = document.createElement('style')
      style.id = id
      style.textContent = rule
      document.head.appendChild(style)
      styleCache.set(rule, { id, style })
      console.log(`[useInsertionEffect] 注入样式: ${id}`)
    }

    return () => {
      // 可选：清理样式（实际 CSS-in-JS 库可能会保留）
      // const cached = styleCache.get(rule)
      // if (cached) {
      //   document.head.removeChild(cached.style)
      //   styleCache.delete(rule)
      // }
    }
  }, [rule])
}

function UseInsertionEffectDemo() {
  const [color, setColor] = useState('#61dafb')
  const [logs, setLogs] = useState([])
  const [showBox, setShowBox] = useState(true)

  // 动态注入 CSS
  useCSS(`
    .dynamic-box {
      background: ${color};
      padding: 20px;
      border-radius: 12px;
      color: white;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
      transition: background 0.3s;
    }
  `)

  // 对比不同 Effect 的执行顺序
  useInsertionEffect(() => {
    setLogs(l => [...l, `1. useInsertionEffect (DOM变更前)`])
  }, [showBox])

  useLayoutEffect(() => {
    setLogs(l => [...l, `2. useLayoutEffect (DOM变更后，绘制前)`])
  }, [showBox])

  useEffect(() => {
    setLogs(l => [...l, `3. useEffect (绘制后)`])
  }, [showBox])

  const colors = [
    { value: '#61dafb', name: '青色' },
    { value: '#ff6b6b', name: '红色' },
    { value: '#4ecdc4', name: '绿色' },
    { value: '#ffd93d', name: '黄色' },
    { value: '#764ba2', name: '紫色' }
  ]

  return (
    <div className="demo-container">
      <div className="demo-section">
        <div className="demo-title">🎨 动态 CSS 注入</div>
        <p style={{ color: '#888', fontSize: 14, marginBottom: 12 }}>
          useInsertionEffect 在 DOM 变更前注入样式，避免闪烁
        </p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {colors.map(c => (
            <button
              key={c.value}
              className="color-btn"
              style={{
                background: c.value,
                borderColor: color === c.value ? '#fff' : 'transparent'
              }}
              onClick={() => setColor(c.value)}
              title={c.name}
            />
          ))}
        </div>

        {showBox && (
          <div className="dynamic-box">
            <p style={{ fontSize: 18, fontWeight: 'bold' }}>动态样式盒子</p>
            <p style={{ fontSize: 13, marginTop: 8 }}>
              当前颜色: {color}
            </p>
            <p style={{ fontSize: 12, marginTop: 4, opacity: 0.8 }}>
              样式通过 useInsertionEffect 注入
            </p>
          </div>
        )}
      </div>

      <div className="demo-section">
        <div className="demo-title">⏱️ Effect 执行顺序对比</div>
        <button
          className="btn"
          onClick={() => {
            setLogs([])
            setShowBox(s => !s)
          }}
        >
          切换盒子显示 (触发所有 Effects)
        </button>

        <div className="demo-result" style={{ marginTop: 12 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 12, lineHeight: 1.8 }}>
            {logs.length === 0 ? (
              <p style={{ color: '#666' }}>点击按钮查看执行顺序</p>
            ) : (
              logs.slice(-6).map((log, i) => (
                <p key={i} style={{
                  color: log.includes('Insertion') ? '#ff6b6b' :
                         log.includes('Layout') ? '#ffd93d' : '#4ecdc4'
                }}>
                  {log}
                </p>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-title">📊 三种 Effect 对比</div>
        <div className="demo-result">
          <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #3a3a5a' }}>
                <th style={{ textAlign: 'left', padding: '8px 0' }}>Hook</th>
                <th style={{ textAlign: 'left', padding: '8px 0' }}>执行时机</th>
                <th style={{ textAlign: 'left', padding: '8px 0' }}>用途</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ color: '#ff6b6b' }}>
                <td style={{ padding: '8px 0' }}>useInsertionEffect</td>
                <td>DOM 变更前</td>
                <td>CSS-in-JS</td>
              </tr>
              <tr style={{ color: '#ffd93d' }}>
                <td style={{ padding: '8px 0' }}>useLayoutEffect</td>
                <td>DOM 变更后</td>
                <td>读取 DOM</td>
              </tr>
              <tr style={{ color: '#4ecdc4' }}>
                <td style={{ padding: '8px 0' }}>useEffect</td>
                <td>浏览器绘制后</td>
                <td>副作用</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default UseInsertionEffectDemo

export const code = `import { useInsertionEffect } from 'react'

// 样式缓存
const styleCache = new Map()

// 模拟 CSS-in-JS 库的 useCSS Hook
function useCSS(rule) {
  useInsertionEffect(() => {
    // 检查缓存，避免重复注入
    if (!styleCache.has(rule)) {
      // 创建 style 元素
      const style = document.createElement('style')
      style.textContent = rule
      document.head.appendChild(style)
      styleCache.set(rule, style)
    }

    // 可选：返回清理函数
    return () => {
      // 清理逻辑
    }
  }, [rule])
}

// 使用
function Component() {
  const [color, setColor] = useState('#61dafb')

  // 动态生成的 CSS 会在 DOM 变更前注入
  useCSS(\`
    .dynamic-box {
      background: \${color};
      padding: 20px;
    }
  \`)

  return <div className="dynamic-box">内容</div>
}

/*
  💡 执行顺序：
  ┌─────────────────────────────────────────────────┐
  │ useInsertionEffect → DOM更新 → useLayoutEffect  │
  │                               → 绘制 → useEffect │
  └─────────────────────────────────────────────────┘

  💡 要点：
  1. 专为 CSS-in-JS 库设计
  2. 在 DOM 变更前同步执行
  3. 不能访问 refs（DOM 还未更新）
  4. 避免样式闪烁（FOUC）

  使用场景：
  - CSS-in-JS 库实现（styled-components, emotion）
  - 动态样式注入
  - 需要在布局计算前注入样式

  注意：
  - 普通应用开发者很少直接使用
  - 主要供库作者使用
*/`
