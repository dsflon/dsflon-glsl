attribute vec3 position;  // 頂点座標
attribute vec4 color;     // 頂点カラー
attribute vec2 texCoord;     // 頂点カラー
uniform   mat4 mvpMatrix; // 座標変換行列

uniform   vec2 mouse; // マウスカーソル正規化済み座標 @@@
uniform   float time;      // 時間の経過

varying   vec4 vColor;    // フラグメントシェーダへ送る色

void main(){

    // テクスチャ座標（0.0 ~ 1.0）を変換して -1.0 ～ 1.0 にする @@@
    vec2 p = texCoord * 2.0 - 1.0;
    vec2 _p = position.xy * 2.0 - 1.0;

    // 色はそのままフラグメントシェーダへ
    vColor = color;
    // 頂点の座標は行列を使って変換する
    // gl_Position = vec4(position, 1.0);

    // float len = length(p - mouse);
    float len = length(p - mouse) - distance(vec2(1.0,1.0),vec2(-1.0,-1.0));
    float size = 5.0 - (length(p - mouse) * 3.0);
    if( size < 1.0 ) { // これしておかないとIOSでバグる（値がマイナスになるとだめ）
        size = 1.0;
    }
    // float size = 2.0;

    // float dist = length(mouse * 2.0 - 1.0);
    // float dist = length(position.xy) * 10.0;
    float dist = len * 12.0;
    float s = (sin( dist - (time * 2.0) )) * 0.05;
    float c = (cos( dist - (time * 2.0) )) * 0.05;

    float pos = ( len * (s+c) );
    vec3 _pos = vec3(position.x, position.y, pos);

    // gl_Position は常に -1.0 ~ 1.0 （OpenGL, webGL）
    gl_Position = mvpMatrix * vec4(_pos, 1.0);
    gl_PointSize = size;
}
