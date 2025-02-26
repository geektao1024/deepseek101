# DeepSeek工具数据目录结构

本目录包含DeepSeek相关工具的数据文件，按照以下结构组织：

## 目录结构

```
data/
├── json/
│   ├── tools.json                       # 主索引文件，包含所有类别信息和工具列表
│   ├── categories/
│   │   ├── index.json                   # 类别索引文件
│   │   ├── applications.json            # 应用类别工具列表
│   │   ├── ai-frameworks.json           # AI框架类别工具列表
│   │   └── ...                          # 其他类别工具列表
│   ├── tools/
│   │   └── details/                     # 工具详情文件目录（按类别组织）
│   │       ├── applications/            # 应用类别工具详情文件
│   │       ├── ai-frameworks/           # AI框架类别工具详情文件
│   │       └── ...                      # 其他类别工具详情文件
├── tools/
│   └── details/                         # 原始工具详情文件目录（仅作为源文件保留）
└── README.md                            # 本文件
```

## 文件说明

### 1. tools.json

主索引文件，包含所有类别的基本信息、对应的类别文件路径，以及用于前端显示的工具列表。

### 2. categories/index.json

类别索引文件，包含所有类别的基本信息和对应的类别文件名。

### 3. categories/{category_id}.json

各类别工具列表文件，包含该类别下所有工具的基本信息和对应的详情文件路径。

### 4. tools/details/{category_id}/{tool_id}.json

各工具的详情文件，包含工具的完整信息，如概述、功能、使用场景、优势、FAQ和资源链接等。这种结构符合 SEO 最佳实践，使得 URL 更加清晰和有意义。

## 工具管理

为了方便管理工具数据，我们提供了以下脚本：

1. `scripts/update_details_category.sh` - 更新详情文件的类别字段
2. `scripts/add_tool_to_category.sh` - 将新工具添加到指定类别
3. `scripts/cleanup.sh` - 清理旧的目录结构
4. `scripts/create_empty_category_files.sh` - 创建空的类别文件框架
5. `scripts/update_tools_from_categories.sh` - 从各类别文件中提取工具信息并更新主工具文件

### 添加新工具

1. 在 `data/tools/details/` 目录下创建工具详情文件，如 `new-tool.json`
2. 运行脚本将工具添加到指定类别：
   ```bash
   ./scripts/add_tool_to_category.sh new-tool applications
   ```
3. 手动编辑对应的类别文件，添加工具的基本信息和引用路径（使用 `../tools/details/{category_id}/{tool_id}.json` 格式）
4. 运行脚本更新主工具文件：
   ```bash
   ./scripts/update_tools_from_categories.sh
   ```

### 数据结构兼容性

请注意，为了保持与前端代码的兼容性，主工具文件 `tools.json` 需要同时包含 `categories` 和 `tools` 两个数组。`tools` 数组中的工具信息可以通过 `update_tools_from_categories.sh` 脚本从各类别文件中自动提取并更新。

## 数据格式

### 工具详情文件格式

```json
{
  "id": "tool-id",
  "name": "Tool Name",
  "description": "工具简短描述",
  "url": "https://github.com/example/tool",
  "category": "applications",
  "tags": ["tag1", "tag2", "tag3"],
  "rating": {
    "score": 4.5,
    "count": 100
  },
  "content": {
    "overview": "工具详细概述...",
    "features": [
      {
        "title": "功能1",
        "description": "功能1的详细描述"
      },
      // 更多功能...
    ],
    "useCases": [
      {
        "title": "使用场景1",
        "description": "使用场景1的详细描述"
      },
      // 更多使用场景...
    ],
    "advantages": [
      "优势1",
      "优势2",
      // 更多优势...
    ],
    "faqs": [
      {
        "question": "问题1",
        "answer": "回答1"
      },
      // 更多问答...
    ],
    "resources": [
      {
        "title": "资源1",
        "url": "https://example.com/resource1"
      },
      // 更多资源...
    ]
  }
}
``` 