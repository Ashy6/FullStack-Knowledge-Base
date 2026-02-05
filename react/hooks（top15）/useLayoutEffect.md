---
hook_name: useLayoutEffect
type: 副作用 Hook
version: React 16.8+
difficulty: 3
frequency: 2
category: side-effects
react18: false
tags:
  - hook
  - effect
  - layout
---

# useLayoutEffect

## 描述

同步执行的 effect，在浏览器绘制前触发。

## 使用场景

- 读取 DOM 布局并同步重渲染
- 避免闪烁的视觉更新
- 测量元素尺寸
- 同步动画

## 示例代码

```jsx
useLayoutEffect(() => {
  const { height } = divRef.current.getBoundingClientRect();
  setHeight(height);
}, []);
```

## 最佳实践

- 优先使用 useEffect
- 仅在需要同步 DOM 操作时使用
- 注意性能影响
