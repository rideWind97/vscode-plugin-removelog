# AI 功能使用示例

## 快速开始

### 1. 配置API密钥

首次使用AI功能时，插件会提示你输入DeepSeek API密钥：

1. 在命令面板中执行任意AI命令
2. 在弹出的输入框中输入你的DeepSeek API密钥
3. 密钥会自动保存到VS Code全局配置中

### 2. 基本使用流程

#### AI智能分析日志语句
1. 打开包含日志语句的代码文件
2. 按 `Ctrl+Shift+A` (Windows/Linux) 或 `Cmd+Shift+A` (macOS)
3. 等待AI分析完成
4. 查看分析结果和建议

#### AI智能生成日志语句
1. 打开需要添加日志的代码文件
2. 按 `Ctrl+Shift+P` 打开命令面板
3. 输入 "AI智能生成日志语句"
4. 等待AI生成完成
5. 查看生成的代码和建议

## 使用场景示例

### 场景1：清理开发代码

**原始代码：**
```javascript
function processUserData(userData) {
  console.log("开始处理用户数据"); // 调试日志
  console.log("用户数据:", userData); // 调试日志
  
  if (!userData) {
    console.error("用户数据为空");
    return null;
  }
  
  const result = userData.map(item => {
    console.log("处理项目:", item); // 调试日志
    return item * 2;
  });
  
  console.log("处理完成，结果:", result); // 调试日志
  return result;
}
```

**使用AI智能移除后：**
```javascript
function processUserData(userData) {
  if (!userData) {
    console.error("用户数据为空");
    return null;
  }
  
  const result = userData.map(item => {
    return item * 2;
  });
  
  return result;
}
```

**AI分析结果：**
- 保留了错误日志 `console.error("用户数据为空")`
- 移除了4条调试日志
- 建议在生产环境中保留错误日志，移除调试日志

### 场景2：生成生产环境日志

**原始代码：**
```typescript
async function fetchUserProfile(userId: string) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    const userData = await response.json();
    return userData;
  } catch (error) {
    return null;
  }
}
```

**AI生成的改进代码：**
```typescript
async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  const startTime = Date.now();
  
  try {
    console.info(`开始获取用户资料: ${userId}`);
    
    const response = await fetch(`/api/users/${userId}`);
    
    if (!response.ok) {
      console.warn(`获取用户资料失败: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const userData = await response.json();
    const duration = Date.now() - startTime;
    
    console.info(`成功获取用户资料: ${userId}, 耗时: ${duration}ms`);
    return userData;
    
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`获取用户资料异常: ${userId}, 错误: ${error}, 耗时: ${duration}ms`);
    return null;
  }
}
```

**AI建议：**
- 添加了函数入口和出口日志
- 增加了错误处理和状态码检查
- 添加了性能监控日志
- 建议使用结构化日志格式

### 场景3：代码质量分析

**分析代码：**
```python
def calculate_average(numbers):
    total = 0
    count = 0
    for num in numbers:
        total += num
        count += 1
    return total / count
```

**AI分析结果：**
```
代码质量评分: 6/10

主要问题:
1. 缺少输入验证 - 空列表会导致除零错误
2. 变量命名可以更清晰
3. 缺少类型提示和文档字符串

改进建议:
1. 添加输入验证和异常处理
2. 使用更清晰的变量名
3. 添加类型提示和文档
4. 考虑使用内置函数优化

重构建议:
```python
from typing import List, Union

def calculate_average(numbers: List[Union[int, float]]) -> float:
    """
    计算数字列表的平均值
    
    Args:
        numbers: 数字列表
        
    Returns:
        平均值
        
    Raises:
        ValueError: 当列表为空时
    """
    if not numbers:
        raise ValueError("数字列表不能为空")
    
    return sum(numbers) / len(numbers)
```

测试建议:
1. 测试空列表情况
2. 测试正常数字列表
3. 测试包含零的列表
4. 测试浮点数列表
```

## 最佳实践

### 1. 日志级别使用
- **ERROR**: 系统错误、异常情况
- **WARN**: 警告信息、潜在问题
- **INFO**: 重要业务信息、关键操作
- **DEBUG**: 调试信息、开发阶段使用

### 2. 日志内容建议
- 包含足够的上下文信息
- 使用结构化数据格式
- 避免记录敏感信息
- 添加时间戳和请求ID

### 3. 性能考虑
- 避免在循环中记录大量日志
- 使用条件日志记录
- 考虑异步日志记录
- 定期清理旧日志文件

## 常见问题

### Q: AI功能响应慢怎么办？
A: 可以调整 `maxTokens` 配置，减少响应长度；或选择更快的模型如 `gpt-3.5-turbo`

### Q: 如何保护我的API密钥？
A: DeepSeek API密钥存储在VS Code全局配置中，不会上传到云端。建议定期更换密钥

### Q: AI建议不准确怎么办？
A: AI分析基于代码上下文，建议结合实际情况判断。可以多次运行获取不同角度的建议

### Q: 支持哪些编程语言？
A: 支持主流编程语言，包括JavaScript、TypeScript、Python、Java、C++等

## 高级配置

### 自定义AI提示词
可以在代码中修改 `ai-service.ts` 文件中的提示词模板，定制AI分析的方向和重点。

### 集成其他AI服务
通过修改 `ai-service.ts` 文件，可以集成其他AI服务提供商，如Claude、Gemini等。

