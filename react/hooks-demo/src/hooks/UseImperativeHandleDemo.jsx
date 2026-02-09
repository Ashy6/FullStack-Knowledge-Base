import { useState, useRef, useImperativeHandle, forwardRef } from 'react'

// 自定义输入组件
const FancyInput = forwardRef(function FancyInput(props, ref) {
  const inputRef = useRef()
  const [value, setValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  // 自定义暴露给父组件的方法
  useImperativeHandle(ref, () => ({
    // 聚焦
    focus: () => {
      inputRef.current.focus()
    },
    // 清空
    clear: () => {
      setValue('')
    },
    // 获取值
    getValue: () => value,
    // 设置值
    setValue: (val) => {
      setValue(val)
    },
    // 抖动效果
    shake: () => {
      inputRef.current.classList.add('shake')
      setTimeout(() => {
        inputRef.current.classList.remove('shake')
      }, 300)
    },
    // 高亮
    highlight: () => {
      inputRef.current.style.background = '#61dafb33'
      setTimeout(() => {
        inputRef.current.style.background = ''
      }, 800)
    }
  }), [value])

  return (
    <div style={{ position: 'relative' }}>
      <input
        ref={inputRef}
        className="input"
        value={value}
        onChange={e => setValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="自定义输入组件"
        style={{
          width: '100%',
          padding: '12px 16px',
          fontSize: 16,
          borderColor: isFocused ? '#61dafb' : undefined
        }}
      />
      <style>{`
        .shake {
          animation: shake 0.3s ease-in-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
      `}</style>
    </div>
  )
})

function UseImperativeHandleDemo() {
  const fancyInputRef = useRef()
  const [lastAction, setLastAction] = useState('')

  const handleAction = (action, fn) => {
    fn()
    setLastAction(action)
  }

  return (
    <div className="demo-container">
      <div className="demo-section">
        <div className="demo-title">🎮 自定义输入组件</div>
        <p style={{ color: '#888', fontSize: 14, marginBottom: 16 }}>
          父组件通过 ref 调用子组件暴露的方法
        </p>

        <FancyInput ref={fancyInputRef} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8,
          marginTop: 16
        }}>
          <button
            className="btn"
            onClick={() => handleAction('聚焦', () => fancyInputRef.current.focus())}
          >
            聚焦
          </button>
          <button
            className="btn"
            onClick={() => handleAction('清空', () => fancyInputRef.current.clear())}
          >
            清空
          </button>
          <button
            className="btn"
            onClick={() => handleAction('设置 "Hello!"', () => fancyInputRef.current.setValue('Hello!'))}
          >
            设置值
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handleAction('抖动', () => fancyInputRef.current.shake())}
          >
            抖动
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handleAction('高亮', () => fancyInputRef.current.highlight())}
          >
            高亮
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => {
              const val = fancyInputRef.current.getValue()
              handleAction(`获取值: "${val}"`, () => alert(`当前值: ${val}`))
            }}
          >
            获取值
          </button>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-title">📝 暴露的方法列表</div>
        <div className="demo-result">
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
            <li><code>focus()</code> - 聚焦输入框</li>
            <li><code>clear()</code> - 清空内容</li>
            <li><code>getValue()</code> - 获取当前值</li>
            <li><code>setValue(val)</code> - 设置值</li>
            <li><code>shake()</code> - 抖动动画</li>
            <li><code>highlight()</code> - 高亮效果</li>
          </ul>
        </div>
        {lastAction && (
          <p style={{ fontSize: 13, marginTop: 8, color: '#61dafb' }}>
            最近操作: {lastAction}
          </p>
        )}
      </div>
    </div>
  )
}

export default UseImperativeHandleDemo

export const code = `import { useRef, useImperativeHandle, forwardRef } from 'react'

// 1. 使用 forwardRef 包装组件
const FancyInput = forwardRef(function FancyInput(props, ref) {
  const inputRef = useRef()
  const [value, setValue] = useState('')

  // 2. 使用 useImperativeHandle 自定义暴露的方法
  useImperativeHandle(ref, () => ({
    // 只暴露需要的方法，隐藏内部实现
    focus: () => {
      inputRef.current.focus()
    },
    clear: () => {
      setValue('')
    },
    getValue: () => value,
    setValue: (val) => {
      setValue(val)
    },
    shake: () => {
      // 自定义动画逻辑
      inputRef.current.classList.add('shake')
      setTimeout(() => {
        inputRef.current.classList.remove('shake')
      }, 300)
    }
  }), [value]) // 依赖数组

  return (
    <input
      ref={inputRef}
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  )
})

// 3. 父组件使用
function Parent() {
  const inputRef = useRef()

  return (
    <div>
      <FancyInput ref={inputRef} />

      {/* 调用子组件暴露的方法 */}
      <button onClick={() => inputRef.current.focus()}>
        聚焦
      </button>
      <button onClick={() => inputRef.current.clear()}>
        清空
      </button>
      <button onClick={() => inputRef.current.shake()}>
        抖动
      </button>
    </div>
  )
}

/*
  💡 要点：
  1. 必须配合 forwardRef 使用
  2. 可以控制暴露哪些方法给父组件
  3. 隐藏组件内部实现细节
  4. 依赖数组控制何时更新暴露的值

  使用场景：
  - 封装可复用的表单组件
  - 暴露组件的命令式 API
  - 限制父组件对子组件的访问
*/`
