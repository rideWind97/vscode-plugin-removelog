# Remove Log - VS Code 插件

一个强大的 VS Code 插件，用于快速移除代码中的日志语句，支持多种编程语言。

## 功能特性

- 🚀 **快速移除日志语句** - 一键移除 console.log、console.error 等日志语句
- 🌍 **多语言支持** - 支持 JavaScript、TypeScript、Python、Java、C++、PHP、Go 等多种编程语言
- 📁 **灵活操作** - 支持单个文件、整个工作区的日志移除
- ⌨️ **快捷键支持** - 提供便捷的键盘快捷键操作
- 🔍 **智能识别** - 自动识别各种格式的日志语句，包括注释中的日志
- 📊 **进度显示** - 批量处理时显示详细的进度信息

## 安装方法

1. 在 VS Code 中按 `Ctrl+Shift+X` (Windows/Linux) 或 `Cmd+Shift+X` (macOS) 打开扩展面板
2. 搜索 "Remove Log" 或 "移除日志语句"
3. 点击安装按钮

## 使用方法

### 方法一：命令面板

1. 按 `Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (macOS) 打开命令面板
2. 输入以下命令之一：
   - `移除日志语句` - 移除当前文件中的日志语句
   - `移除当前文件中的日志语句` - 移除当前文件中的日志语句
   - `移除工作区中的日志语句` - 移除整个工作区中的日志语句

### 方法二：快捷键

- **移除当前文件中的日志语句**: `Ctrl+Shift+R` (Windows/Linux) 或 `Cmd+Shift+R` (macOS)

### 方法三：右键菜单

1. 在代码编辑器中右键点击
2. 选择 "移除日志语句" 选项

### 方法四：代码操作

当光标位于包含日志语句的行时，VS Code 会显示快速修复建议，点击即可移除该行的日志语句。

## 支持的日志语句格式

插件能够识别并移除以下格式的日志语句：

### JavaScript/TypeScript
```javascript
console.log("Hello World");
console.error("Error message");
console.warn("Warning message");
console.info("Info message");
console.debug("Debug message");

// 带注释的日志
// console.log("Commented log");
/* console.log("Multi-line comment log"); */
```

### Python
```python
print("Hello World")
logging.info("Info message")
logging.error("Error message")
```

### Java
```java
System.out.println("Hello World");
System.err.println("Error message");
logger.info("Info message");
```

### 其他语言
- C/C++: `printf()`, `cout <<`, `fprintf()`
- PHP: `echo`, `print_r()`, `var_dump()`
- Go: `fmt.Println()`, `log.Println()`
- Ruby: `puts`, `p`, `logger.info`
- Swift: `print()`, `NSLog()`

## 使用场景

### 开发阶段
- 快速清理调试代码
- 移除临时的日志输出
- 准备代码发布版本

### 代码审查
- 清理代码中的调试语句
- 提高代码质量
- 减少不必要的输出

### 生产环境
- 移除敏感信息
- 优化性能
- 清理代码

## 注意事项

⚠️ **重要提醒**：
- 插件会直接修改文件内容，建议在操作前备份重要文件
- 移除操作不可逆，请谨慎使用
- 建议在版本控制系统中提交当前更改后再使用插件

## 配置选项

插件目前使用默认配置，无需额外设置。支持的文件类型包括：
- JavaScript/TypeScript: `.js`, `.ts`, `.jsx`, `.tsx`
- Python: `.py`
- Java: `.java`
- C/C++: `.c`, `.cpp`, `.h`, `.hpp`
- PHP: `.php`
- Go: `.go`
- Ruby: `.rb`
- Swift: `.swift`
- Vue: `.vue`

## 故障排除

### 插件无法激活
- 确保 VS Code 版本 >= 1.103.0
- 检查是否有其他插件冲突
- 尝试重新加载 VS Code 窗口

### 无法识别日志语句
- 确保文件类型受支持
- 检查日志语句格式是否正确
- 尝试手动触发命令

### 批量处理失败
- 检查文件权限
- 确保工作区路径正确
- 查看 VS Code 输出面板的错误信息

## 更新日志

### 0.0.1
- 初始版本发布
- 支持基本的日志语句移除功能
- 支持单个文件和整个工作区的操作
- 提供快捷键和右键菜单支持

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个插件！

## 许可证

MIT License

---

**享受编码的乐趣！** 🎉
