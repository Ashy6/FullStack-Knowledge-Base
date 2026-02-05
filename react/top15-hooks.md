# React 18 Top 15 经典 Hooks

React 18 最常用和最强大的 15 个 Hooks 完整指南。

---

## useState

**类型**: 基础 Hook
**版本**: React 16.8+
**难度**: ⭐
**使用频率**: ⭐⭐⭐⭐⭐

### 描述

最基础的状态管理 Hook，用于在函数组件中添加状态。

### 使用场景

- 管理组件内部状态
- 表单输入控制
- 切换状态（如显示/隐藏）

### 示例代码

```jsx
const [count, setCount] = useState(0);
const [user, setUser] = useState({ name: '', age: 0 });

// 函数式更新
setCount(prev => prev + 1);
```

### 最佳实践

- 状态更新是异步的
- 使用函数式更新处理依赖前值的更新
- 避免在 state 中存储可计算的值

---

## useEffect

**类型**: 副作用 Hook
**版本**: React 16.8+
**难度**: ⭐⭐
**使用频率**: ⭐⭐⭐⭐⭐

### 描述

处理副作用的 Hook，如数据获取、订阅、DOM 操作等。

### 使用场景

- 数据获取和 API 调用
- 事件监听器添加/移除
- 定时器管理
- 外部库集成

### 示例代码

```jsx
useEffect(() => {
  // 副作用逻辑
  const timer = setInterval(() => {
    console.log('Tick');
  }, 1000);

  // 清理函数
  return () => clearInterval(timer);
}, [dependencies]); // 依赖数组
```

### 最佳实践

- 始终提供依赖数组
- 在清理函数中取消订阅和定时器
- 避免在 effect 中直接修改 state

---

## useContext

**类型**: 上下文 Hook
**版本**: React 16.8+
**难度**: ⭐⭐
**使用频率**: ⭐⭐⭐⭐

### 描述

访问 React Context 的值，避免 props 层层传递。

### 使用场景

- 主题切换
- 用户认证状态
- 多语言国际化
- 全局配置

### 示例代码

```jsx
const ThemeContext = createContext('light');

function Button() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Click me</button>;
}
```

### 最佳实践

- 避免过度使用，造成不必要的重渲染
- 结合 useMemo 优化性能
- 考虑使用状态管理库处理复杂状态

---

## useReducer

**类型**: 状态管理 Hook
**版本**: React 16.8+
**难度**: ⭐⭐⭐
**使用频率**: ⭐⭐⭐

### 描述

使用 reducer 模式管理复杂状态逻辑。

### 使用场景

- 复杂的状态逻辑
- 多个子值的状态对象
- 状态更新依赖之前的状态
- 需要优化性能的场景

### 示例代码

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

### 最佳实践

- 保持 reducer 函数纯净
- 使用 action type 常量
- 复杂逻辑优于 useState

---

## useCallback

**类型**: 性能优化 Hook
**版本**: React 16.8+
**难度**: ⭐⭐⭐
**使用频率**: ⭐⭐⭐⭐

### 描述

返回一个记忆化的回调函数，避免不必要的函数重新创建。

### 使用场景

- 传递给子组件的回调函数
- 依赖于特定值的回调
- 防止子组件不必要的重渲染

### 示例代码

```jsx
const handleClick = useCallback(() => {
  console.log('Clicked with', value);
}, [value]);

// 配合 React.memo 使用
const MemoChild = React.memo(({ onClick }) => {
  return <button onClick={onClick}>Click</button>;
});
```

### 最佳实践

- 配合 React.memo 使用才有意义
- 不要过度使用，有性能开销
- 依赖数组要完整准确

---

## useMemo

**类型**: 性能优化 Hook
**版本**: React 16.8+
**难度**: ⭐⭐⭐
**使用频率**: ⭐⭐⭐⭐

### 描述

返回一个记忆化的值，避免昂贵计算的重复执行。

### 使用场景

- 复杂计算的结果缓存
- 避免引用类型导致的重渲染
- 优化列表渲染

### 示例代码

```jsx
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);

const sortedList = useMemo(() => {
  return items.sort((a, b) => a.value - b.value);
}, [items]);
```

### 最佳实践

- 仅用于昂贵计算
- 不要用于所有计算
- 依赖数组要准确

---

## useRef

**类型**: 引用 Hook
**版本**: React 16.8+
**难度**: ⭐⭐
**使用频率**: ⭐⭐⭐⭐

### 描述

创建一个可变的引用对象，在组件的整个生命周期保持不变。

### 使用场景

- 访问 DOM 元素
- 存储可变值（不触发重渲染）
- 保存定时器 ID
- 保存前一个值

### 示例代码

```jsx
const inputRef = useRef(null);

useEffect(() => {
  inputRef.current.focus();
}, []);

// 存储可变值
const countRef = useRef(0);
countRef.current += 1; // 不触发重渲染
```

### 最佳实践

- 用于 DOM 操作而非状态管理
- 修改 ref.current 不会触发重渲染
- 避免在渲染期间读写 ref

---

## useImperativeHandle

**类型**: 高级 Hook
**版本**: React 16.8+
**难度**: ⭐⭐⭐⭐
**使用频率**: ⭐⭐

### 描述

自定义通过 ref 暴露给父组件的实例值。

### 使用场景

- 暴露子组件的方法给父组件
- 封装组件内部实现
- 与第三方库集成

