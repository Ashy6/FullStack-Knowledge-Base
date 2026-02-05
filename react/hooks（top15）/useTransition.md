---
hook_name: useTransition
type: 并发 Hook
version: React 18.0+
difficulty: 3
frequency: 3
category: concurrent
react18: true
tags:
  - hook
  - react18
  - concurrent
  - performance
---

# useTransition

## 描述

标记状态更新为非紧急（过渡），不阻塞 UI。

## 使用场景

- 页面导航
- 标签页切换
- 数据过滤和搜索
- 大列表更新

## 示例代码

```jsx
const [isPending, startTransition] = useTransition();

function handleClick() {
  startTransition(() => {
    setTab('posts');
  });
}

return (
  <div>
    {isPending && <Spinner />}
    <button onClick={handleClick}>Posts</button>
  </div>
);
```

## 最佳实践

- 用于标记非紧急更新
- 显示加载指示器
- 配合 Suspense 使用
