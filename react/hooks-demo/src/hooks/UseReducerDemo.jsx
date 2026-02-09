import { useReducer, useState } from 'react'

// Reducer 函数
const initialState = { count: 0, history: [] }

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {
        count: state.count + 1,
        history: [...state.history, `+1 → ${state.count + 1}`]
      }
    case 'decrement':
      return {
        count: state.count - 1,
        history: [...state.history, `-1 → ${state.count - 1}`]
      }
    case 'set':
      return {
        count: action.payload,
        history: [...state.history, `设置 → ${action.payload}`]
      }
    case 'reset':
      return initialState
    default:
      return state
  }
}

function UseReducerDemo() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [inputValue, setInputValue] = useState('')

  return (
    <div className="demo-container">
      <div className="demo-section">
        <div className="demo-title">📊 带历史记录的计数器</div>
        <p style={{ color: '#888', fontSize: 14, marginBottom: 12 }}>
          使用 reducer 模式管理复杂状态逻辑
        </p>

        <div className="counter-display">{state.count}</div>

        <div style={{ textAlign: 'center' }}>
          <button className="btn" onClick={() => dispatch({ type: 'increment' })}>
            +1
          </button>
          <button className="btn" onClick={() => dispatch({ type: 'decrement' })}>
            -1
          </button>
          <button className="btn btn-danger" onClick={() => dispatch({ type: 'reset' })}>
            重置
          </button>
        </div>

        <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'center' }}>
          <input
            type="number"
            className="input"
            placeholder="输入数值"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            style={{ width: 120 }}
          />
          <button
            className="btn btn-secondary"
            onClick={() => {
              dispatch({ type: 'set', payload: Number(inputValue) || 0 })
              setInputValue('')
            }}
          >
            设置值
          </button>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-title">📜 操作历史</div>
        <div className="demo-result">
          {state.history.length === 0 ? (
            <p style={{ color: '#666' }}>暂无操作记录</p>
          ) : (
            <div style={{ maxHeight: 150, overflow: 'auto' }}>
              {state.history.slice().reverse().map((item, i) => (
                <div key={i} className="list-item">
                  {state.history.length - i}. {item}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UseReducerDemo

export const code = `import { useReducer } from 'react'

// 1. 定义初始状态
const initialState = { count: 0, history: [] }

// 2. 定义 reducer 函数
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {
        count: state.count + 1,
        history: [...state.history, '+1']
      }
    case 'decrement':
      return {
        count: state.count - 1,
        history: [...state.history, '-1']
      }
    case 'set':
      // action 可以携带 payload
      return {
        count: action.payload,
        history: [...state.history, \`设置为 \${action.payload}\`]
      }
    case 'reset':
      return initialState
    default:
      return state
  }
}

function Counter() {
  // 3. 使用 useReducer
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <div>
      <p>Count: {state.count}</p>

      {/* 4. 通过 dispatch 发送 action */}
      <button onClick={() => dispatch({ type: 'increment' })}>
        +1
      </button>
      <button onClick={() => dispatch({ type: 'decrement' })}>
        -1
      </button>
      <button onClick={() => dispatch({ type: 'set', payload: 100 })}>
        设置为 100
      </button>
      <button onClick={() => dispatch({ type: 'reset' })}>
        重置
      </button>
    </div>
  )
}

/*
  💡 useReducer vs useState：
  - 状态逻辑复杂时用 useReducer
  - 多个子值时用 useReducer
  - 需要状态历史时用 useReducer
  - 简单状态用 useState

  优势：
  - 集中管理状态逻辑
  - 易于测试
  - 类似 Redux 模式
*/`
