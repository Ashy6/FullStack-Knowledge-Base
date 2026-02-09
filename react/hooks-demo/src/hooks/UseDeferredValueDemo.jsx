import { useState, useMemo, useDeferredValue } from 'react'

function UseDeferredValueDemo() {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)

  // 模拟大量数据
  const allItems = useMemo(() =>
    Array.from({ length: 10000 }, (_, i) => ({
      id: i + 1,
      name: `项目 ${i + 1}`,
      category: ['前端', '后端', '数据库', '运维'][i % 4]
    }))
  , [])

  // 使用延迟值进行过滤（不阻塞输入）
  const filteredItems = useMemo(() => {
    if (!deferredQuery) return allItems
    return allItems.filter(item =>
      item.name.includes(deferredQuery) ||
      item.category.includes(deferredQuery)
    )
  }, [deferredQuery, allItems])

  const isStale = query !== deferredQuery
  const totalMatches = deferredQuery
    ? allItems.filter(item => item.name.includes(deferredQuery) || item.category.includes(deferredQuery)).length
    : allItems.length

  return (
    <div className="demo-container">
      <div className="demo-section">
        <div className="demo-title">⏱️ 搜索 10000 条数据</div>
        <p style={{ color: '#888', fontSize: 14, marginBottom: 12 }}>
          输入时保持流畅，列表更新被标记为低优先级
        </p>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <input
            className="input"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="搜索项目..."
            style={{ flex: 1, maxWidth: 300 }}
          />
          {isStale && (
            <span className="loading">⏳ 更新中...</span>
          )}
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-title">📊 状态对比</div>
        <div className="demo-result">
          <p>输入值 (即时): <span className="highlight">"{query}"</span></p>
          <p>延迟值 (低优先级): <span className="highlight">"{deferredQuery}"</span></p>
          <p>匹配数量: <span className="highlight">{totalMatches.toLocaleString()}</span> / 10,000</p>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-title">📋 搜索结果 (显示前 20 条)</div>
        <div
          className="search-list"
          style={{
            opacity: isStale ? 0.6 : 1,
            transition: 'opacity 0.2s'
          }}
        >
          {filteredItems.map(item => (
            <div key={item.id} className="list-item">
              <span style={{ color: '#61dafb' }}>#{item.id}</span>
              {' '}{item.name}
              <span style={{ float: 'right', color: '#888', fontSize: 12 }}>
                {item.category}
              </span>
            </div>
          ))}
          {totalMatches > 20 && (
            <div style={{ textAlign: 'center', padding: 12, color: '#888' }}>
              ...还有 {totalMatches - 20} 条匹配结果
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UseDeferredValueDemo

export const code = `import { useState, useMemo, useDeferredValue } from 'react'

function SearchList() {
  const [query, setQuery] = useState('')

  // 创建延迟版本的查询值
  const deferredQuery = useDeferredValue(query)

  // 大量数据
  const allItems = useMemo(() =>
    Array.from({ length: 10000 }, (_, i) => \`项目 \${i + 1}\`)
  , [])

  // 使用延迟值进行过滤
  // 输入时 query 立即更新，但过滤使用 deferredQuery
  // React 会在空闲时更新 deferredQuery
  const filteredItems = useMemo(() => {
    return allItems.filter(item => item.includes(deferredQuery))
  }, [deferredQuery, allItems])

  // 判断是否正在更新
  const isStale = query !== deferredQuery

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="搜索..."
      />

      {isStale && <span>更新中...</span>}

      {/* 过渡期间降低不透明度 */}
      <ul style={{ opacity: isStale ? 0.6 : 1 }}>
        {filteredItems.slice(0, 20).map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

/*
  💡 要点：
  1. useDeferredValue(value) 返回延迟版本的值
  2. 输入等紧急更新立即响应
  3. 列表渲染等非紧急更新被延迟
  4. 通过比较原值和延迟值判断是否在过渡中

  与 useTransition 的区别：
  - useDeferredValue: 延迟值的更新
  - useTransition: 延迟状态更新的触发

  使用场景：
  - 搜索输入框
  - 大列表过滤
  - 实时预览
*/`
