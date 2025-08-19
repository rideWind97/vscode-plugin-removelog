// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { AIService } from "./ai-service";
import { WebviewManager } from "./webview-manager";

// 日志语句的正则表达式模式
const LOG_PATTERNS = [
  // console.log, console.error, console.warn, console.info
  /console\.(log|error|warn|info|debug)\s*\([^)]*\);?\s*/g,
  // console.log 等不带分号的
  /console\.(log|error|warn|info|debug)\s*\([^)]*\)\s*/g,
  // 单行注释中的 console 语句
  /\/\/\s*console\.(log|error|warn|info|debug)\s*\([^)]*\);?\s*/g,
  // 多行注释中的 console 语句
  /\/\*\s*console\.(log|error|warn|info|debug)\s*\([^)]*\);?\s*\*\//g,
];

// AI服务实例
let aiService: AIService;
// Webview管理器实例
let webviewManager: WebviewManager;

// 移除文本中的日志语句
function removeLogsFromText(text: string): { text: string; count: number } {
  let result = text;
  let totalCount = 0;

  for (const pattern of LOG_PATTERNS) {
    const matches = result.match(pattern);
    if (matches) {
      totalCount += matches.length;
    }
    result = result.replace(pattern, "");
  }

  return { text: result, count: totalCount };
}

// 获取文件语言标识
function getLanguageId(document: vscode.TextDocument): string {
  const languageMap: { [key: string]: string } = {
    javascript: "JavaScript",
    typescript: "TypeScript",
    javascriptreact: "React JSX",
    typescriptreact: "React TSX",
    vue: "Vue",
    python: "Python",
    java: "Java",
    cpp: "C++",
    c: "C",
    csharp: "C#",
    php: "PHP",
    ruby: "Ruby",
    go: "Go",
    rust: "Rust",
    swift: "Swift",
  };

  return languageMap[document.languageId] || document.languageId;
}

// 移除当前文件中的日志语句
async function removeLogsInFile(editor: vscode.TextEditor): Promise<void> {
  const document = editor.document;
  const text = document.getText();

  const { text: newText, count } = removeLogsFromText(text);

  if (count === 0) {
    vscode.window.showInformationMessage("当前文件中没有找到日志语句");
    return;
  }

  // 创建编辑操作
  const edit = new vscode.WorkspaceEdit();
  const fullRange = new vscode.Range(
    document.positionAt(0),
    document.positionAt(text.length)
  );

  edit.replace(document.uri, fullRange, newText);

  // 应用编辑
  const success = await vscode.workspace.applyEdit(edit);

  if (success) {
    vscode.window.showInformationMessage(`成功移除 ${count} 条日志语句`);
  } else {
    vscode.window.showErrorMessage("移除日志语句失败");
  }
}

// AI智能分析日志语句
async function aiAnalyzeLogs(editor: vscode.TextEditor): Promise<void> {
  const document = editor.document;
  const text = document.getText();
  const language = getLanguageId(document);

  try {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "AI正在分析日志语句...",
        cancellable: false,
      },
      async () => {
        const analysis = await aiService.analyzeLogs(text, language);

        // 使用webview显示分析结果
        const panel = webviewManager.createWebviewPanel(
          "AI日志分析结果",
          "removeLogAI.analysis",
          analysis,
          language,
          document.fileName
        );
      }
    );
  } catch (error) {
    vscode.window.showErrorMessage(`AI分析失败: ${error}`);
  }
}

// AI智能生成日志语句
async function aiGenerateLogs(editor: vscode.TextEditor): Promise<void> {
  const document = editor.document;
  const text = document.getText();
  const language = getLanguageId(document);

  try {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "AI正在生成日志语句...",
        cancellable: false,
      },
      async () => {
        const generatedCode = await aiService.generateLogs(text, language);

        // 使用webview显示生成的代码
        const panel = webviewManager.createWebviewPanel(
          "AI生成的日志代码",
          "removeLogAI.generation",
          generatedCode,
          language,
          document.fileName
        );
      }
    );
  } catch (error) {
    vscode.window.showErrorMessage(`AI生成失败: ${error}`);
  }
}

