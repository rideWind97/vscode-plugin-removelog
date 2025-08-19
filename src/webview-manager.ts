import * as vscode from "vscode";
import * as path from "path";

export class WebviewManager {
  private static readonly viewType = "removeLogAI.webview";
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];

  constructor(context: vscode.ExtensionContext) {
    this._extensionUri = context.extensionUri;
  }

  public createWebviewPanel(
    title: string,
    viewType: string,
    content: string,
    language: string,
    fileName: string
  ): vscode.WebviewPanel {
    const panel = vscode.window.createWebviewPanel(
      viewType,
      title,
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [this._extensionUri],
        retainContextWhenHidden: true,
      }
    );

    panel.webview.html = this.getHtmlForWebview(
      panel.webview,
      content,
      language,
      fileName
    );

    // 处理webview消息
    panel.webview.onDidReceiveMessage(
      (message) => {
        switch (message.command) {
          case "copyCode":
            vscode.env.clipboard.writeText(message.text);
            vscode.window.showInformationMessage("代码已复制到剪贴板");
            break;
          case "applyChanges":
            this.applyCodeChanges(message.code, fileName);
            break;
        }
      },
      undefined,
      this._disposables
    );

    return panel;
  }

  private getHtmlForWebview(
    webview: vscode.Webview,
    content: string,
    language: string,
    fileName: string
  ): string {
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "main.css")
    );

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${fileName} - AI分析结果</title>
    <link rel="stylesheet" type="text/css" href="${styleResetUri}">
    <link rel="stylesheet" type="text/css" href="${styleVSCodeUri}">
    <link rel="stylesheet" type="text/css" href="${styleMainUri}">
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>AI分析结果</h1>
            <div class="file-info">
                <span class="file-name">${fileName}</span>
                <span class="language-badge">${language}</span>
            </div>
        </header>
        
        <main class="content">
            <div class="analysis-content">
                ${this.formatContent(content, language)}
            </div>
        </main>
        
        <footer class="footer">
            <div class="actions">
                <button class="btn btn-primary" onclick="copyAllCode()">
                    📋 复制所有代码
                </button>
                <button class="btn btn-secondary" onclick="applyChanges()">
                    ✅ 应用更改
                </button>
            </div>
        </footer>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        
        function copyAllCode() {
            const codeBlocks = document.querySelectorAll('pre code');
            let allCode = '';
            
            codeBlocks.forEach((block, index) => {
                if (index > 0) allCode += '\\n\\n';
                allCode += block.textContent;
            });
            
            vscode.postMessage({
                command: 'copyCode',
                text: allCode
            });
        }
        
        function applyChanges() {
            const codeBlocks = document.querySelectorAll('pre code');
            if (codeBlocks.length > 0) {
                const lastCodeBlock = codeBlocks[codeBlocks.length - 1];
                vscode.postMessage({
                    command: 'applyChanges',
                    code: lastCodeBlock.textContent
                });
            }
        }
        
        // 代码块语法高亮
        document.querySelectorAll('pre code').forEach((block) => {
            block.addEventListener('click', () => {
                const range = document.createRange();
                range.selectNodeContents(block);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            });
        });
        
        // 添加复制按钮到每个代码块
        document.querySelectorAll('pre').forEach((pre) => {
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.innerHTML = '📋';
            copyBtn.title = '复制代码';
            copyBtn.onclick = () => {
                const code = pre.querySelector('code').textContent;
                vscode.postMessage({
                    command: 'copyCode',
                    text: code
                });
            };
            pre.appendChild(copyBtn);
        });
    </script>
</body>
</html>`;
  }

  private formatContent(content: string, language: string): string {
    // 将Markdown内容转换为HTML
    let html = content
      // 代码块
      .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        const langClass = lang || language.toLowerCase();
        return `<pre><code class="language-${langClass}">${this.escapeHtml(
          code.trim()
        )}</code></pre>`;
      })
      // 行内代码
      .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
      // 标题
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      // 列表
      .replace(/^\d+\. (.*$)/gim, "<li>$1</li>")
      .replace(/^- (.*$)/gim, "<li>$1</li>")
      // 粗体和斜体
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      // 换行
      .replace(/\n/g, "<br>");

    // 包装列表项
    html = html.replace(/(<li>.*<\/li>)/g, "<ul>$1</ul>");

    return html;
  }

  private escapeHtml(text: string): string {
    // 简单的HTML转义
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  private async applyCodeChanges(
    code: string,
    fileName: string
  ): Promise<void> {
    try {
      const document = await vscode.workspace.openTextDocument(fileName);
      const edit = new vscode.WorkspaceEdit();
      const fullRange = new vscode.Range(
        document.positionAt(0),
        document.positionAt(document.getText().length)
      );

      edit.replace(document.uri, fullRange, code);
      const success = await vscode.workspace.applyEdit(edit);

      if (success) {
        vscode.window.showInformationMessage("代码更改已应用");
      } else {
        vscode.window.showErrorMessage("应用代码更改失败");
      }
    } catch (error) {
      vscode.window.showErrorMessage(`应用代码更改失败: ${error}`);
    }
  }

  public dispose(): void {
    this._disposables.forEach((disposable) => disposable.dispose());
  }
}
