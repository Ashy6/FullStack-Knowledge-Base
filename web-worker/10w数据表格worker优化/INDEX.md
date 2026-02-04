# 📚 项目文件索引

## 🎯 快速导航

### 第一次使用？ 👈 从这里开始

1. **[QUICK_START.md](QUICK_START.md)** - 3 分钟快速开始
   - ⚡ 最快启动方式
   - 🎯 核心验证清单
   - 📊 性能指标快速查看

2. **[README.md](README.md)** - 完整项目文档
   - 📋 项目结构
   - 💡 核心设计要点
   - 🛠️ 开发者工具使用
   - 📝 参考资源

### 深入学习？ 📖 这些文档适合你

1. **[完整说明书.md](完整说明书.md)** - 中文详解版（强烈推荐）
   - 📁 所有文件详解
   - 🔄 完整数据流程
   - 📊 性能指标解释
   - 🎓 面试高频考点
   - 📈 代码复杂度分析

2. **[TEST_GUIDE.js](TEST_GUIDE.js)** - 完整测试用例
   - ✅ 8 个验证场景
   - 🔍 详细验证方法
   - 💻 Console 调试命令
   - 📈 性能对比数据

3. **[ADVANCED_OPTIMIZATION.js](ADVANCED_OPTIMIZATION.js)** - 高级优化方案
   - 🔧 Transferable Objects 优化
   - 🔄 多 Worker 并行处理
   - 💾 SharedArrayBuffer 零复制
   - 🗄️ IndexedDB 持久化
   - 🔤 Trie 树搜索建议
   - 📦 数据压缩

---

## 📂 文件说明

### 核心文件（3 个）

| 文件           | 行数 | 说明                           |
| -------------- | ---- | ------------------------------ |
| **index.html** | 433  | UI 界面、表格、控制面板        |
| **main.js**    | 455  | 主线程逻辑、虚拟列表、事件处理 |
| **worker.js**  | 277  | Worker 线程、数据处理、索引    |

### 文档文件（5 个）

| 文件                         | 说明                          |
| ---------------------------- | ----------------------------- |
| **README.md**                | 英文 / 详细功能说明           |
| **QUICK_START.md**           | 快速开始指南 + 验证清单       |
| **完整说明书.md**            | 中文 / 深度解析版（推荐阅读） |
| **TEST_GUIDE.js**            | 8 大测试场景 + 调试命令       |
| **ADVANCED_OPTIMIZATION.js** | 高级优化方案代码示例          |

### 工具文件（2 个）

| 文件            | 说明         |
| --------------- | ------------ |
| **start.sh**    | 一键启动脚本 |
| **validate.py** | 项目验证脚本 |

---

## 🚀 使用场景速查表

### 场景 1: 快速演示（5 分钟）

```
1. 阅读: QUICK_START.md 前 2 章
2. 运行: bash start.sh
3. 测试: 搜索框输入 "zhang"
4. 验证: 观察性能指标
```

### 场景 2: 理解设计（30 分钟）

```
1. 运行项目
2. 阅读: 完整说明书.md
3. 检查: main.js 中的 VirtualList 类
4. 检查: worker.js 中的 buildSearchIndex 函数
5. 实验: 修改参数，观察性能变化
```

### 场景 3: 面试准备（1 小时）

```
1. 快速运行项目演示
2. 重点阅读: 完整说明书.md 的面试考点部分
3. 复习: main.js 中的关键类和方法
4. 理解: 虚拟列表、倒排索引、缓存机制
5. 练习: 在 Console 中执行 window.debugMetrics()
```

### 场景 4: 深入研究（2 小时+）

```
1. 完整阅读所有文档
2. 研究: ADVANCED_OPTIMIZATION.js 中的高级方案
3. 修改代码，测试新想法
4. 运行测试用例: TEST_GUIDE.js 中的所有场景
5. 用 Chrome DevTools 进行性能分析
```

---

## 📖 按主题查找

### 虚拟列表相关

