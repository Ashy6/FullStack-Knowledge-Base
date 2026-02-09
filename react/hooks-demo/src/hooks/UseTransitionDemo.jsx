import { useState, useTransition, useMemo } from 'react'

function UseTransitionDemo () {
  const [isPending, startTransition] = useTransition()
  const [tab, setTab] = useState('home')
  const [items, setItems] = useState(['欢迎来到首页！'])

  // 生成大量数据（模拟耗时操作）
  const generateItems = type => {
    const count = type === 'posts' ? 50000 : type === 'comments' ? 300 : 1
    return Array.from({ length: count }, (_, i) => {
      const prefix =
        type === 'posts' ? '文章' : type === 'comments' ? '评论' : ''
      return type === 'home'
        ? '欢迎来到首页！'
        : `${prefix} ${i + 1} - 这是一段示例内容...`
    })
  }

  const selectTab = nextTab => {
    setTab(nextTab)
    // 使用 startTransition 标记为非紧急更新
    startTransition(() => {
      setItems(generateItems(nextTab))
    })
  }

  return (
    <div className='demo-container'>
      <div className='demo-section'>
        <div className='demo-title'>🔄 标签页切换（并发渲染）</div>
        <p style={{ color: '#888', fontSize: 14, marginBottom: 16 }}>
          切换到大数据量标签页时，UI 保持响应
        </p>

        <div className='tabs'>
          {[
            { id: 'home', label: '首页', count: 1 },
            { id: 'posts', label: '文章', count: 500 },
            { id: 'comments', label: '评论', count: 300 }
          ].map(t => (
            <button
              key={t.id}
              className={`tab ${tab === t.id ? 'active' : ''}`}
              onClick={() => selectTab(t.id)}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        {isPending && (
          <div className='loading' style={{ marginBottom: 12 }}>
            ⏳ 加载中... (isPending = true)
          </div>
        )}

        <div
          className='tab-content'
          style={{ opacity: isPending ? 0.5 : 1, transition: 'opacity 0.2s' }}
        >
          <div className='search-list' style={{ maxHeight: 200 }}>
            {items.map((item, i) => (
              <div key={i} className='list-item'>
                {item}
              </div>
            ))}
            {items.length > 10 && (
              <div style={{ textAlign: 'center', padding: 12, color: '#888' }}>
                ...还有 {items.length - 10} 项
              </div>
            )}
          </div>
        </div>
      </div>

      <div className='demo-section'>
        <div className='demo-title'>📊 useTransition 状态</div>
        <div className='demo-result'>
          <p>
            isPending:{' '}
            <span className='highlight'>{isPending ? 'true' : 'false'}</span>
          </p>
          <p>
            当前标签: <span className='highlight'>{tab}</span>
          </p>
          <p>
            数据量: <span className='highlight'>{items.length}</span> 条
          </p>
        </div>
      </div>

      <div className='demo-section'>
        <div className='demo-title'>💡 工作原理</div>
        <div className='demo-result'>
          <div style={{ fontSize: 13, lineHeight: 1.8 }}>
            <p>1. 点击标签 → 按钮立即响应（高优先级）</p>
            <p>2. startTransition 内的更新被标记为低优先级</p>
            <p>3. isPending = true 时显示加载状态</p>
            <p>4. React 在空闲时完成列表渲染</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UseTransitionDemo

export const code = `import { useState, useTransition } from 'react'

function TabContainer() {
  // 返回 [isPending, startTransition]
  const [isPending, startTransition] = useTransition()
  const [tab, setTab] = useState('home')
  const [items, setItems] = useState([])

  // 使用 startTransition 包裹状态更新
  const selectTab = (nextTab) => {
    // 告诉 React 这是紧急更新
    setTab(nextTab)
    // 告诉 React 这是一个非紧急更新
    startTransition(() => {
      // 即使这里有大量数据处理，UI 也不会卡顿
      setItems(generateLargeList(nextTab))
    })
  }

  return (
    <div>
      {/* 标签按钮 - 点击立即响应 */}
      <button onClick={() => selectTab('posts')}>
        文章 (500)
      </button>
      <button onClick={() => selectTab('comments')}>
        评论 (300)
      </button>

      {/* 加载指示器 */}
      {isPending && <span>加载中...</span>}

      {/* 内容区 - 过渡期间降低透明度 */}
      <div style={{ opacity: isPending ? 0.5 : 1 }}>
        {items.map(item => <div key={item.id}>{item.text}</div>)}
      </div>
    </div>
  )
}

/*
  💡 要点：
  1. startTransition(callback) 标记更新为"过渡"
  2. isPending 表示过渡是否正在进行
  3. 过渡期间，紧急更新（如输入）仍然响应
  4. React 会在空闲时完成过渡更新

  与 useDeferredValue 的区别：
  - useTransition: 控制状态更新的时机
  - useDeferredValue: 控制值的更新时机

  使用场景：
  - 页面/标签导航
  - 数据过滤和搜索
  - 任何可能导致卡顿的状态更新
*/`
