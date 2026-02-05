---
hook_name: useSyncExternalStore
type: 同步 Hook
version: React 18.0+
difficulty: 4
frequency: 2
category: external
react18: true
tags:
  - hook
  - react18
  - external
  - store
---

# useSyncExternalStore

## 描述

订阅外部 store，确保并发渲染的一致性。

## 使用场景

- 状态管理库集成
- 浏览器 API 订阅
- 第三方数据源
- 全局状态管理

## 示例代码

```jsx
function useOnlineStatus() {
  const isOnline = useSyncExternalStore(
    (callback) => {
      window.addEventListener('online', callback);
      window.addEventListener('offline', callback);
      return () => {
        window.removeEventListener('online', callback);
        window.removeEventListener('offline', callback);
      };
    },
    () => navigator.onLine,
    () => true
  );

  return isOnline;
}
```

## 最佳实践

- 用于外部可变数据源
- 确保并发安全
- 提供服务端快照
