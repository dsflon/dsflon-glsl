attribute vec3 position;  // 頂点座標
attribute vec4 color;     // 頂点カラー
attribute vec2 texCoord;
uniform   mat4 mvpMatrix; // 座標変換行列

uniform vec2 mouse; // マウスカーソル正規化済み座標 @@@
uniform float time;      // 時間の経過
uniform float random;      // ランダム関数

varying vec4 vColor;    // フラグメントシェーダへ送る色

void main(){

    // 時間の経過と sin を利用して係数を作る @@@
    float s = abs(sin(time));

    // テクスチャ座標（0.0 ~ 1.0）を変換して -1.0 ～ 1.0 にする @@@
    vec2 p = texCoord * 2.0 - 1.0;

    vColor = color;

	// float sin0 = sin(length(p) *  1.0 + time / 2.0);
	// float sin1 = sin(length(p) *  2.0 + time / 2.0);
	// float sin2 = sin(length(p) * 3.0 + time / 2.0);
	// float sin3 = sin(length(p) * 4.0 + time / 2.0);
	// float sin4 = sin(length(p) * 5.0 + time / 2.0);

    // float light = 0.02 / abs(p.y + sin0 + sin1 + sin2 + sin3 + sin4);

    float size = 100.0 * abs( sin( length(p) + time * length(p) ) );
    // float size = 40.0;

    // vec3 _pos = vec3(position.x, position.y, position.z);
    vec3 _pos = position;

    gl_Position = mvpMatrix * vec4(_pos, 1.0);
    gl_PointSize = size / (gl_Position.w);

}
