function LoadFont(callback,fontFamily) {

    var tester = document.createElement("span");
    tester.style.fontFamily = "'" + fontFamily + "', 'monospace'";
    tester.innerHTML = 'QW@HhsXJ';
    document.body.appendChild(tester);

    var beforeWidth = tester.offsetWidth;
    var count = 0;

    (function() {
        if (count > 20 || (count > 10 && tester.offsetWidth !== beforeWidth)) {
            document.body.removeChild(tester);
            callback();
        } else {
            count++;
            setTimeout(arguments.callee, 100);
        }
    })();

}
window.LoadFont = LoadFont;


function CreateText(text,fontSize,fontFamily) {

    var textList = text.split('\n');

    var canvas = document.createElement('canvas');
    canvas.width = fontSize * text.length;
    canvas.height = fontSize * textList.length;

    var context = canvas.getContext("2d");
    context.font = fontSize + 'px "' + fontFamily + '"';
    context.fillStyle = '#ffffff';
    context.textAlign = 'left';
    context.textBaseline = "middle";

    let lineHeight;
    for (var i = 0; i < textList.length; i++) {
        context.fillText(textList[i], 0, (fontSize / 2) + (fontSize*i));
        lineHeight = fontSize * i;
    }

    return {
        context: context,
        lineHeight: lineHeight
    };

}
window.CreateText = CreateText;