// AI代码质量分析
async function aiCodeQuality(editor: vscode.TextEditor): Promise<void> {
  const document = editor.document;
  const text = document.getText();
  const language = getLanguageId(document);

  try {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "AI正在分析代码质量...",
        cancellable: false,
      },
      async () => {
        const analysis = await aiService.analyzeCodeQuality(text, language);

        // 使用webview显示分析结果
        const panel = webviewManager.createWebviewPanel(
          "AI代码质量分析",
          "removeLogAI.quality",
          analysis,
          language,
          document.fileName
        );
      }
    );
  } catch (error) {
    vscode.window.showErrorMessage(`AI分析失败: ${error}`);
  }
}

// AI智能移除日志语句
async function aiSmartRemoveLogs(editor: vscode.TextEditor): Promise<void> {
  const document = editor.document;
  const text = document.getText();
  const language = getLanguageId(document);

  try {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "AI正在智能移除日志语句...",
        cancellable: false,
      },
      async () => {
        const result = await aiService.smartRemoveLogs(text, language);

        if (result.removedCount === 0) {
          vscode.window.showInformationMessage("AI建议保留所有日志语句");
          return;
        }

        // 询问用户是否应用AI的建议
        const action = await vscode.window.showInformationMessage(
          `AI建议移除 ${result.removedCount} 条日志语句，保留 ${result.keptCount} 条。是否应用？`,
          "应用",
          "查看详情",
          "取消"
        );

        if (action === "应用") {
          // 应用AI的建议
          const edit = new vscode.WorkspaceEdit();
          const fullRange = new vscode.Range(
            document.positionAt(0),
            document.positionAt(text.length)
          );

          edit.replace(document.uri, fullRange, result.code);
          const success = await vscode.workspace.applyEdit(edit);

          if (success) {
            vscode.window.showInformationMessage(
              `AI成功移除 ${result.removedCount} 条日志语句`
            );
          } else {
            vscode.window.showErrorMessage("应用AI建议失败");
          }
        } else if (action === "查看详情") {
          // 使用webview显示AI的详细建议
          const content = `## AI智能移除建议

## 移除统计
- 移除: ${result.removedCount} 条
- 保留: ${result.keptCount} 条

## 清理后的代码
\`\`\`${language}
${result.code}
\`\`\``;

          const panel = webviewManager.createWebviewPanel(
            "AI智能移除建议",
            "removeLogAI.smartRemove",
            content,
            language,
            document.fileName
          );
        }
      }
    );
  } catch (error) {
    vscode.window.showErrorMessage(`AI智能移除失败: ${error}`);
  }
}

// 移除工作区中的日志语句
async function removeLogsInWorkspace(): Promise<void> {
  const workspaceFolders = vscode.workspace.workspaceFolders;

  if (!workspaceFolders) {
    vscode.window.showErrorMessage("没有打开的工作区");
    return;
  }

  // 获取所有支持的文件
  const files = await vscode.workspace.findFiles(
    "**/*.{js,ts,jsx,tsx,vue,py,java,cpp,c,cs,php,rb,go,rs,swift}",
    "**/node_modules/**"
  );

  if (files.length === 0) {
    vscode.window.showInformationMessage("工作区中没有找到支持的文件");
    return;
  }

  let totalCount = 0;
  let processedFiles = 0;

  // 显示进度
  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "正在移除工作区中的日志语句",
      cancellable: false,
    },
    async (progress) => {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        progress.report({
          message: `处理文件: ${file.fsPath.split("/").pop()}`,
          increment: 100 / files.length,
        });

        try {
          const document = await vscode.workspace.openTextDocument(file);
          const text = document.getText();
          const { text: newText, count } = removeLogsFromText(text);

          if (count > 0) {
            const edit = new vscode.WorkspaceEdit();
            const fullRange = new vscode.Range(
              document.positionAt(0),
              document.positionAt(text.length)
            );

            edit.replace(file, fullRange, newText);
            await vscode.workspace.applyEdit(edit);

            totalCount += count;
            processedFiles++;
          }
        } catch (error) {
          console.error(`处理文件 ${file.fsPath} 时出错:`, error);
        }
      }
    }
  );

  if (totalCount > 0) {
    vscode.window.showInformationMessage(
      `完成！在 ${processedFiles} 个文件中移除了 ${totalCount} 条日志语句`
    );
  } else {
    vscode.window.showInformationMessage("工作区中没有找到日志语句");
  }
}