### 示例代码

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

### 最佳实践

- 配合 forwardRef 使用
- 只暴露必要的方法
- 优先使用 props 而非 ref

---

## useLayoutEffect

**类型**: 副作用 Hook
**版本**: React 16.8+
**难度**: ⭐⭐⭐
**使用频率**: ⭐⭐

### 描述

同步执行的 effect，在浏览器绘制前触发。

### 使用场景

- 读取 DOM 布局并同步重渲染
- 避免闪烁的视觉更新
- 测量元素尺寸
- 同步动画

### 示例代码

```jsx
useLayoutEffect(() => {
  const { height } = divRef.current.getBoundingClientRect();
  setHeight(height);
}, []);
```

### 最佳实践

- 优先使用 useEffect
- 仅在需要同步 DOM 操作时使用
- 注意性能影响

---

## useDebugValue

**类型**: 调试 Hook
**版本**: React 16.8+
**难度**: ⭐⭐
**使用频率**: ⭐

### 描述

在 React DevTools 中显示自定义 Hook 的标签。

### 使用场景

- 调试自定义 Hook
- 显示 Hook 内部状态
- 开发工具集成

### 示例代码

```jsx
function useCustomHook(value) {
  const [state, setState] = useState(value);

  useDebugValue(state, state => `Custom: ${state}`);

  return [state, setState];
}
```

### 最佳实践

- 仅用于自定义 Hook
- 使用格式化函数避免昂贵计算
- 生产环境会被忽略

---

## useDeferredValue

**类型**: 并发 Hook (React 18)
**版本**: React 18.0+
**难度**: ⭐⭐⭐
**使用频率**: ⭐⭐⭐

### 描述

延迟更新值，允许更紧急的更新先执行。

### 使用场景

- 大列表渲染优化
- 搜索输入防抖
- 繁重计算的延迟
- 提升用户交互响应速度

### 示例代码

```jsx
const [query, setQuery] = useState('');
const deferredQuery = useDeferredValue(query);

return (
  <>
    <input value={query} onChange={e => setQuery(e.target.value)} />
    <SearchResults query={deferredQuery} />
  </>
);
```

### 最佳实践

- 用于非紧急更新
- 配合 Suspense 使用效果更好
- 不是防抖的替代品

---

## useTransition

**类型**: 并发 Hook (React 18)
**版本**: React 18.0+
**难度**: ⭐⭐⭐
**使用频率**: ⭐⭐⭐

### 描述

标记状态更新为非紧急（过渡），不阻塞 UI。

### 使用场景

- 页面导航
- 标签页切换
- 数据过滤和搜索
- 大列表更新

### 示例代码

```jsx
const [isPending, startTransition] = useTransition();

function handleClick() {
  startTransition(() => {
    setTab('posts'); // 非紧急更新
  });
}

return (
  <div>
    {isPending && <Spinner />}
    <button onClick={handleClick}>Posts</button>
  </div>
);
```

### 最佳实践

- 用于标记非紧急更新
- 显示加载指示器
- 配合 Suspense 使用

---

## useId

**类型**: 工具 Hook (React 18)
**版本**: React 18.0+
**难度**: ⭐
**使用频率**: ⭐⭐⭐

### 描述

生成唯一的 ID，在服务端和客户端保持一致。

### 使用场景

- 无障碍属性（aria-*）
- 表单元素 ID
- 服务端渲染（SSR）
- 避免 ID 冲突

### 示例代码

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

### 最佳实践

- 不要用作 key
- 适用于 SSR 场景
- 避免手动生成 ID

---

## useSyncExternalStore

**类型**: 同步 Hook (React 18)
**版本**: React 18.0+
**难度**: ⭐⭐⭐⭐
**使用频率**: ⭐⭐

### 描述

订阅外部 store，确保并发渲染的一致性。

### 使用场景

- 状态管理库集成
- 浏览器 API 订阅
- 第三方数据源
- 全局状态管理

### 示例代码

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
    () => true // 服务端初始值
  );

  return isOnline;
}
```

### 最佳实践

- 用于外部可变数据源
- 确保并发安全
- 提供服务端快照

---

## useInsertionEffect

**类型**: 高级 Hook (React 18)
**版本**: React 18.0+
**难度**: ⭐⭐⭐⭐⭐
**使用频率**: ⭐

### 描述

在 DOM 变更前同步触发，专为 CSS-in-JS 库设计。

### 使用场景

- CSS-in-JS 库实现
- 动态样式注入
- 样式表管理
- 避免样式闪烁

### 示例代码

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

### 最佳实践

- 仅用于 CSS-in-JS 库
- 普通应用不需要
- 在 DOM 变更前执行

---

## 总结

### Hook 分类

- **基础 Hooks**: useState, useEffect, useContext
- **性能优化**: useCallback, useMemo
- **引用管理**: useRef, useImperativeHandle
- **高级状态**: useReducer
- **并发特性**: useTransition, useDeferredValue
- **工具 Hooks**: useId, useDebugValue
- **外部集成**: useSyncExternalStore, useInsertionEffect
- **布局效果**: useLayoutEffect

### 使用优先级

1. **最常用**: useState, useEffect, useContext
2. **次常用**: useCallback, useMemo, useRef
3. **特定场景**: useReducer, useTransition, useDeferredValue
4. **高级/库开发**: useSyncExternalStore, useInsertionEffect
