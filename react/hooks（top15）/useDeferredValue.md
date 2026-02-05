---
hook_name: useDeferredValue
type: 并发 Hook
version: React 18.0+
difficulty: 3
frequency: 3
category: concurrent
react18: true
tags:
  - hook
  - react18
  - concurrent
  - performance
---

# useDeferredValue

## 描述

延迟更新值，允许更紧急的更新先执行。

## 使用场景

- 大列表渲染优化
- 搜索输入防抖
- 繁重计算的延迟
- 提升用户交互响应速度

## 示例代码

```jsx
const [query, setQuery] = useState('');
const deferredQuery = useDeferredValue(query);

return (
  <>
    <input value={query} onChange={e => setQuery(e.target.value)} />
    <SearchResults query={deferredQuery} />
  </>
);
```

## 最佳实践

- 用于非紧急更新
- 配合 Suspense 使用效果更好
- 不是防抖的替代品
