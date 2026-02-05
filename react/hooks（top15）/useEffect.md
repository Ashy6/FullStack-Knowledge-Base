---
hook_name: useEffect
type: 副作用 Hook
version: React 16.8+
difficulty: 2
frequency: 5
category: side-effects
react18: false
tags:
  - hook
  - effect
  - basic
---

# useEffect

## 描述

处理副作用的 Hook，如数据获取、订阅、DOM 操作等。

## 使用场景

- 数据获取和 API 调用
- 事件监听器添加/移除
- 定时器管理
- 外部库集成

## 示例代码

```jsx
useEffect(() => {
  const timer = setInterval(() => {
    console.log('Tick');
  }, 1000);

  return () => clearInterval(timer);
}, [dependencies]);
```

## 最佳实践

- 始终提供依赖数组
- 在清理函数中取消订阅和定时器
- 避免在 effect 中直接修改 state
