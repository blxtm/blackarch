var vscode = require('vscode');
var encoding = require('encoding-japanese');// npm install encoding-japanese

function activate(context) {

	//console.log('Congratulations, your extension "encdetectjp" is now active!'); 

	var disposable = vscode.commands.registerCommand('extension.encdetectjp', function () {
		//console.log('window.activeTextEditor.document.languageId = ' + vscode.window.activeTextEditor.document.languageId);
		//console.log('workspace.files.encoding = ' + vscode.workspace.getConfiguration().get("files.encoding"));
	});
	
	//ファイルを開いたら実行
	vscode.workspace.onDidOpenTextDocument(function(e){
		var fname = e.fileName.replace(/\\/g,'/');
		if (fname.indexOf('/.vscode') > -1){
			return;
		}

		//workspaceデフォルトのエンコードを取得
		var defaultEncode = vscode.workspace.getConfiguration().get("files.encoding");// utf8 shiftjis eucjp

		//元ファイルを開いてエンコードを調べる
		var fs = require('fs');// npm install fs
		fs.readFile(fname, function (err, text) {
			if (text.length == 0){
				return;
			}
			var sourceEncode = encoding.detect(text);// UTF8 SJIS EUCJP ASCII
			if (!sourceEncode){
				return;
			}

			sourceEncode = sourceEncode.toLowerCase();//小文字に

			if (sourceEncode == 'sjis'){//シフトJISの表記を合わせる
				sourceEncode = 'shiftjis';
			}
			var mes = '';

			if (sourceEncode != defaultEncode && sourceEncode != 'ascii'){
				mes = "encoding not match!! reopen with [" + sourceEncode + "] " + fname;
				vscode.window.showWarningMessage(mes);
			}else{
				mes = "encoding match with workspace default(" + defaultEncode + "). [" + sourceEncode + "] " + e.fileName;
				vscode.window.setStatusBarMessage(mes,5000);
			}
		});
	});	
	context.subscriptions.push(disposable);
}
exports.activate = activate;
