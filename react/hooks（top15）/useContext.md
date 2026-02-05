---
hook_name: useContext
type: 上下文 Hook
version: React 16.8+
difficulty: 2
frequency: 4
category: context
react18: false
tags:
  - hook
  - context
  - basic
---

# useContext

## 描述

访问 React Context 的值，避免 props 层层传递。

## 使用场景

- 主题切换
- 用户认证状态
- 多语言国际化
- 全局配置

## 示例代码

```jsx
const ThemeContext = createContext('light');

function Button() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Click me</button>;
}
```

## 最佳实践

- 避免过度使用，造成不必要的重渲染
- 结合 useMemo 优化性能
- 考虑使用状态管理库处理复杂状态
