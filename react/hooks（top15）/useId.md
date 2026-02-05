---
hook_name: useId
type: 工具 Hook
version: React 18.0+
difficulty: 1
frequency: 3
category: utility
react18: true
tags:
  - hook
  - react18
  - utility
  - ssr
---

# useId

## 描述

生成唯一的 ID，在服务端和客户端保持一致。

## 使用场景

- 无障碍属性（aria-*）
- 表单元素 ID
- 服务端渲染（SSR）
- 避免 ID 冲突

## 示例代码

```jsx
function NameFields() {
  const id = useId();

  return (
    <>
      <label htmlFor={`${id}-firstName`}>First Name</label>
      <input id={`${id}-firstName`} type="text" />

      <label htmlFor={`${id}-lastName`}>Last Name</label>
      <input id={`${id}-lastName`} type="text" />
    </>
  );
}
```

## 最佳实践

- 不要用作 key
- 适用于 SSR 场景
- 避免手动生成 ID
