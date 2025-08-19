import * as vscode from "vscode";
import OpenAI from "openai";

export class AIService {
  private openai: OpenAI | null = null;
  private config: vscode.WorkspaceConfiguration;

  constructor() {
    this.config = vscode.workspace.getConfiguration("removeLogAI");
    this.initializeOpenAI();
  }

  private initializeOpenAI(): void {
    const apiKey = this.config.get<string>("openaiApiKey");
    if (apiKey && apiKey.trim() !== "") {
      this.openai = new OpenAI({
        apiKey: apiKey.trim(),
      });
    }
  }

  public async checkAPIKey(): Promise<boolean> {
    if (!this.openai) {
      const apiKey = await this.promptForAPIKey();
      if (apiKey) {
        this.config.update("openaiApiKey", apiKey, vscode.ConfigurationTarget.Global);
        this.initializeOpenAI();
        return true;
      }
      return false;
    }
    return true;
  }

  private async promptForAPIKey(): Promise<string | undefined> {
    const apiKey = await vscode.window.showInputBox({
      prompt: "请输入OpenAI API密钥",
      password: true,
      placeHolder: "sk-...",
    });
    return apiKey;
  }

  public async analyzeLogs(code: string, language: string): Promise<string> {
    if (!(await this.checkAPIKey())) {
      throw new Error("未配置API密钥");
    }

    const prompt = `分析以下${language}代码中的日志语句，判断哪些应该保留，哪些应该移除。请给出详细的分析和建议：

代码：
\`\`\`${language}
${code}
\`\`\`

请从以下角度分析：
1. 哪些日志语句在生产环境中应该保留（如错误日志、关键业务日志）
2. 哪些日志语句可以安全移除（如调试日志、临时日志）
3. 建议的日志级别和格式
4. 代码质量改进建议

请用中文回答，格式要清晰易读。`;

    try {
      const response = await this.openai!.chat.completions.create({
        model: this.config.get<string>("model", "gpt-3.5-turbo"),
        messages: [{ role: "user", content: prompt }],
        max_tokens: this.config.get<number>("maxTokens", 1000),
        temperature: 0.3,
      });

      return response.choices[0]?.message?.content || "AI分析失败";
    } catch (error) {
      throw new Error(`AI分析失败: ${error}`);
    }
  }

  public async generateLogs(code: string, language: string): Promise<string> {
    if (!(await this.checkAPIKey())) {
      throw new Error("未配置API密钥");
    }

    const prompt = `为以下${language}代码生成合适的日志语句。请考虑：

1. 函数入口和出口的日志
2. 关键业务逻辑的日志
3. 错误处理的日志
4. 性能监控的日志

代码：
\`\`\`${language}
${code}
\`\`\`

请生成：
1. 改进后的代码（包含合适的日志语句）
2. 日志语句的说明和用途
3. 建议的日志级别

请用中文回答，代码要完整可运行。`;

    try {
      const response = await this.openai!.chat.completions.create({
        model: this.config.get<string>("model", "gpt-3.5-turbo"),
        messages: [{ role: "user", content: prompt }],
        max_tokens: this.config.get<number>("maxTokens", 1000),
        temperature: 0.4,
      });

      return response.choices[0]?.message?.content || "AI生成失败";
    } catch (error) {
      throw new Error(`AI生成失败: ${error}`);
    }
  }

  public async analyzeCodeQuality(code: string, language: string): Promise<string> {
    if (!(await this.checkAPIKey())) {
      throw new Error("未配置API密钥");
    }

    const prompt = `分析以下${language}代码的质量，重点关注：

1. 代码结构和可读性
2. 错误处理和边界情况
3. 性能优化建议
4. 最佳实践建议
5. 安全性考虑

代码：
\`\`\`${language}
${code}
\`\`\`

请提供：
1. 代码质量评分（1-10分）
2. 主要问题和改进建议
3. 重构建议
4. 测试建议

请用中文回答，建议要具体可操作。`;

    try {
      const response = await this.openai!.chat.completions.create({
        model: this.config.get<string>("model", "gpt-3.5-turbo"),
        messages: [{ role: "user", content: prompt }],
        max_tokens: this.config.get<number>("maxTokens", 1000),
        temperature: 0.3,
      });

      return response.choices[0]?.message?.content || "AI分析失败";
    } catch (error) {
      throw new Error(`AI分析失败: ${error}`);
    }
  }

  public async smartRemoveLogs(code: string, language: string): Promise<{ code: string; removedCount: number; keptCount: number }> {
    if (!(await this.checkAPIKey())) {
      throw new Error("未配置API密钥");
    }

    const prompt = `智能移除以下${language}代码中的日志语句。请遵循以下规则：

1. 保留错误日志（console.error）
2. 保留关键业务日志
3. 移除调试日志（console.log）
4. 移除临时日志
5. 保持代码结构完整

代码：
\`\`\`${language}
${code}
\`\`\`

请返回：
1. 清理后的代码
2. 移除的日志数量
3. 保留的日志数量
4. 移除原因说明

请用中文回答，代码要完整可运行。`;

    try {
      const response = await this.openai!.chat.completions.create({
        model: this.config.get<string>("model", "gpt-3.5-turbo"),
        messages: [{ role: "user", content: prompt }],
        max_tokens: this.config.get<number>("maxTokens", 1500),
        temperature: 0.2,
      });

      const content = response.choices[0]?.message?.content || "";
      
      // 简单解析AI响应
      const codeMatch = content.match(/```(?:[a-z]*\n)?([\s\S]*?)```/);
      const code = codeMatch ? codeMatch[1].trim() : code;
      
      // 统计日志数量
      const logPatterns = [
        /console\.(log|error|warn|info|debug)\s*\([^)]*\);?\s*/g,
      ];
      
      let removedCount = 0;
      let keptCount = 0;
      
      for (const pattern of logPatterns) {
        const matches = code.match(pattern);
        if (matches) {
          removedCount += matches.filter(match => !match.includes('console.error')).length;
          keptCount += matches.filter(match => match.includes('console.error')).length;
        }
      }

      return { code, removedCount, keptCount };
    } catch (error) {
      throw new Error(`智能移除失败: ${error}`);
    }
  }
}