---
hook_name: useReducer
type: 状态管理 Hook
version: React 16.8+
difficulty: 3
frequency: 3
category: state-management
react18: false
tags:
  - hook
  - state
  - advanced
---

# useReducer

## 描述

使用 reducer 模式管理复杂状态逻辑。

## 使用场景

- 复杂的状态逻辑
- 多个子值的状态对象
- 状态更新依赖之前的状态
- 需要优化性能的场景

## 示例代码

```jsx
const reducer = (state, action) => {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      return state;
  }
};

const [state, dispatch] = useReducer(reducer, { count: 0 });
```

## 最佳实践

- 保持 reducer 函数纯净
- 使用 action type 常量
- 复杂逻辑优于 useState
