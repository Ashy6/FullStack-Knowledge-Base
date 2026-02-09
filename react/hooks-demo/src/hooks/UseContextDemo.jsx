import { useState, useContext, createContext } from 'react'

// 创建 Context
const ThemeContext = createContext('dark')
const UserContext = createContext({ name: '游客', role: '访客' })

// 子组件：消费 Context
function ThemedCard() {
  const theme = useContext(ThemeContext)
  const user = useContext(UserContext)

  return (
    <div className={`theme-box theme-${theme}`}>
      <p>🎨 当前主题: <span className="highlight">{theme}</span></p>
      <p>👤 当前用户: <span className="highlight">{user.name}</span> ({user.role})</p>
      <p style={{ fontSize: 12, marginTop: 8, opacity: 0.7 }}>
        这个组件通过 useContext 直接获取数据，无需 props 层层传递
      </p>
    </div>
  )
}

// 深层嵌套组件
function DeepNestedComponent() {
  const theme = useContext(ThemeContext)

  return (
    <div style={{
      marginTop: 12,
      padding: 12,
      background: theme === 'dark' ? '#2a2a4a' : '#e0e0e0',
      borderRadius: 6,
      fontSize: 13
    }}>
      🔗 深层嵌套组件也能直接访问 Context
    </div>
  )
}

function UseContextDemo() {
  const [theme, setTheme] = useState('dark')
  const [user, setUser] = useState({ name: '李四', role: '管理员' })

  return (
    <div className="demo-container">
      <div className="demo-section">
        <div className="demo-title">🌐 主题和用户上下文</div>
        <p style={{ color: '#888', fontSize: 14, marginBottom: 16 }}>
          使用 Context 实现跨组件数据共享，避免 props drilling
        </p>

        <div style={{ marginBottom: 16 }}>
          <button
            className="btn"
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
          >
            切换主题 ({theme})
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setUser(u => ({
              ...u,
              name: u.name === '李四' ? '王五' : '李四',
              role: u.role === '管理员' ? '用户' : '管理员'
            }))}
          >
            切换用户
          </button>
        </div>

        {/* Provider 提供值 */}
        <ThemeContext.Provider value={theme}>
          <UserContext.Provider value={user}>
            <div className="demo-result" style={{ background: 'transparent', padding: 0 }}>
              <ThemedCard />
              <DeepNestedComponent />
            </div>
          </UserContext.Provider>
        </ThemeContext.Provider>
      </div>

      <div className="demo-section">
        <div className="demo-title">💡 Context 结构说明</div>
        <div className="demo-result">
          <pre style={{ fontSize: 12, lineHeight: 1.6 }}>
{`App (Provider)
 └── ThemedCard (Consumer)
      └── 直接访问 theme 和 user
 └── DeepNestedComponent
      └── 同样直接访问，无需 props`}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default UseContextDemo

export const code = `import { useState, useContext, createContext } from 'react'

// 1. 创建 Context（可设置默认值）
const ThemeContext = createContext('dark')
const UserContext = createContext({ name: '游客' })

// 2. 子组件中消费 Context
function ThemedCard() {
  // 使用 useContext 获取最近的 Provider 值
  const theme = useContext(ThemeContext)
  const user = useContext(UserContext)

  return (
    <div className={\`theme-\${theme}\`}>
      <p>主题: {theme}</p>
      <p>用户: {user.name}</p>
    </div>
  )
}

// 3. 父组件提供 Context 值
function App() {
  const [theme, setTheme] = useState('dark')
  const [user, setUser] = useState({ name: '李四' })

  return (
    // Provider 包裹需要访问数据的组件树
    <ThemeContext.Provider value={theme}>
      <UserContext.Provider value={user}>
        <ThemedCard />
        {/* 任意深度的子组件都可以访问 */}
      </UserContext.Provider>
    </ThemeContext.Provider>
  )
}

/*
  💡 要点：
  1. createContext(defaultValue) 创建上下文
  2. <Context.Provider value={...}> 提供值
  3. useContext(Context) 消费值

  适用场景：
  - 主题切换
  - 用户认证状态
  - 多语言国际化
  - 全局配置
*/`
