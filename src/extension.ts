// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { cloc } from 'cloc-lib';


interface CLOCResponse {
    header: any;
    SUM: {
        blank: number;
        comment: number;
        code: number;
        nFiles: number;
    }
}

let disposable: vscode.Disposable;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {


    const commentDensityStatusBar = new CommentDensityStatusBar();

    disposable = vscode.commands.registerCommand('extension.calculate.comment.density', async () => {

        const percentage = await commentDensityStatusBar.update();

        const threshold: number = vscode.workspace.getConfiguration().get('threshold');

        const message = commentDensityStatusBar.getFeedback(percentage, threshold);

        vscode.window.showInformationMessage(message);
    });

    vscode.window.onDidChangeWindowState( () => {
        commentDensityStatusBar.update();
    });

    vscode.window.onDidChangeActiveTextEditor( () => {
        commentDensityStatusBar.update();
    });
    

}

// this method is called when your extension is deactivated
export function deactivate() {
    disposable.dispose();
}

class CommentDensityStatusBar {
    private statusBarItem: vscode.StatusBarItem;

    constructor() {
        this.statusBarItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Left,
            100,
        );

        this.statusBarItem.command = 'extension.calculate.comment.density';

        this.statusBarItem.show();
    }

    async update() {
        const path = vscode.window.activeTextEditor.document.fileName;

        try {
            const percentage = await this.calculate(path);

            this.statusBarItem.text = `Comment density ${Math.round(percentage)}%`;

            return percentage;
        } catch (e) {
            console.error('error...', e);
        }
    }

    private async calculate(path: string) {
        const result: string = await cloc(path, ['--json']);
        const parsedResult: CLOCResponse = JSON.parse(result);
        const densityOfComment = parsedResult.SUM.comment / parsedResult.SUM.code;
        

        return densityOfComment * 100;
    }

    public getFeedback(commentDensity: number, threshold: number): string {
        if ( commentDensity < threshold ) {
            return `Your comment density is under the threshold of ${threshold}% 😭 It's ${commentDensity.toFixed(1)}`;
        } else {
            return `Your comment density is above the threshold of ${threshold}% 🎉 It's ${commentDensity.toFixed(1)}`;
        }
    }
}
