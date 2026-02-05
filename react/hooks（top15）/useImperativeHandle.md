---
hook_name: useImperativeHandle
type: 高级 Hook
version: React 16.8+
difficulty: 4
frequency: 2
category: refs
react18: false
tags:
  - hook
  - ref
  - advanced
---

# useImperativeHandle

## 描述

自定义通过 ref 暴露给父组件的实例值。

## 使用场景

- 暴露子组件的方法给父组件
- 封装组件内部实现
- 与第三方库集成

## 示例代码

```jsx
const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef();

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    clear: () => inputRef.current.value = ''
  }));

  return <input ref={inputRef} />;
});
```

## 最佳实践

- 配合 forwardRef 使用
- 只暴露必要的方法
- 优先使用 props 而非 ref
