import { useId } from 'react'

// 可复用的表单字段组件
function FormField ({ label, type = 'text', placeholder, helpText }) {
  const id = useId()
  const helpId = helpText ? `${id}-help` : undefined
console.log(111, id);

  return (
    <div className='form-group' style={{ marginBottom: 16 }}>
      <label
        htmlFor={id}
        style={{ display: 'block', marginBottom: 6, color: '#aaa' }}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        className='input'
        placeholder={placeholder}
        aria-describedby={helpId}
        style={{ width: '100%' }}
      />
      {helpText && (
        <p id={helpId} style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
          {helpText}
        </p>
      )}
      <span style={{ fontSize: 10, color: '#555' }}>生成的 ID: {id}</span>
    </div>
  )
}

// 带复选框的组件
function CheckboxGroup ({ legend, options }) {
  const groupId = useId()

  return (
    <fieldset
      style={{
        border: '1px solid #3a3a5a',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16
      }}
    >
      <legend style={{ color: '#61dafb', padding: '0 8px' }}>{legend}</legend>
      {options.map((option, index) => {
        const optionId = `${groupId}-${index}`
        return (
          <div
            key={optionId}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 8
            }}
          >
            <input type='checkbox' id={optionId} />
            <label htmlFor={optionId}>{option}</label>
            <span style={{ fontSize: 10, color: '#555', marginLeft: 'auto' }}>
              ID: {optionId}
            </span>
          </div>
        )
      })}
    </fieldset>
  )
}

function UseIdDemo () {
  const passwordId = useId()

  return (
    <div className='demo-container'>
      <div className='demo-section'>
        <div className='demo-title'>🔧 表单字段唯一 ID</div>
        <p style={{ color: '#888', fontSize: 14, marginBottom: 16 }}>
          每个 FormField 组件自动获得唯一 ID，即使渲染多个实例
        </p>

        <FormField
          label='用户名'
          placeholder='请输入用户名'
          helpText='用户名长度 3-20 个字符'
        />

        <FormField
          label='邮箱'
          type='email'
          placeholder='请输入邮箱'
          helpText='我们不会分享您的邮箱'
        />

        <div className='form-group'>
          <label
            htmlFor={`${passwordId}-input`}
            style={{ display: 'block', marginBottom: 6, color: '#aaa' }}
          >
            密码
          </label>
          <input
            id={`${passwordId}-input`}
            type='password'
            className='input'
            aria-describedby={`${passwordId}-hint`}
            placeholder='请输入密码'
            style={{ width: '100%' }}
          />
          <p
            id={`${passwordId}-hint`}
            style={{ fontSize: 12, color: '#666', marginTop: 4 }}
          >
            密码需要至少 8 位，包含字母和数字
          </p>
          <span style={{ fontSize: 10, color: '#555' }}>
            基础 ID: {passwordId}
          </span>
        </div>
      </div>

      <div className='demo-section'>
        <div className='demo-title'>✅ 复选框组</div>
        <CheckboxGroup
          legend='选择您感兴趣的领域'
          options={['前端开发', '后端开发', 'DevOps', '数据科学']}
        />
      </div>

      <div className='demo-section'>
        <div className='demo-title'>💡 SSR 兼容性</div>
        <div className='demo-result'>
          <p style={{ fontSize: 13, lineHeight: 1.8 }}>
            useId 生成的 ID 在服务端和客户端保持一致， 避免 hydration
            不匹配的问题。
          </p>
          <p style={{ fontSize: 12, color: '#888', marginTop: 8 }}>
            注意：生成的 ID 包含冒号 (:)，不能用于 CSS 选择器
          </p>
        </div>
      </div>
    </div>
  )
}

export default UseIdDemo

export const code = `import { useId } from 'react'

// 可复用的表单组件
function FormField({ label, type = 'text', helpText }) {
  // 生成唯一 ID
  const id = useId()
  const helpId = helpText ? \`\${id}-help\` : undefined

  return (
    <div>
      {/* label 的 htmlFor 与 input 的 id 关联 */}
      <label htmlFor={id}>{label}</label>

      <input
        id={id}
        type={type}
        aria-describedby={helpId}  // 无障碍属性
      />

      {helpText && (
        <p id={helpId}>{helpText}</p>  // 帮助文本
      )}
    </div>
  )
}

// 复选框组：基于一个 ID 派生多个
function CheckboxGroup({ options }) {
  const groupId = useId()

  return (
    <div>
      {options.map((option, index) => {
        // 派生 ID: groupId-0, groupId-1, ...
        const optionId = \`\${groupId}-\${index}\`
        return (
          <div key={optionId}>
            <input type="checkbox" id={optionId} />
            <label htmlFor={optionId}>{option}</label>
          </div>
        )
      })}
    </div>
  )
}

/*
  💡 要点：
  1. useId() 返回唯一的字符串 ID
  2. 同一组件多次渲染，每次得到不同 ID
  3. 服务端和客户端渲染结果一致（SSR 安全）
  4. ID 包含冒号，需要转义才能用于 CSS 选择器

  使用场景：
  - 表单元素的 id 和 htmlFor
  - aria-describedby 等无障碍属性
  - 任何需要唯一 ID 的场景

  注意：
  - 不要用于列表的 key（应该用数据的 ID）
  - 每次调用 useId 都会生成新的 ID
*/`
