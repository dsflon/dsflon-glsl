attribute vec3 position;  // 頂点座標
attribute vec4 color;     // 頂点カラー
attribute vec2 texCoord;
uniform   mat4 mvpMatrix; // 座標変換行列

uniform vec2 mouse; // マウスカーソル正規化済み座標 @@@
uniform float time;      // 時間の経過

varying vec4 vColor;    // フラグメントシェーダへ送る色

void main(){

    // テクスチャ座標（0.0 ~ 1.0）を変換して -1.0 ～ 1.0 にする @@@
    vec2 p = texCoord * 2.0 - 1.0;

    vColor = color;

    float size = 30.0 * abs( sin( time + ( texCoord.x ) ) );

    // vec2 pos_ = 1.0 + vec2(position.x, position.y) * sin( time ) * 0.5;
    float x =  position.x + ( sin( position.y * time * 10.0 * (texCoord.y) ) * 0.01 );
    float y =  position.y + ( cos( position.x * time * 10.0 * (texCoord.y) ) * 0.01 );

    gl_Position = mvpMatrix * vec4( x, y, position.z, 1.0);
    // gl_PointSize = size / (gl_Position.w);
    gl_PointSize = size / (gl_Position.w);

}
