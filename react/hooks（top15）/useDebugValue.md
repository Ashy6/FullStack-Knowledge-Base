---
hook_name: useDebugValue
type: 调试 Hook
version: React 16.8+
difficulty: 2
frequency: 1
category: debugging
react18: false
tags:
  - hook
  - debug
  - devtools
---

# useDebugValue

## 描述

在 React DevTools 中显示自定义 Hook 的标签。

## 使用场景

- 调试自定义 Hook
- 显示 Hook 内部状态
- 开发工具集成

## 示例代码

```jsx
function useCustomHook(value) {
  const [state, setState] = useState(value);

  useDebugValue(state, state => `Custom: ${state}`);

  return [state, setState];
}
```

## 最佳实践

- 仅用于自定义 Hook
- 使用格式化函数避免昂贵计算
- 生产环境会被忽略
