import { useState, useCallback, memo, useRef, useDebugValue } from 'react'

// ==========================================
// 场景一：商品列表（展示 memo + useCallback 配合）
// ==========================================

// 商品项组件 - 使用 memo 优化
const ProductItem = memo(function ProductItem ({
  product,
  onRemove,
  onUpdateQty
}) {
  // 渲染计数器 - 可视化重渲染
  const renderCount = useRef(0)
  renderCount.current++

  // 🔍 控制台日志：观察子组件是否重渲染
  console.log('打印就说明子组件重新挂载了')
  console.log(
    `%c[ProductItem] ${product.name} 渲染第 ${renderCount.current} 次`,
    renderCount.current > 1
      ? 'color: #ff6b6b; font-weight: bold'
      : 'color: #4ecdc4'
  )

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 16px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: 8,
        marginBottom: 8
      }}
    >
      <span style={{ flex: 1 }}>{product.name}</span>
      <span style={{ color: '#888', width: 60 }}>¥{product.price}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <button
          className='btn btn-secondary'
          style={{ padding: '4px 8px', fontSize: 12 }}
          onClick={() => onUpdateQty(product.id, -1)}
        >
          -
        </button>
        <span style={{ width: 30, textAlign: 'center' }}>{product.qty}</span>
        <button
          className='btn btn-secondary'
          style={{ padding: '4px 8px', fontSize: 12 }}
          onClick={() => onUpdateQty(product.id, 1)}
        >
          +
        </button>
      </div>
      <button
        className='btn btn-danger'
        style={{ padding: '4px 12px', fontSize: 12 }}
        onClick={() => onRemove(product.id)}
      >
        删除
      </button>
      <span
        style={{
          background: renderCount.current > 1 ? '#ff6b6b' : '#4ecdc4',
          padding: '2px 8px',
          borderRadius: 10,
          fontSize: 11,
          minWidth: 60,
          textAlign: 'center'
        }}
      >
        渲染 {renderCount.current}次
      </span>
    </div>
  )
})

// ==========================================
// 场景二：搜索框防抖（useCallback + useEffect 配合）
// ==========================================

const SearchBox = memo(function SearchBox ({ onSearch }) {
  const [value, setValue] = useState('')
  const renderCount = useRef(0)
  renderCount.current++

  // 🔍 控制台日志
  console.log(
    `%c[SearchBox] 渲染第 ${renderCount.current} 次`,
    renderCount.current > 1
      ? 'color: #ff6b6b; font-weight: bold'
      : 'color: #4ecdc4'
  )

  const handleChange = e => {
    const newValue = e.target.value
    setValue(newValue)
    onSearch(newValue)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <input
        className='input'
        value={value}
        onChange={handleChange}
        placeholder='搜索商品...'
        style={{ flex: 1 }}
      />
      <span
        style={{
          background: renderCount.current > 1 ? '#ff6b6b' : '#4ecdc4',
          padding: '4px 10px',
          borderRadius: 10,
          fontSize: 11
        }}
      >
        渲染 {renderCount.current}次
      </span>
    </div>
  )
})

// ==========================================
// 主组件
// ==========================================

