---
hook_name: useMemo
type: 性能优化 Hook
version: React 16.8+
difficulty: 3
frequency: 4
category: performance
react18: false
tags:
  - hook
  - optimization
  - performance
---

# useMemo

## 描述

返回一个记忆化的值，避免昂贵计算的重复执行。

## 使用场景

- 复杂计算的结果缓存
- 避免引用类型导致的重渲染
- 优化列表渲染

## 示例代码

```jsx
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);

const sortedList = useMemo(() => {
  return items.sort((a, b) => a.value - b.value);
}, [items]);
```

## 最佳实践

- 仅用于昂贵计算
- 不要用于所有计算
- 依赖数组要准确