export function activate(context: vscode.ExtensionContext) {
  console.log("Remove Log 插件已激活");

  // 初始化AI服务
  aiService = new AIService();
  // 初始化Webview管理器
  webviewManager = new WebviewManager(context);

  // 注册命令
  const commands = [
    vscode.commands.registerCommand(
      "vscode-plugin-removelog.removeLogs",
      () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
          removeLogsInFile(editor);
        } else {
          vscode.window.showErrorMessage("请先打开一个文件");
        }
      }
    ),

    vscode.commands.registerCommand(
      "vscode-plugin-removelog.removeLogsInFile",
      () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
          removeLogsInFile(editor);
        } else {
          vscode.window.showErrorMessage("请先打开一个文件");
        }
      }
    ),

    vscode.commands.registerCommand(
      "vscode-plugin-removelog.removeLogsInWorkspace",
      () => {
        removeLogsInWorkspace();
      }
    ),

    // AI相关命令
    vscode.commands.registerCommand(
      "vscode-plugin-removelog.aiAnalyzeLogs",
      () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
          aiAnalyzeLogs(editor);
        } else {
          vscode.window.showErrorMessage("请先打开一个文件");
        }
      }
    ),

    vscode.commands.registerCommand(
      "vscode-plugin-removelog.aiGenerateLogs",
      () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
          aiGenerateLogs(editor);
        } else {
          vscode.window.showErrorMessage("请先打开一个文件");
        }
      }
    ),

    vscode.commands.registerCommand(
      "vscode-plugin-removelog.aiCodeQuality",
      () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
          aiCodeQuality(editor);
        } else {
          vscode.window.showErrorMessage("请先打开一个文件");
        }
      }
    ),

    vscode.commands.registerCommand(
      "vscode-plugin-removelog.aiSmartRemoveLogs",
      () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
          aiSmartRemoveLogs(editor);
        } else {
          vscode.window.showErrorMessage("请先打开一个文件");
        }
      }
    ),
  ];

  // 添加上下文菜单
  context.subscriptions.push(
    ...commands,

    // 注册右键菜单
    vscode.languages.registerCodeActionsProvider(
      {
        pattern: "**/*.{js,ts,jsx,tsx,vue,py,java,cpp,c,cs,php,rb,go,rs,swift}",
      },
      {
        provideCodeActions(document, range, context) {
          const actions: vscode.CodeAction[] = [];

          // 检查当前行是否包含日志语句
          const line = document.lineAt(range.start.line);
          const lineText = line.text;

          if (LOG_PATTERNS.some((pattern) => pattern.test(lineText))) {
            const removeAction = new vscode.CodeAction(
              "移除日志语句",
              vscode.CodeActionKind.QuickFix
            );
            removeAction.command = {
              command: "vscode-plugin-removelog.removeLogsInFile",
              title: "移除日志语句",
            };
            actions.push(removeAction);

            // 添加AI智能移除选项
            const aiRemoveAction = new vscode.CodeAction(
              "AI智能移除",
              vscode.CodeActionKind.QuickFix
            );
            aiRemoveAction.command = {
              command: "vscode-plugin-removelog.aiSmartRemoveLogs",
              title: "AI智能移除",
            };
            actions.push(aiRemoveAction);
          }

          return actions;
        },
      }
    )
  );

  // 监听配置变化
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration("removeLogAI")) {
        // 重新初始化AI服务
        aiService = new AIService();
      }
    })
  );
}

export function deactivate() {}
