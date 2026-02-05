---
hook_name: useState
type: 基础 Hook
version: React 16.8+
difficulty: 1
frequency: 5
category: state-management
react18: false
tags:
  - hook
  - state
  - basic
---

# useState

## 描述

最基础的状态管理 Hook，用于在函数组件中添加状态。

## 使用场景

- 管理组件内部状态
- 表单输入控制
- 切换状态（如显示/隐藏）

## 示例代码

```jsx
const [count, setCount] = useState(0);
const [user, setUser] = useState({ name: '', age: 0 });

// 函数式更新
setCount(prev => prev + 1);
```

## 最佳实践

- 状态更新是异步的
- 使用函数式更新处理依赖前值的更新
- 避免在 state 中存储可计算的值
