# 插件调试指南

## 问题排查步骤

### 1. 检查插件是否正确加载

1. **打开命令面板** (`Ctrl+Shift+P` 或 `Cmd+Shift+P`)
2. **输入 "Developer: Show Running Extensions"**
3. 查看是否有 "Remove Log" 插件在运行

### 2. 检查命令是否可用

1. **打开命令面板** (`Ctrl+Shift+P` 或 `Cmd+Shift+P`)
2. **输入以下命令之一**：
   - `AI智能分析日志语句`
   - `AI智能生成日志语句`
   - `AI代码质量分析`
   - `AI智能移除日志语句`

### 3. 检查输出面板

1. **打开输出面板** (`Ctrl+Shift+U` 或 `Cmd+Shift+U`)
2. **选择 "Remove Log"** 输出通道
3. 查看是否有错误信息

### 4. 检查开发者控制台

1. **按 F12** 或 **Help > Toggle Developer Tools**
2. 查看控制台是否有错误信息

## 常见问题及解决方案

### 问题1: 命令不显示

**可能原因**：
- 插件未正确激活
- 配置文件有语法错误
- 编译失败

**解决方案**：
1. 重新加载VS Code窗口 (`Ctrl+Shift+P` → "Developer: Reload Window")
2. 检查package.json语法
3. 重新编译项目

### 问题2: AI功能无响应

**可能原因**：
- API密钥未配置
- 网络连接问题
- API调用失败

**解决方案**：
1. 检查DeepSeek API密钥配置
2. 确认网络连接正常
3. 查看输出面板的错误信息

### 问题3: Webview不显示

**可能原因**：
- CSS文件路径错误
- Webview权限问题

**解决方案**：
1. 检查media目录下的CSS文件
2. 确认webview权限设置

## 测试步骤

### 1. 基础功能测试

1. 创建一个测试文件，包含console.log语句
2. 使用 `Ctrl+Shift+R` 测试基础日志移除功能
3. 确认基础功能正常工作

### 2. AI功能测试

1. 确保已配置DeepSeek API密钥
2. 打开包含日志语句的文件
3. 使用 `Ctrl+Shift+A` 测试AI分析功能
4. 检查webview是否正确显示

### 3. 配置测试

1. 检查VS Code设置中的配置项
2. 确认API密钥格式正确
3. 测试不同的模型选项

## 调试命令

### 在VS Code中测试

```bash
# 重新加载窗口
Ctrl+Shift+P → "Developer: Reload Window"

# 显示运行中的扩展
Ctrl+Shift+P → "Developer: Show Running Extensions"

# 打开输出面板
Ctrl+Shift+U

# 打开开发者工具
F12 或 Help > Toggle Developer Tools
```

### 在终端中测试

```bash
# 编译项目
pnpm run compile

# 检查编译输出
pnpm run package

# 运行测试
pnpm run test
```

## 日志分析

### 插件激活日志

在输出面板中查看：
```
Remove Log 插件已激活
```

### AI服务日志

查看API调用状态：
```
AI正在分析日志语句...
AI分析失败: [错误信息]
```

### Webview日志

查看webview创建状态：
```
Webview面板已创建
```

## 性能优化

### 1. 减少API调用

- 合理设置maxTokens
- 避免频繁调用AI服务

### 2. 优化Webview

- 减少CSS文件大小
- 优化JavaScript代码

### 3. 缓存机制

- 考虑添加结果缓存
- 避免重复分析相同代码

## 联系支持

如果问题仍然存在：

1. 检查GitHub Issues
2. 提交新的Issue
3. 提供详细的错误信息和复现步骤

## 更新日志

### v1.1.0
- 修复了AI命令注册问题
- 添加了完整的激活事件配置
- 优化了错误处理机制
