import { useState, useEffect, useDebugValue } from 'react'

// 自定义 Hook: 网络状态
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // 在 React DevTools 中显示
  useDebugValue(isOnline ? '🟢 在线' : '🔴 离线')

  return isOnline
}

// 自定义 Hook: 表单输入
function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue)

  // 使用格式化函数（仅在 DevTools 打开时执行）
  useDebugValue(value, val => `输入值: "${val}"`)

  return {
    value,
    onChange: e => setValue(e.target.value),
    reset: () => setValue(initialValue)
  }
}

// 自定义 Hook: 本地存储
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  // 复杂格式化，仅在需要时执行
  useDebugValue({ key, value }, state =>
    `localStorage["${state.key}"] = ${JSON.stringify(state.value)}`
  )

  return [value, setValue]
}

function UseDebugValueDemo() {
  const isOnline = useOnlineStatus()
  const nameInput = useFormInput('')
  const [theme, setTheme] = useLocalStorage('demo-theme', 'dark')

  return (
    <div className="demo-container">
      <div className="demo-section">
        <div className="demo-title">🐛 在 React DevTools 中查看</div>
        <p style={{ color: '#888', fontSize: 14, marginBottom: 16 }}>
          打开 React DevTools → Components，选中此组件，查看 Hooks 面板
        </p>

        <div className="demo-result">
          <p style={{ fontSize: 13, lineHeight: 2 }}>
            DevTools 中会显示：
          </p>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, lineHeight: 1.8 }}>
            <li><code>OnlineStatus: "🟢 在线"</code></li>
            <li><code>FormInput: '输入值: "xxx"'</code></li>
            <li><code>LocalStorage: 'localStorage["demo-theme"] = "dark"'</code></li>
          </ul>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-title">🌐 useOnlineStatus Hook</div>
        <div className="demo-result">
          <p>
            网络状态: {' '}
            <span className="highlight" style={{ color: isOnline ? '#4ecdc4' : '#ff6b6b' }}>
              {isOnline ? '🟢 在线' : '🔴 离线'}
            </span>
          </p>
          <p style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
            尝试断开网络连接查看变化
          </p>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-title">📝 useFormInput Hook</div>
        <input
          {...nameInput}
          className="input"
          placeholder="输入内容..."
          style={{ width: 200 }}
        />
        <button className="btn btn-secondary" onClick={nameInput.reset}>
          重置
        </button>
        <div className="demo-result">
          <p>当前值: <span className="highlight">"{nameInput.value}"</span></p>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-title">💾 useLocalStorage Hook</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className={`btn ${theme === 'dark' ? '' : 'btn-secondary'}`}
            onClick={() => setTheme('dark')}
          >
            深色
          </button>
          <button
            className={`btn ${theme === 'light' ? '' : 'btn-secondary'}`}
            onClick={() => setTheme('light')}
          >
            浅色
          </button>
        </div>
        <div className="demo-result">
          <p>存储的主题: <span className="highlight">{theme}</span></p>
          <p style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
            刷新页面后值仍然保持
          </p>
        </div>
      </div>
    </div>
  )
}

export default UseDebugValueDemo

export const code = `import { useState, useDebugValue } from 'react'

// 自定义 Hook: 网络状态
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  // 在 React DevTools 中显示标签
  useDebugValue(isOnline ? '🟢 在线' : '🔴 离线')

  return isOnline
}

// 自定义 Hook: 表单输入
function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue)

  // 使用格式化函数（延迟执行，仅在 DevTools 打开时）
  useDebugValue(value, val => \`输入值: "\${val}"\`)

  return { value, onChange: e => setValue(e.target.value) }
}

// 自定义 Hook: 本地存储
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : initialValue
  })

  // 复杂对象的格式化
  useDebugValue({ key, value }, state =>
    \`localStorage["\${state.key}"] = \${JSON.stringify(state.value)}\`
  )

  return [value, setValue]
}

/*
  💡 要点：
  1. 仅用于自定义 Hook 的调试
  2. 在 React DevTools 的 Hooks 面板显示
  3. 格式化函数仅在 DevTools 打开时执行
  4. 生产环境中不会有性能影响

  语法：
  - useDebugValue(value)
  - useDebugValue(value, formatFn)

  使用场景：
  - 调试复杂的自定义 Hook
  - 在 DevTools 中快速查看 Hook 状态
  - 开发共享 Hook 库时提供更好的调试体验
*/`
