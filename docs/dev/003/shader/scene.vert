attribute vec3 position;  // 頂点座標
attribute vec4 color;     // 頂点カラー
attribute vec2 texCoord;
uniform   mat4 mvpMatrix; // 座標変換行列

uniform vec2 mouse; // マウスカーソル正規化済み座標 @@@
uniform float time;      // 時間の経過
uniform float random;      // ランダム関数

varying vec4 vColor;    // フラグメントシェーダへ送る色

void main(){

    // テクスチャ座標（0.0 ~ 1.0）を変換して -1.0 ～ 1.0 にする @@@
    vec2 p = texCoord * 2.0 - 1.0;

    vColor = color;

    float size = 100.0 * abs( sin( time * length(p) ) );
    // float size = 20.0 * (sin0 + sin1 + sin2 + sin3 + sin4);
    // float size = 20.0;

    // vec3 _pos = vec3(position.x, position.y, position.z);
    vec3 _pos = position;

    gl_Position = mvpMatrix * vec4(_pos, 1.0);
    gl_PointSize = size / (gl_Position.w);

}
