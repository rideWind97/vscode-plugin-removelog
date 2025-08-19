"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
// 日志语句的正则表达式模式
const LOG_PATTERNS = [
    // console.log, console.error, console.warn, console.info
    /console\.(log|error|warn|info|debug)\s*\([^)]*\);?\s*/g,
    // console.log 等不带分号的
    /console\.(log|error|warn|info|debug)\s*\([^)]*\)\s*/g,
    // 单行注释中的 console 语句
    /\/\/\s*console\.(log|error|warn|info|debug)\s*\([^)]*\);?\s*/g,
    // 多行注释中的 console 语句
    /\/\*\s*console\.(log|error|warn|info|debug)\s*\([^)]*\);?\s*\*\//g
];
// 移除文本中的日志语句
function removeLogsFromText(text) {
    let result = text;
    let totalCount = 0;
    for (const pattern of LOG_PATTERNS) {
        const matches = result.match(pattern);
        if (matches) {
            totalCount += matches.length;
        }
        result = result.replace(pattern, '');
    }
    return { text: result, count: totalCount };
}
// 移除当前文件中的日志语句
async function removeLogsInFile(editor) {
    const document = editor.document;
    const text = document.getText();
    const { text: newText, count } = removeLogsFromText(text);
    if (count === 0) {
        vscode.window.showInformationMessage('当前文件中没有找到日志语句');
        return;
    }
    // 创建编辑操作
    const edit = new vscode.WorkspaceEdit();
    const fullRange = new vscode.Range(document.positionAt(0), document.positionAt(text.length));
    edit.replace(document.uri, fullRange, newText);
    // 应用编辑
    const success = await vscode.workspace.applyEdit(edit);
    if (success) {
        vscode.window.showInformationMessage(`成功移除 ${count} 条日志语句`);
    }
    else {
        vscode.window.showErrorMessage('移除日志语句失败');
    }
}
// 移除工作区中的日志语句
async function removeLogsInWorkspace() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('没有打开的工作区');
        return;
    }
    // 获取所有支持的文件
    const files = await vscode.workspace.findFiles('**/*.{js,ts,jsx,tsx,vue,py,java,cpp,c,cs,php,rb,go,rs,swift}', '**/node_modules/**');
    if (files.length === 0) {
        vscode.window.showInformationMessage('工作区中没有找到支持的文件');
        return;
    }
    let totalCount = 0;
    let processedFiles = 0;
    // 显示进度
    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: '正在移除工作区中的日志语句',
        cancellable: false
    }, async (progress) => {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            progress.report({
                message: `处理文件: ${file.fsPath.split('/').pop()}`,
                increment: (100 / files.length)
            });
            try {
                const document = await vscode.workspace.openTextDocument(file);
                const text = document.getText();
                const { text: newText, count } = removeLogsFromText(text);
                if (count > 0) {
                    const edit = new vscode.WorkspaceEdit();
                    const fullRange = new vscode.Range(document.positionAt(0), document.positionAt(text.length));
                    edit.replace(file, fullRange, newText);
                    await vscode.workspace.applyEdit(edit);
                    totalCount += count;
                    processedFiles++;
                }
            }
            catch (error) {
                console.error(`处理文件 ${file.fsPath} 时出错:`, error);
            }
        }
    });
    if (totalCount > 0) {
        vscode.window.showInformationMessage(`完成！在 ${processedFiles} 个文件中移除了 ${totalCount} 条日志语句`);
    }
    else {
        vscode.window.showInformationMessage('工作区中没有找到日志语句');
    }
}
// 显示日志语句统计信息
async function showLogStatistics() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('请先打开一个文件');
        return;
    }
    const document = editor.document;
    const text = document.getText();
    let totalCount = 0;
    const logTypes = {};
    for (const pattern of LOG_PATTERNS) {
        const matches = text.match(pattern);
        if (matches) {
            totalCount += matches.length;
            for (const match of matches) {
                const logType = match.match(/console\.(log|error|warn|info|debug)/);
                if (logType) {
                    const type = logType[1];
                    logTypes[type] = (logTypes[type] || 0) + 1;
                }
            }
        }
    }
    if (totalCount === 0) {
        vscode.window.showInformationMessage('当前文件中没有找到日志语句');
        return;
    }
    const details = Object.entries(logTypes)
        .map(([type, count]) => `${type}: ${count}`)
        .join(', ');
    vscode.window.showInformationMessage(`找到 ${totalCount} 条日志语句 (${details})`);
}
function activate(context) {
    console.log('Remove Log 插件已激活');
    // 注册命令
    const commands = [
        vscode.commands.registerCommand('vscode-plugin-removelog.removeLogs', () => {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                removeLogsInFile(editor);
            }
            else {
                vscode.window.showErrorMessage('请先打开一个文件');
            }
        }),
        vscode.commands.registerCommand('vscode-plugin-removelog.removeLogsInFile', () => {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                removeLogsInFile(editor);
            }
            else {
                vscode.window.showErrorMessage('请先打开一个文件');
            }
        }),
        vscode.commands.registerCommand('vscode-plugin-removelog.removeLogsInWorkspace', () => {
            removeLogsInWorkspace();
        })
    ];
    // 添加上下文菜单
    context.subscriptions.push(...commands, 
    // 注册右键菜单
    vscode.languages.registerCodeActionsProvider({ pattern: '**/*.{js,ts,jsx,tsx,vue,py,java,cpp,c,cs,php,rb,go,rs,swift}' }, {
        provideCodeActions(document, range, context) {
            const actions = [];
            // 检查当前行是否包含日志语句
            const line = document.lineAt(range.start.line);
            const lineText = line.text;
            if (LOG_PATTERNS.some(pattern => pattern.test(lineText))) {
                const removeAction = new vscode.CodeAction('移除日志语句', vscode.CodeActionKind.QuickFix);
                removeAction.command = {
                    command: 'vscode-plugin-removelog.removeLogsInFile',
                    title: '移除日志语句'
                };
                actions.push(removeAction);
            }
            return actions;
        }
    }));
}
function deactivate() { }
//# sourceMappingURL=extension.js.map