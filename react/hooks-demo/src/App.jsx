import { useState } from 'react'
import './App.css'
import CodeBlock from './components/CodeBlock'
import { hooksList } from './hooks'

function App() {
  const [selectedHook, setSelectedHook] = useState('useState')

  const currentHook = hooksList.find(h => h.id === selectedHook)
  const DemoComponent = currentHook?.component

  return (
    <div className="app">
      {/* 顶部导航栏 */}
      <header className="header">
        <div className="header-left">
          <span className="logo">⚛️</span>
          <h1>React 18 Hooks 演示</h1>
        </div>
        <div className="header-right">
          <label htmlFor="hook-select">选择 Hook：</label>
          <select
            id="hook-select"
            value={selectedHook}
            onChange={(e) => setSelectedHook(e.target.value)}
            className="hook-select"
          >
            <optgroup label="基础 Hooks">
              <option value="useState">1. useState</option>
              <option value="useEffect">2. useEffect</option>
              <option value="useContext">3. useContext</option>
            </optgroup>
            <optgroup label="额外 Hooks">
              <option value="useReducer">4. useReducer</option>
              <option value="useCallback">5. useCallback</option>
              <option value="useMemo">6. useMemo</option>
              <option value="useRef">7. useRef</option>
              <option value="useImperativeHandle">8. useImperativeHandle</option>
              <option value="useLayoutEffect">9. useLayoutEffect</option>
              <option value="useDebugValue">10. useDebugValue</option>
            </optgroup>
            <optgroup label="React 18 新增">
              <option value="useDeferredValue">11. useDeferredValue</option>
              <option value="useTransition">12. useTransition</option>
              <option value="useId">13. useId</option>
              <option value="useSyncExternalStore">14. useSyncExternalStore</option>
              <option value="useInsertionEffect">15. useInsertionEffect</option>
            </optgroup>
          </select>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="main-content">
        {/* 左侧：运行示例 */}
        <section className="demo-panel">
          <div className="panel-header">
            <h2>
              <span className="hook-name">{currentHook?.id}</span>
              <span className={`badge ${currentHook?.isReact18 ? 'react18' : 'classic'}`}>
                {currentHook?.isReact18 ? 'React 18' : 'React 16.8+'}
              </span>
            </h2>
            <p className="hook-desc">{currentHook?.description}</p>
          </div>
          <div className="demo-area">
            {DemoComponent && <DemoComponent />}
          </div>
        </section>

        {/* 右侧：代码展示 */}
        <section className="code-panel">
          <div className="panel-header">
            <h2>📝 代码示例</h2>
          </div>
          <div className="code-area">
            <CodeBlock code={currentHook?.code || ''} />
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