function UseCallbackDemo () {
  const [products, setProducts] = useState([
    { id: 1, name: 'React 实战教程', price: 99, qty: 1 },
    { id: 2, name: 'TypeScript 指南', price: 79, qty: 2 },
    { id: 3, name: 'Node.js 开发', price: 89, qty: 1 }
  ])
  const [searchTerm, setSearchTerm] = useState('')
  const [useOptimized, setUseOptimized] = useState(true)
  const [otherState, setOtherState] = useState(0)

  // 🔍 父组件渲染日志
  console.log(
    `%c[父组件] 渲染 | 模式: ${
      useOptimized ? '✅ useCallback 优化' : '❌ 未优化'
    } | otherState: ${otherState}`,
    'color: #61dafb; font-weight: bold; font-size: 12px'
  )
  console.log('%c----------------------------------------', 'color: #555')

  // ❌ 未优化：每次渲染都创建新函数
  const handleRemoveBad = id => {
    console.log('%c  ❌ handleRemoveBad 被调用', 'color: #ff6b6b')
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  const handleUpdateQtyBad = (id, delta) => {
    console.log('%c  ❌ handleUpdateQtyBad 被调用', 'color: #ff6b6b')
    setProducts(prev =>
      prev.map(p =>
        p.id === id ? { ...p, qty: Math.max(0, p.qty + delta) } : p
      )
    )
  }

  const handleSearchBad = term => {
    console.log('%c  ❌ handleSearchBad 被调用', 'color: #ff6b6b')
    setSearchTerm(term)
  }

  // 未优化时，每次父组件渲染都会打印这条日志
  if (!useOptimized) {
    console.log(
      '%c  ⚠️ 未优化模式：所有回调函数引用都已改变！',
      'color: #ffd93d'
    )
  }

  // ✅ 优化：使用 useCallback 缓存函数
  const handleRemoveGood = useCallback(id => {
    console.log('%c  ✅ handleRemoveGood 被调用', 'color: #4ecdc4')
    setProducts(prev => prev.filter(p => p.id !== id))
  }, []) // 空依赖：函数逻辑不依赖外部变量

  const handleUpdateQtyGood = useCallback((id, delta) => {
    console.log('%c  ✅ handleUpdateQtyGood 被调用', 'color: #4ecdc4')
    setProducts(prev =>
      prev.map(p =>
        p.id === id ? { ...p, qty: Math.max(0, p.qty + delta) } : p
      )
    )
  }, []) // 使用函数式更新，无需依赖 products

  const handleSearchGood = useCallback(term => {
    console.log('%c  ✅ handleSearchGood 被调用', 'color: #4ecdc4')
    setSearchTerm(term)
  }, [])

  // 根据开关选择使用哪组函数
  const handleRemove = useOptimized ? handleRemoveGood : handleRemoveBad
  const handleUpdateQty = useOptimized
    ? handleUpdateQtyGood
    : handleUpdateQtyBad
  const handleSearch = useOptimized ? handleSearchGood : handleSearchBad

  // 过滤商品
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // 计算总价
  const total = filteredProducts.reduce((sum, p) => sum + p.price * p.qty, 0)

  return (
    <div className='demo-container'>
      {/* 优化开关 */}
      <div className='demo-section'>
        <div className='demo-title'>⚙️ useCallback 优化开关</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            className={`btn ${useOptimized ? '' : 'btn-secondary'}`}
            onClick={() => setUseOptimized(true)}
            style={{ background: useOptimized ? '#4ecdc4' : undefined }}
          >
            ✅ 使用 useCallback
          </button>
          <button
            className={`btn ${!useOptimized ? '' : 'btn-secondary'}`}
            onClick={() => setUseOptimized(false)}
            style={{ background: !useOptimized ? '#ff6b6b' : undefined }}
          >
            ❌ 不使用 useCallback
          </button>
        </div>
        <p style={{ color: '#888', fontSize: 13, marginTop: 12 }}>
          当前模式:{' '}
          {useOptimized
            ? '✅ 已优化 - 函数引用稳定'
            : '❌ 未优化 - 每次渲染创建新函数'}
        </p>
      </div>

      {/* 触发重渲染按钮 */}
      <div className='demo-section'>
        <div className='demo-title'>🔄 触发父组件重渲染</div>
        <p style={{ color: '#888', fontSize: 13, marginBottom: 12 }}>
          点击按钮触发父组件重渲染，观察子组件的渲染次数变化
        </p>
        <button className='btn' onClick={() => setOtherState(s => s + 1)}>
          更新无关状态 (已点击 {otherState} 次)
        </button>
        <div className='demo-result' style={{ marginTop: 12 }}>
          <p style={{ fontSize: 13 }}>
            {useOptimized ? (
              <>
                <span style={{ color: '#4ecdc4' }}>✅ 子组件不会重新渲染</span>
                <span style={{ color: '#888' }}>
                  {' '}
                  - useCallback 保持函数引用不变
                </span>
              </>
            ) : (
              <>
                <span style={{ color: '#ff6b6b' }}>
                  ❌ 所有子组件都会重新渲染
                </span>
                <span style={{ color: '#888' }}> - 每次都创建新的回调函数</span>
              </>
            )}
          </p>
        </div>
      </div>

      {/* 搜索框 */}
      <div className='demo-section'>
        <div className='demo-title'>🔍 搜索框组件</div>
        <SearchBox onSearch={handleSearch} />
        {searchTerm && (
          <p style={{ color: '#888', fontSize: 12, marginTop: 8 }}>
            搜索: "{searchTerm}"，找到 {filteredProducts.length} 个商品
          </p>
        )}
      </div>

      {/* 商品列表 */}
      <div className='demo-section'>
        <div className='demo-title'>🛒 购物车商品列表</div>
        <div style={{ marginBottom: 8 }}>
          {filteredProducts.map(product => (
            <ProductItem
              key={product.id}
              product={product}
              onRemove={handleRemove}
              onUpdateQty={handleUpdateQty}
            />
          ))}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            background: 'rgba(97, 218, 251, 0.1)',
            borderRadius: 8
          }}
        >
          <span>
            合计:{' '}
            <strong style={{ color: '#61dafb', fontSize: 18 }}>¥{total}</strong>
          </span>
          <button
            className='btn btn-secondary'
            onClick={() =>
              setProducts([
                ...products,
                {
                  id: Date.now(),
                  name: `新商品 ${products.length + 1}`,
                  price: 59,
                  qty: 1
                }
              ])
            }
          >
            添加商品
          </button>
        </div>
      </div>

      {/* 原理说明 */}
      <div className='demo-section'>
        <div className='demo-title'>💡 渲染次数说明</div>
        <div className='demo-result'>
          <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
            <span>
              <span
                style={{
                  background: '#4ecdc4',
                  padding: '2px 8px',
                  borderRadius: 10,
                  marginRight: 4
                }}
              >
                绿色
              </span>{' '}
              = 仅渲染 1 次（正常）
            </span>
            <span>
              <span
                style={{
                  background: '#ff6b6b',
                  padding: '2px 8px',
                  borderRadius: 10,
                  marginRight: 4
                }}
              >
                红色
              </span>{' '}
              = 渲染多次（需优化）
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UseCallbackDemo

export const code = `import { useState, useCallback, memo } from 'react'

// 商品项组件 - 使用 memo 包装
const ProductItem = memo(function ProductItem({ product, onRemove, onUpdateQty }) {
  console.log(\`商品 \${product.name} 渲染\`)

  return (
    <div>
      <span>{product.name} - ¥{product.price}</span>
      <button onClick={() => onUpdateQty(product.id, 1)}>+</button>
      <button onClick={() => onUpdateQty(product.id, -1)}>-</button>
      <button onClick={() => onRemove(product.id)}>删除</button>
    </div>
  )
})

function ShoppingCart() {
  const [products, setProducts] = useState([
    { id: 1, name: 'React 教程', price: 99, qty: 1 },
    { id: 2, name: 'TypeScript 指南', price: 79, qty: 2 },
  ])
  const [otherState, setOtherState] = useState(0)

  // ❌ 问题：每次渲染创建新函数，导致所有 ProductItem 重渲染
  const handleRemoveBad = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  // ✅ 解决：useCallback 缓存函数引用
  const handleRemove = useCallback((id) => {
    // 使用函数式更新，不依赖外部 products
    setProducts(prev => prev.filter(p => p.id !== id))
  }, []) // 空依赖 = 函数引用永不变化

  const handleUpdateQty = useCallback((id, delta) => {
    setProducts(prev => prev.map(p =>
      p.id === id ? { ...p, qty: Math.max(0, p.qty + delta) } : p
    ))
  }, [])

  return (
    <div>
      {/* 更新此状态不会导致商品项重渲染 */}
      <button onClick={() => setOtherState(s => s + 1)}>
        其他操作: {otherState}
      </button>

      {products.map(product => (
        <ProductItem
          key={product.id}
          product={product}
          onRemove={handleRemove}      // 引用稳定
          onUpdateQty={handleUpdateQty} // 引用稳定
        />
      ))}
    </div>
  )
}

/*
  💡 useCallback 核心要点：

  1. 作用：缓存函数引用，避免每次渲染创建新函数

  2. 语法：
     const fn = useCallback(() => { ... }, [deps])

  3. 依赖数组：
     - []：函数永不变化（适合使用函数式更新的场景）
     - [dep1, dep2]：依赖变化时更新函数

  4. 必须配合 React.memo 使用才有意义！
     - 单独使用 useCallback 没有优化效果
     - memo 组件会比较 props，函数引用不变则跳过渲染

  5. 常见错误：
     ❌ 依赖数组包含会变化的值
        useCallback(() => { doSomething(count) }, [count])
        // count 变化时函数也会变化

     ✅ 使用函数式更新避免依赖
        useCallback(() => { setCount(c => c + 1) }, [])
        // 空依赖，函数引用永远稳定

  6. 使用场景：
     - 传递给 memo 子组件的回调函数
     - 作为 useEffect 的依赖
     - 传递给自定义 Hook 的回调
*/`
