/**
 * XHR でシェーダのソースコードを外部ファイルから取得しコールバックを呼ぶ。
 * @param {string} vsPath - 頂点シェーダの記述されたファイルのパス
 * @param {string} fsPath - フラグメントシェーダの記述されたファイルのパス
 * @param {function} callback - コールバック関数（読み込んだソースコードを引数に与えて呼び出される）
 */
function LoadShaderSource(vsPath, fsPath, callback){

    this.vs = null;
    this.fs = null;
    this.callback = callback;
    
    this.xhr(vsPath, true);
    this.xhr(fsPath, false);

}


// LoadShaderSource.prototype.set = function(vsPath, fsPath, callback) {
//     this.vs = null;
//     this.fs = null;
//     this.callback = callback;
//
//     this.xhr(vsPath, true);
//     this.xhr(fsPath, false);
// }

LoadShaderSource.prototype.xhr = function(source, isVertex) {

    let xml = new XMLHttpRequest();

    xml.open('GET', source, true);
    xml.setRequestHeader('Pragma', 'no-cache');
    xml.setRequestHeader('Cache-Control', 'no-cache');

    xml.onload = () => {

        if(isVertex){
            this.vs = xml.responseText;
        }else{
            this.fs = xml.responseText;
        }
        if(this.vs != null && this.fs != null){
            this.callback({vs: this.vs, fs: this.fs});
        }
    };
    xml.onerror = () => {
        console.error("error");
    };

    xml.send();

}
