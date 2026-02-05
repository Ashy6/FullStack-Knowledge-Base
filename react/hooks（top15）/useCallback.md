---
hook_name: useCallback
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

# useCallback

## 描述

返回一个记忆化的回调函数，避免不必要的函数重新创建。

## 使用场景

- 传递给子组件的回调函数
- 依赖于特定值的回调
- 防止子组件不必要的重渲染

## 示例代码

```jsx
const handleClick = useCallback(() => {
  console.log('Clicked with', value);
}, [value]);

const MemoChild = React.memo(({ onClick }) => {
  return <button onClick={onClick}>Click</button>;
});
```

## 最佳实践

- 配合 React.memo 使用才有意义
- 不要过度使用，有性能开销
- 依赖数组要完整准确
