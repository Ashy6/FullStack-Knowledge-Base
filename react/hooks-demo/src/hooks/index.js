import UseStateDemo, { code as useStateCode } from './UseStateDemo'
import UseEffectDemo, { code as useEffectCode } from './UseEffectDemo'
import UseContextDemo, { code as useContextCode } from './UseContextDemo'
import UseReducerDemo, { code as useReducerCode } from './UseReducerDemo'
import UseCallbackDemo, { code as useCallbackCode } from './UseCallbackDemo'
import UseMemoDemo, { code as useMemoCode } from './UseMemoDemo'
import UseRefDemo, { code as useRefCode } from './UseRefDemo'
import UseImperativeHandleDemo, { code as useImperativeHandleCode } from './UseImperativeHandleDemo'
import UseLayoutEffectDemo, { code as useLayoutEffectCode } from './UseLayoutEffectDemo'
import UseDebugValueDemo, { code as useDebugValueCode } from './UseDebugValueDemo'
import UseDeferredValueDemo, { code as useDeferredValueCode } from './UseDeferredValueDemo'
import UseTransitionDemo, { code as useTransitionCode } from './UseTransitionDemo'
import UseIdDemo, { code as useIdCode } from './UseIdDemo'
import UseSyncExternalStoreDemo, { code as useSyncExternalStoreCode } from './UseSyncExternalStoreDemo'
import UseInsertionEffectDemo, { code as useInsertionEffectCode } from './UseInsertionEffectDemo'

export const hooksList = [
  {
    id: 'useState',
    description: '最基础的状态管理 Hook。用于在函数组件中添加和管理内部状态，支持基本类型、对象、数组等。',
    isReact18: false,
    component: UseStateDemo,
    code: useStateCode
  },
  {
    id: 'useEffect',
    description: '处理副作用的 Hook。用于数据获取、订阅、手动 DOM 操作等。支持依赖数组和清理函数。',
    isReact18: false,
    component: UseEffectDemo,
    code: useEffectCode
  },
  {
    id: 'useContext',
    description: '访问 React Context 的值，避免 props 层层传递。适用于主题、用户认证、国际化等全局状态。',
    isReact18: false,
    component: UseContextDemo,
    code: useContextCode
  },
  {
    id: 'useReducer',
    description: '使用 reducer 模式管理复杂状态逻辑。适用于多个子值、复杂状态转换的场景。',
    isReact18: false,
    component: UseReducerDemo,
    code: useReducerCode
  },
  {
    id: 'useCallback',
    description: '返回记忆化的回调函数，避免不必要的函数重新创建。配合 React.memo 防止子组件重渲染。',
    isReact18: false,
    component: UseCallbackDemo,
    code: useCallbackCode
  },
  {
    id: 'useMemo',
    description: '返回记忆化的值，避免昂贵计算的重复执行。也可用于保持对象引用稳定。',
    isReact18: false,
    component: UseMemoDemo,
    code: useMemoCode
  },
  {
    id: 'useRef',
    description: '创建可变引用对象，在组件整个生命周期保持不变。用于访问 DOM 元素、存储可变值。',
    isReact18: false,
    component: UseRefDemo,
    code: useRefCode
  },
  {
    id: 'useImperativeHandle',
    description: '自定义通过 ref 暴露给父组件的实例值。用于封装组件内部实现，只暴露必要的方法。',
    isReact18: false,
    component: UseImperativeHandleDemo,
    code: useImperativeHandleCode
  },
  {
    id: 'useLayoutEffect',
    description: '同步执行的 effect，在 DOM 变更后、浏览器绘制前触发。用于读取 DOM 布局并同步更新。',
    isReact18: false,
    component: UseLayoutEffectDemo,
    code: useLayoutEffectCode
  },
  {
    id: 'useDebugValue',
    description: '在 React DevTools 中显示自定义 Hook 的标签。用于调试自定义 Hook。',
    isReact18: false,
    component: UseDebugValueDemo,
    code: useDebugValueCode
  },
  {
    id: 'useDeferredValue',
    description: '延迟更新值，允许更紧急的更新先执行。适用于大列表渲染、搜索输入等优化场景。',
    isReact18: true,
    component: UseDeferredValueDemo,
    code: useDeferredValueCode
  },
  {
    id: 'useTransition',
    description: '标记状态更新为非紧急（过渡），不阻塞 UI。适用于页面导航、标签切换等场景。',
    isReact18: true,
    component: UseTransitionDemo,
    code: useTransitionCode
  },
  {
    id: 'useId',
    description: '生成唯一 ID，在服务端和客户端保持一致。用于无障碍属性、表单元素 ID 等。',
    isReact18: true,
    component: UseIdDemo,
    code: useIdCode
  },
  {
    id: 'useSyncExternalStore',
    description: '订阅外部 store，确保并发渲染的一致性。用于状态管理库集成、浏览器 API 订阅。',
    isReact18: true,
    component: UseSyncExternalStoreDemo,
    code: useSyncExternalStoreCode
  },
  {
    id: 'useInsertionEffect',
    description: '在 DOM 变更前同步触发，专为 CSS-in-JS 库设计。用于动态样式注入，避免样式闪烁。',
    isReact18: true,
    component: UseInsertionEffectDemo,
    code: useInsertionEffectCode
  }
]
