import { useState } from 'react'

function UseStateDemo() {
  // 基础计数器
  const [count, setCount] = useState(0)

  // 对象状态
  const [user, setUser] = useState({ name: '张三', age: 25 })

  // 函数式初始化（仅执行一次）
  const [items, setItems] = useState(() => {
    console.log('useState 初始化（仅执行一次）')
    return ['苹果', '香蕉', '橙子']
  })

  return (
    <div className="demo-container">
      {/* 计数器演示 */}
      <div className="demo-section">
        <div className="demo-title">📊 基础计数器</div>
        <div className="counter-display">{count}</div>
        <div style={{ textAlign: 'center' }}>
          <button className="btn" onClick={() => setCount(c => c + 1)}>+1</button>
          <button className="btn" onClick={() => setCount(c => c - 1)}>-1</button>
          <button className="btn btn-secondary" onClick={() => setCount(0)}>重置</button>
        </div>
      </div>

      {/* 对象状态演示 */}
      <div className="demo-section">
        <div className="demo-title">👤 对象状态管理</div>
        <div className="demo-result">
          <p>姓名: <span className="highlight">{user.name}</span></p>
          <p>年龄: <span className="highlight">{user.age}</span></p>
        </div>
        <button
          className="btn"
          onClick={() => setUser({ ...user, age: user.age + 1 })}
        >
          年龄 +1
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => setUser({ ...user, name: user.name === '张三' ? '李四' : '张三' })}
        >
          切换姓名
        </button>
      </div>

      {/* 数组状态演示 */}
      <div className="demo-section">
        <div className="demo-title">🍎 数组状态管理</div>
        <div className="demo-result">
          <p>水果列表: <span className="highlight">{items.join(', ')}</span></p>
        </div>
        <button
          className="btn"
          onClick={() => setItems([...items, '葡萄'])}
        >
          添加葡萄
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => setItems(items.slice(0, -1))}
          disabled={items.length === 0}
        >
          移除最后一个
        </button>
        <button
          className="btn btn-danger"
          onClick={() => setItems(['苹果', '香蕉', '橙子'])}
        >
          重置
        </button>
      </div>
    </div>
  )
}

export default UseStateDemo

// 代码示例
export const code = `import { useState } from 'react'

function UseStateDemo() {
  // 1. 基础用法：管理数字
  const [count, setCount] = useState(0)

  // 2. 管理对象状态
  const [user, setUser] = useState({ name: '张三', age: 25 })

  // 3. 函数式初始化（仅执行一次，适合昂贵计算）
  const [items, setItems] = useState(() => {
    console.log('初始化仅执行一次')
    return ['苹果', '香蕉', '橙子']
  })

  return (
    <div>
      {/* 函数式更新：基于前一个值更新 */}
      <button onClick={() => setCount(c => c + 1)}>
        +1
      </button>

      {/* 更新对象：需要展开旧值 */}
      <button onClick={() => setUser({ ...user, age: user.age + 1 })}>
        年龄 +1
      </button>

      {/* 更新数组：创建新数组 */}
      <button onClick={() => setItems([...items, '葡萄'])}>
        添加
      </button>
    </div>
  )
}

/*
  💡 要点：
  1. useState 返回 [state, setState]
  2. setState 可以接收新值或更新函数
  3. 更新对象/数组时，必须创建新引用
  4. 函数式初始化适合昂贵的初始计算
*/`
