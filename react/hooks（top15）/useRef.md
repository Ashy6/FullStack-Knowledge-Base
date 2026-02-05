---
hook_name: useRef
type: 引用 Hook
version: React 16.8+
difficulty: 2
frequency: 4
category: refs
react18: false
tags:
  - hook
  - ref
  - dom
---

# useRef

## 描述

创建一个可变的引用对象，在组件的整个生命周期保持不变。

## 使用场景

- 访问 DOM 元素
- 存储可变值（不触发重渲染）
- 保存定时器 ID
- 保存前一个值

## 示例代码

```jsx
const inputRef = useRef(null);

useEffect(() => {
  inputRef.current.focus();
}, []);

// 存储可变值
const countRef = useRef(0);
countRef.current += 1;
```

## 最佳实践

- 用于 DOM 操作而非状态管理
- 修改 ref.current 不会触发重渲染
- 避免在渲染期间读写 ref
