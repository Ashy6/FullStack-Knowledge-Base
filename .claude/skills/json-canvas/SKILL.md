---
name: json-canvas
description: 创建和编辑包含节点、连线、分组和连接的 JSON Canvas 文件 (.canvas)。适用于处理 .canvas 文件、创建可视化画布、思维导图、流程图，或当用户提到 Obsidian 中的 Canvas 文件时。
---

# JSON Canvas 技能

此技能使兼容技能的 Agent 能够创建和编辑 Obsidian 和其他应用程序中使用的有效 JSON Canvas 文件 (`.canvas`)。

## 概述

JSON Canvas 是一种用于无限画布数据的开放文件格式。Canvas 文件使用 `.canvas` 扩展名，并包含遵循 [JSON Canvas Spec 1.0](https://jsoncanvas.org/spec/1.0/) 的有效 JSON。

## 文件结构

一个 canvas 文件包含两个顶层数组：

```json
{
  "nodes": [],
  "edges": []
}
```

- `nodes` (可选): 节点对象数组
- `edges` (可选): 连接节点的连线对象数组

## 节点

节点是放置在画布上的对象。有四种节点类型：

- `text` - 包含 Markdown 的文本内容
- `file` - 引用文件/附件
- `link` - 外部 URL
- `group` - 其他节点的可视化容器

### Z-Index 排序

节点在数组中按 z-index 排序：

- 第一个节点 = 底层（显示在其他节点下方）
- 最后一个节点 = 顶层（显示在其他节点上方）

### 通用节点属性

所有节点共享这些属性：

| 属性     | 必填 | 类型        | 描述                                         |
| -------- | ---- | ----------- | -------------------------------------------- |
| `id`     | 是   | string      | 节点的唯一标识符                             |
| `type`   | 是   | string      | 节点类型: `text`, `file`, `link`, 或 `group` |
| `x`      | 是   | integer     | X 坐标（像素）                               |
| `y`      | 是   | integer     | Y 坐标（像素）                               |
| `width`  | 是   | integer     | 宽度（像素）                                 |
| `height` | 是   | integer     | 高度（像素）                                 |
| `color`  | 否   | canvasColor | 节点颜色（见颜色部分）                       |

### 文本节点 (Text Nodes)

文本节点包含 Markdown 内容。

```json
{
  "id": "6f0ad84f44ce9c17",
  "type": "text",
  "x": 0,
  "y": 0,
  "width": 400,
  "height": 200,
  "text": "# Hello World\n\nThis is **Markdown** content."
}
```

#### 换行符转义 (常见陷阱)

在 JSON 中，字符串内的换行符 **必须** 表示为 `\n`。**不要** 在 `.canvas` 文件中使用字面序列 `\\n`——Obsidian 会将其渲染为字符 `\` 和 `n`，而不是换行符。

示例：

```json
{ "type": "text", "text": "Line 1\nLine 2" }
```

```json
{ "type": "text", "text": "Line 1\\nLine 2" }
```

| 属性   | 必填 | 类型   | 描述                       |
| ------ | ---- | ------ | -------------------------- |
| `text` | 是   | string | 包含 Markdown 语法的纯文本 |

### 文件节点 (File Nodes)

文件节点引用文件或附件（图像、视频、PDF、笔记等）。

```json
{
  "id": "a1b2c3d4e5f67890",
  "type": "file",
  "x": 500,
  "y": 0,
  "width": 400,
  "height": 300,
  "file": "Attachments/diagram.png"
}
```

```json
{
  "id": "b2c3d4e5f6789012",
  "type": "file",
  "x": 500,
  "y": 400,
  "width": 400,
  "height": 300,
  "file": "Notes/Project Overview.md",
  "subpath": "#Implementation"
}
```

| 属性      | 必填 | 类型   | 描述                          |
| --------- | ---- | ------ | ----------------------------- |
| `file`    | 是   | string | 系统内的文件路径              |
| `subpath` | 否   | string | 链接到标题或块（以 `#` 开头） |

### 链接节点 (Link Nodes)

链接节点显示外部 URL。

```json
{
  "id": "c3d4e5f678901234",
  "type": "link",
  "x": 1000,
  "y": 0,
  "width": 400,
  "height": 200,
  "url": "https://obsidian.md"
}
```

| 属性  | 必填 | 类型   | 描述     |
| ----- | ---- | ------ | -------- |
| `url` | 是   | string | 外部 URL |

### 分组节点 (Group Nodes)

分组节点是用于组织其他节点的可视化容器。

```json
{
  "id": "d4e5f6789012345a",
  "type": "group",
  "x": -50,
  "y": -50,
  "width": 1000,
  "height": 600,
  "label": "Project Overview",
  "color": "4"
}
```

```json
{
  "id": "e5f67890123456ab",
  "type": "group",
  "x": 0,
  "y": 700,
  "width": 800,
  "height": 500,
  "label": "Resources",
  "background": "Attachments/background.png",
  "backgroundStyle": "cover"
}
```

| 属性              | 必填 | 类型   | 描述           |
| ----------------- | ---- | ------ | -------------- |
| `label`           | 否   | string | 分组的文本标签 |
| `background`      | 否   | string | 背景图片路径   |
| `backgroundStyle` | 否   | string | 背景渲染样式   |

#### 背景样式

| 值       | 描述                         |
| -------- | ---------------------------- |
| `cover`  | 填充节点的整个宽度和高度     |
| `ratio`  | 保持背景图片的宽高比         |
| `repeat` | 在两个方向上重复图片作为图案 |

## 连线 (Edges)

连线是连接节点的线条。

```json
{
  "id": "f67890123456789a",
  "fromNode": "6f0ad84f44ce9c17",
  "toNode": "a1b2c3d4e5f67890"
}
```

```json
{
  "id": "0123456789abcdef",
  "fromNode": "6f0ad84f44ce9c17",
  "fromSide": "right",
  "fromEnd": "none",
  "toNode": "b2c3d4e5f6789012",
  "toSide": "left",
  "toEnd": "arrow",
  "color": "1",
  "label": "leads to"
}
```

| 属性       | 必填 | 类型        | 默认值  | 描述              |
| ---------- | ---- | ----------- | ------- | ----------------- |
| `id`       | 是   | string      | -       | 连线的唯一标识符  |
| `fromNode` | 是   | string      | -       | 连接起始的节点 ID |
| `fromSide` | 否   | string      | -       | 连线起始的一侧    |
| `fromEnd`  | 否   | string      | `none`  | 连线起始端的形状  |
| `toNode`   | 是   | string      | -       | 连接结束的节点 ID |
| `toSide`   | 否   | string      | -       | 连线结束的一侧    |
| `toEnd`    | 否   | string      | `arrow` | 连线结束端的形状  |
| `color`    | 否   | canvasColor | -       | 线条颜色          |
| `label`    | 否   | string      | -       | 连线的文本标签    |

### 侧边值 (Side Values)

| 值       | 描述         |
| -------- | ------------ |
| `top`    | 节点顶部边缘 |
| `right`  | 节点右侧边缘 |
| `bottom` | 节点底部边缘 |
| `left`   | 节点左侧边缘 |

### 端点形状 (End Shapes)

| 值      | 描述       |
| ------- | ---------- |
| `none`  | 无端点形状 |
| `arrow` | 箭头端点   |

## 颜色 (Colors)

`canvasColor` 类型可以通过两种方式指定：

### 十六进制颜色

```json
{
  "color": "#FF0000"
}
```

### 预设颜色

```json
{
  "color": "1"
}
```

| 预设  | 颜色 |
| ----- | ---- |
| `"1"` | 红色 |
| `"2"` | 橙色 |
| `"3"` | 黄色 |
| `"4"` | 绿色 |
| `"5"` | 青色 |
| `"6"` | 紫色 |

注意：预设的具体颜色值故意未定义，允许应用程序使用其自己的品牌颜色。

## 完整示例

### 带有文本和连接的简单画布

```json
{
  "nodes": [
    {
      "id": "8a9b0c1d2e3f4a5b",
      "type": "text",
      "x": 0,
      "y": 0,
      "width": 300,
      "height": 150,
      "text": "# Main Idea\n\nThis is the central concept."
    },
    {
      "id": "1a2b3c4d5e6f7a8b",
      "type": "text",
      "x": 400,
      "y": -100,
      "width": 250,
      "height": 100,
      "text": "## Supporting Point A\n\nDetails here."
    },
    {
      "id": "2b3c4d5e6f7a8b9c",
      "type": "text",
      "x": 400,
      "y": 100,
      "width": 250,
      "height": 100,
      "text": "## Supporting Point B\n\nMore details."
    }
  ],
  "edges": [
    {
      "id": "3c4d5e6f7a8b9c0d",
      "fromNode": "8a9b0c1d2e3f4a5b",
      "fromSide": "right",
      "toNode": "1a2b3c4d5e6f7a8b",
      "toSide": "left"
    },
    {
      "id": "4d5e6f7a8b9c0d1e",
      "fromNode": "8a9b0c1d2e3f4a5b",
      "fromSide": "right",
      "toNode": "2b3c4d5e6f7a8b9c",
      "toSide": "left"
    }
  ]
}
```

### 带有分组的项目看板

```json
{
  "nodes": [
    {
      "id": "5e6f7a8b9c0d1e2f",
      "type": "group",
      "x": 0,
      "y": 0,
      "width": 300,
      "height": 500,
      "label": "To Do",
      "color": "1"
    },
    {
      "id": "6f7a8b9c0d1e2f3a",
      "type": "group",
      "x": 350,
      "y": 0,
      "width": 300,
      "height": 500,
      "label": "In Progress",
      "color": "3"
    },
    {
      "id": "7a8b9c0d1e2f3a4b",
      "type": "group",
      "x": 700,
      "y": 0,
      "width": 300,
      "height": 500,
      "label": "Done",
      "color": "4"
    },
    {
      "id": "8b9c0d1e2f3a4b5c",
      "type": "text",
      "x": 20,
      "y": 50,
      "width": 260,
      "height": 80,
      "text": "## Task 1\n\nImplement feature X"
    },
    {
      "id": "9c0d1e2f3a4b5c6d",
      "type": "text",
      "x": 370,
      "y": 50,
      "width": 260,
      "height": 80,
      "text": "## Task 2\n\nReview PR #123",
      "color": "2"
    },
    {
      "id": "0d1e2f3a4b5c6d7e",
      "type": "text",
      "x": 720,
      "y": 50,
      "width": 260,
      "height": 80,
      "text": "## Task 3\n\n~~Setup CI/CD~~"
    }
  ],
  "edges": []
}
```

### 带有文件和链接的研究画布

```json
{
  "nodes": [
    {
      "id": "1e2f3a4b5c6d7e8f",
      "type": "text",
      "x": 300,
      "y": 200,
      "width": 400,
      "height": 200,
      "text": "# Research Topic\n\n## Key Questions\n\n- How does X affect Y?\n- What are the implications?",
      "color": "5"
    },
    {
      "id": "2f3a4b5c6d7e8f9a",
      "type": "file",
      "x": 0,
      "y": 0,
      "width": 250,
      "height": 150,
      "file": "Literature/Paper A.pdf"
    },
    {
      "id": "3a4b5c6d7e8f9a0b",
      "type": "file",
      "x": 0,
      "y": 200,
      "width": 250,
      "height": 150,
      "file": "Notes/Meeting Notes.md",
      "subpath": "#Key Insights"
    },
    {
      "id": "4b5c6d7e8f9a0b1c",
      "type": "link",
      "x": 0,
      "y": 400,
      "width": 250,
      "height": 100,
      "url": "https://example.com/research"
    },
    {
      "id": "5c6d7e8f9a0b1c2d",
      "type": "file",
      "x": 750,
      "y": 150,
      "width": 300,
      "height": 250,
      "file": "Attachments/diagram.png"
    }
  ],
  "edges": [
    {
      "id": "6d7e8f9a0b1c2d3e",
      "fromNode": "2f3a4b5c6d7e8f9a",
      "fromSide": "right",
      "toNode": "1e2f3a4b5c6d7e8f",
      "toSide": "left",
      "label": "supports"
    },
    {
      "id": "7e8f9a0b1c2d3e4f",
      "fromNode": "3a4b5c6d7e8f9a0b",
      "fromSide": "right",
      "toNode": "1e2f3a4b5c6d7e8f",
      "toSide": "left",
      "label": "informs"
    },
    {
      "id": "8f9a0b1c2d3e4f5a",
      "fromNode": "4b5c6d7e8f9a0b1c",
      "fromSide": "right",
      "toNode": "1e2f3a4b5c6d7e8f",
      "toSide": "left",
      "toEnd": "arrow",
      "color": "6"
    },
    {
      "id": "9a0b1c2d3e4f5a6b",
      "fromNode": "1e2f3a4b5c6d7e8f",
      "fromSide": "right",
      "toNode": "5c6d7e8f9a0b1c2d",
      "toSide": "left",
      "label": "visualized by"
    }
  ]
}
```

### 流程图

```json
{
  "nodes": [
    {
      "id": "a0b1c2d3e4f5a6b7",
      "type": "text",
      "x": 200,
      "y": 0,
      "width": 150,
      "height": 60,
      "text": "**Start**",
      "color": "4"
    },
    {
      "id": "b1c2d3e4f5a6b7c8",
      "type": "text",
      "x": 200,
      "y": 100,
      "width": 150,
      "height": 60,
      "text": "Step 1:\nGather data"
    },
    {
      "id": "c2d3e4f5a6b7c8d9",
      "type": "text",
      "x": 200,
      "y": 200,
      "width": 150,
      "height": 80,
      "text": "**Decision**\n\nIs data valid?",
      "color": "3"
    },
    {
      "id": "d3e4f5a6b7c8d9e0",
      "type": "text",
      "x": 400,
      "y": 200,
      "width": 150,
      "height": 60,
      "text": "Process data"
    },
    {
      "id": "e4f5a6b7c8d9e0f1",
      "type": "text",
      "x": 0,
      "y": 200,
      "width": 150,
      "height": 60,
      "text": "Request new data",
      "color": "1"
    },
    {
      "id": "f5a6b7c8d9e0f1a2",
      "type": "text",
      "x": 400,
      "y": 320,
      "width": 150,
      "height": 60,
      "text": "**End**",
      "color": "4"
    }
  ],
  "edges": [
    {
      "id": "a6b7c8d9e0f1a2b3",
      "fromNode": "a0b1c2d3e4f5a6b7",
      "fromSide": "bottom",
      "toNode": "b1c2d3e4f5a6b7c8",
      "toSide": "top"
    },
    {
      "id": "b7c8d9e0f1a2b3c4",
      "fromNode": "b1c2d3e4f5a6b7c8",
      "fromSide": "bottom",
      "toNode": "c2d3e4f5a6b7c8d9",
      "toSide": "top"
    },
    {
      "id": "c8d9e0f1a2b3c4d5",
      "fromNode": "c2d3e4f5a6b7c8d9",
      "fromSide": "right",
      "toNode": "d3e4f5a6b7c8d9e0",
      "toSide": "left",
      "label": "Yes",
      "color": "4"
    },
    {
      "id": "d9e0f1a2b3c4d5e6",
      "fromNode": "c2d3e4f5a6b7c8d9",
      "fromSide": "left",
      "toNode": "e4f5a6b7c8d9e0f1",
      "toSide": "right",
      "label": "No",
      "color": "1"
    },
    {
      "id": "e0f1a2b3c4d5e6f7",
      "fromNode": "e4f5a6b7c8d9e0f1",
      "fromSide": "top",
      "fromEnd": "none",
      "toNode": "b1c2d3e4f5a6b7c8",
      "toSide": "left",
      "toEnd": "arrow"
    },
    {
      "id": "f1a2b3c4d5e6f7a8",
      "fromNode": "d3e4f5a6b7c8d9e0",
      "fromSide": "bottom",
      "toNode": "f5a6b7c8d9e0f1a2",
      "toSide": "top"
    }
  ]
}
```

## ID 生成

节点和连线的 ID 必须是唯一字符串。Obsidian 生成 16 字符的十六进制 ID：

```json
"id": "6f0ad84f44ce9c17"
"id": "a3b2c1d0e9f8g7h6"
"id": "1234567890abcdef"
```

这种格式是一个 16 字符的小写十六进制字符串（64 位随机值）。

## 布局指南

### 定位

- 坐标可以是负数（画布无限延伸）
- `x` 向右增加
- `y` 向下增加
- 位置指的是节点的左上角

### 推荐尺寸

| 节点类型 | 建议宽度 | 建议高度 |
| -------- | -------- | -------- |
| 小文本   | 200-300  | 80-150   |
| 中等文本 | 300-450  | 150-300  |
| 大文本   | 400-600  | 300-500  |
| 文件预览 | 300-500  | 200-400  |
| 链接预览 | 250-400  | 100-200  |
| 分组     | 不定     | 不定     |

### 间距

- 在分组内部保留 20-50px 的内边距
- 节点之间保持 50-100px 的间距以提高可读性
- 将节点对齐到网格（10 或 20 的倍数）以获得更整洁的布局

## 验证规则

1. 所有 `id` 值必须在节点和连线中唯一
2. `fromNode` 和 `toNode` 必须引用现有的节点 ID
3. 每种节点类型必须包含必填字段
4. `type` 必须是以下之一：`text`, `file`, `link`, `group`
5. `backgroundStyle` 必须是以下之一：`cover`, `ratio`, `repeat`
6. `fromSide`, `toSide` 必须是以下之一：`top`, `right`, `bottom`, `left`
7. `fromEnd`, `toEnd` 必须是以下之一：`none`, `arrow`
8. 颜色预设必须是 `"1"` 到 `"6"` 或有效的十六进制颜色

## 参考

- [JSON Canvas Spec 1.0](https://jsoncanvas.org/spec/1.0/)
- [JSON Canvas GitHub](https://github.com/obsidianmd/jsoncanvas)