- **原理**: [完整说明书.md#虚拟列表](完整说明书.md)
- **代码**: [main.js#VirtualList](main.js) 第 72-200 行
- **测试**: [TEST_GUIDE.js#3️⃣虚拟列表渲染验证](TEST_GUIDE.js)
- **性能对比**: [README.md#性能指标](README.md)

### 倒排索引相关

- **原理**: [完整说明书.md#倒排索引构建](完整说明书.md)
- **代码**: [worker.js#buildSearchIndex](worker.js) 第 62-80 行
- **测试**: [TEST_GUIDE.js#5️⃣倒排索引搜索验证](TEST_GUIDE.js)
- **性能分析**: [完整说明书.md#性能对比](完整说明书.md)

### Worker 相关

- **原理**: [完整说明书.md#Worker职责](完整说明书.md)
- **代码**: [worker.js](worker.js) 全文
- **通信**: [main.js#WorkerManager](main.js) 第 119-160 行
- **测试**: [TEST_GUIDE.js#2️⃣Worker处理性能验证](TEST_GUIDE.js)

### 缓存机制

- **原理**: [完整说明书.md#缓存机制](完整说明书.md)
- **代码**: [worker.js#processData](worker.js) 第 161-200 行
- **测试**: [TEST_GUIDE.js#4️⃣缓存机制验证](TEST_GUIDE.js)

### 性能监控

- **原理**: [完整说明书.md#性能指标解释](完整说明书.md)
- **代码**: [main.js#PerformanceMonitor](main.js) 第 10-60 行
- **可视化**: [index.html#性能监控面板](index.html) 第 140-160 行
- **调试**: [TEST_GUIDE.js#调试命令](TEST_GUIDE.js)

### 高级优化

- **Transferable Objects**: [ADVANCED_OPTIMIZATION.js#1](ADVANCED_OPTIMIZATION.js)
- **Worker 线程池**: [ADVANCED_OPTIMIZATION.js#2](ADVANCED_OPTIMIZATION.js)
- **SharedArrayBuffer**: [ADVANCED_OPTIMIZATION.js#3](ADVANCED_OPTIMIZATION.js)
- **IndexedDB**: [ADVANCED_OPTIMIZATION.js#4](ADVANCED_OPTIMIZATION.js)
- **搜索建议**: [ADVANCED_OPTIMIZATION.js#5](ADVANCED_OPTIMIZATION.js)

---

## 🎯 关键代码速查

### 虚拟列表渲染

```javascript
// 文件: main.js
// 位置: VirtualList 类 render() 方法

// 只渲染可见范围的行
const topSpacer = Math.floor(this.scrollTop / this.itemHeight) * this.itemHeight;
const visibleRows = this.createRowElements(this.visibleStart, this.visibleEnd);
```

### 倒排索引搜索

```javascript
// 文件: worker.js
// 位置: buildSearchIndex() 和 searchByKeyword() 函数

// 快速前缀匹配
const matches = [];
for (const key in index) {
  if (key.startsWith(keyword)) {
    matches.push(...index[key]);
  }
}
```

### Worker 消息处理

```javascript
// 文件: main.js
// 位置: WorkerManager 类

worker.postMessage({ type: 'QUERY', payload: params });
worker.onmessage = (e) => handleResult(e.data);
```

### 防抖搜索

```javascript
// 文件: main.js
// 位置: setupEventListeners() 方法

clearTimeout(searchTimeout);
searchTimeout = setTimeout(() => {
  this.query();
}, 300);
```

---

## 📊 性能指标一览表

| 指标     | 目标    | 验证方法                |
| -------- | ------- | ----------------------- |
| INP      | < 200ms | 快速输入，看 metric-inp |
| 搜索耗时 | < 50ms  | 查看 metric-search      |
| FPS      | 60      | 快速滚动，看 metric-fps |
| 渲染行数 | ~20     | 查看 stat-rendered      |
| 内存占用 | 固定    | Memory 面板对比快照     |

---

## 🛠️ 常用命令

### 启动服务

```bash
# 方式 1: 使用启动脚本
bash /Users/ashy/Documents/example/web-worker/start.sh

# 方式 2: 手动启动
python3 -m http.server 8000

# 访问地址
# http://localhost:8000
```

### 验证项目

```bash
# 运行验证脚本
python3 /Users/ashy/Documents/example/web-worker/validate.py
```

### Console 调试命令

```javascript
// 查看性能指标
window.debugMetrics()

// 导出性能数据
window.exportMetrics()

// 查看虚拟列表状态
window.app.virtualList

// 查看搜索结果
window.app.allData.length

// 手动查询
window.app.currentParams = {search: 'test', filter: '', sort: ''}
window.app.query()
```

---

## ✅ 完整检查清单

### 文件完整性

- [x] index.html - UI 界面
- [x] main.js - 主线程逻辑
- [x] worker.js - Worker 逻辑
- [x] 所有文档齐全
- [x] 启动脚本就绪
- [x] 验证脚本就绪

### 功能完整性

- [x] 虚拟列表渲染
- [x] 倒排索引搜索
- [x] 排序功能
- [x] 筛选功能
- [x] 缓存机制
- [x] 性能监控
- [x] 防抖处理
- [x] 分块返回

### 性能指标

- [x] INP < 200ms
- [x] 搜索耗时 < 50ms
- [x] FPS = 60
- [x] 无长任务
- [x] 内存固定

### 文档完整性

- [x] 快速开始
- [x] 详细说明
- [x] 测试用例
- [x] 高级优化
- [x] 面试指南
- [x] 代码注释

---

## 🎓 学习路径建议

### 初级（了解基础）

```
1. QUICK_START.md - 快速启动
2. 运行项目，观察演示
3. README.md 前半部分 - 基本概念
```

### 中级（理解设计）

```
1. 完整说明书.md - 深度解析
2. 主要代码文件阅读：
   - main.js: VirtualList 类
   - worker.js: buildSearchIndex、processData 函数
3. 修改代码，实验效果
```

### 高级（优化扩展）

```
1. ADVANCED_OPTIMIZATION.js - 高级方案
2. TEST_GUIDE.js - 完整测试
3. 在 Chrome DevTools 中性能分析
4. 实现自己的优化版本
```

---

## 📞 问题排查

### 问题 1: 无法启动服务

```
症状: "Address already in use"
解决: 改变端口
  python3 -m http.server 8001
```

### 问题 2: 性能不理想

```
症状: FPS < 60，INP > 200ms
排查:
  1. 浏览器标签页是否过多
  2. 系统是否有其他程序占用 CPU
  3. 浏览器扩展是否干扰
  4. 尝试使用隐私模式
```

### 问题 3: 搜索无结果

```
症状: 输入关键词但无结果
原因: 关键词不在数据中
解决: 尝试输入 "zhang" 或 "wang"
```

### 问题 4: Worker 加载失败

```
症状: "Worker constructor: script is not accessible"
原因: 必须使用 HTTP 协议，不能用 file:// 
解决: 启动 HTTP 服务器
```

---

## 📚 拓展资源

### 官方文档

- [Web Worker API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
- [Performance API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Performance)
- [Chrome DevTools 性能分析](https://developer.chrome.com/docs/devtools/performance/)

### 相关概念

- 虚拟列表技术
- 倒排索引原理
- 线程池模式
- 消息队列通信
- Web 性能优化

### 面试参考

- Google Core Web Vitals
- INP 指标优化
- 主线程优化
- 长任务消除

---

## 🎉 现在你已经准备好了

选择上面的任何一个文档开始吧：

- **想快速上手？** → [QUICK_START.md](QUICK_START.md)
- **想深入理解？** → [完整说明书.md](完整说明书.md)
- **想进行测试？** → [TEST_GUIDE.js](TEST_GUIDE.js)
- **想学习优化？** → [ADVANCED_OPTIMIZATION.js](ADVANCED_OPTIMIZATION.js)

**祝你学习愉快！** 🚀
