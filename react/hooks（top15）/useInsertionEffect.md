---
hook_name: useInsertionEffect
type: 高级 Hook
version: React 18.0+
difficulty: 5
frequency: 1
category: styling
react18: true
tags:
  - hook
  - react18
  - css-in-js
  - advanced
---

# useInsertionEffect

## 描述

在 DOM 变更前同步触发，专为 CSS-in-JS 库设计。

## 使用场景

- CSS-in-JS 库实现
- 动态样式注入
- 样式表管理
- 避免样式闪烁

## 示例代码

```jsx
function useCSS(rule) {
  useInsertionEffect(() => {
    const style = document.createElement('style');
    style.textContent = rule;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [rule]);
}
```

## 最佳实践

- 仅用于 CSS-in-JS 库
- 普通应用不需要
- 在 DOM 变更前执行
