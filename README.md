# Remove Log - VS Code 插件

一个强大的VS Code插件，用于快速移除代码中的日志语句，并集成AI智能分析功能。

## 功能特性

### 🚀 基础功能
- **快速移除日志**: 一键移除 `console.log`、`console.error` 等日志语句
- **多文件支持**: 支持单个文件或整个工作区的日志清理
- **多语言支持**: 支持 JavaScript、TypeScript、Python、Java、C++ 等多种编程语言
- **智能识别**: 自动识别注释中的日志语句

### 🤖 AI 智能功能
- **AI日志分析**: 智能分析哪些日志应该保留，哪些可以移除
- **AI日志生成**: 根据代码上下文生成合适的日志语句
- **AI代码质量分析**: 分析代码质量并提供改进建议
- **AI智能移除**: 基于AI建议智能移除日志语句
- **美观的Webview界面**: AI分析结果以现代化HTML界面展示，支持代码复制和应用

## 安装

1. 在VS Code中按 `Ctrl+Shift+X` 打开扩展面板
2. 搜索 "Remove Log"
3. 点击安装

## 使用方法

### 基础功能

#### 移除当前文件中的日志语句
- 快捷键: `Ctrl+Shift+R` (Windows/Linux) 或 `Cmd+Shift+R` (macOS)
- 命令面板: `Ctrl+Shift+P` → "移除当前文件中的日志语句"
- 右键菜单: 在代码编辑器中右键 → "移除日志语句"

#### 移除工作区中的日志语句
- 命令面板: `Ctrl+Shift+P` → "移除工作区中的日志语句"

### AI 功能

#### AI智能分析日志语句
- 快捷键: `Ctrl+Shift+A` (Windows/Linux) 或 `Cmd+Shift+A` (macOS)
- 命令面板: `Ctrl+Shift+P` → "AI智能分析日志语句"

#### AI智能生成日志语句
- 命令面板: `Ctrl+Shift+P` → "AI智能生成日志语句"

#### AI代码质量分析
- 命令面板: `Ctrl+Shift+P` → "AI代码质量分析"

## 配置

在VS Code设置中配置AI功能：

```json
{
  "removeLogAI.deepseekApiKey": "你的DeepSeek API密钥",
  "removeLogAI.model": "deepseek-chat",
  "removeLogAI.maxTokens": 1000
}
```

### 配置说明

- **deepseekApiKey**: DeepSeek API密钥（必需）
- **model**: 使用的AI模型，可选值：`deepseek-chat`、`deepseek-coder`、`deepseek-chat-instruct`
- **maxTokens**: AI响应的最大token数

## 支持的文件类型

- JavaScript (`.js`)
- TypeScript (`.ts`)
- React JSX (`.jsx`)
- React TSX (`.tsx`)
- Vue (`.vue`)
- Python (`.py`)
- Java (`.java`)
- C++ (`.cpp`, `.c`)
- C# (`.cs`)
- PHP (`.php`)
- Ruby (`.rb`)
- Go (`.go`)
- Rust (`.rs`)
- Swift (`.swift`)

## 使用场景

### 开发阶段
- 快速清理调试代码
- 移除临时日志语句
- 保持代码整洁

### 生产环境准备
- 智能分析哪些日志应该保留
- 移除不必要的调试信息
- 优化代码性能

### 代码质量提升
- AI分析代码结构
- 获取改进建议
- 学习最佳实践

## 注意事项

1. **API密钥安全**: 请妥善保管你的DeepSeek API密钥
2. **网络连接**: AI功能需要网络连接才能使用
3. **API费用**: 使用AI功能会产生DeepSeek API调用费用
4. **代码备份**: 建议在重要操作前备份代码

## 故障排除

### AI功能无法使用
1. 检查是否配置了正确的DeepSeek API密钥
2. 确认网络连接正常
3. 检查API密钥是否有效

### 插件无响应
1. 重启VS Code
2. 检查插件是否正确安装
3. 查看VS Code输出面板中的错误信息

## 贡献

欢迎提交Issue和Pull Request来改进这个插件！

## 许可证

MIT License

## 更新日志

### v0.0.1
- 基础日志移除功能
- AI智能分析功能
- AI日志生成功能
- AI代码质量分析
- 多语言支持
- 配置管理
