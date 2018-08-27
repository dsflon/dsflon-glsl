precision mediump float;
uniform sampler2D texture;   // フレームバッファに描画したレンダリング結果
uniform float     time;      // 時間の経過
varying vec2      vTexCoord; // テクスチャ座標

uniform vec2 resolution;

// ホワイトノイズを生成する乱数生成関数
float rnd(vec2 n){
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

void main(){

    // vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    // vec2 ajustCenter = (p / 2.0) + 0.5;

    // ホワイトノイズを生成
    float n = rnd(gl_FragCoord.st + mod(time, 10.0));//mod: time を 10.0で割った余り

    // n == 0.0 ~ 0.999999...
    // を 0.8 ~ 1.0 似くらいにするとマイルドになる
    n = n * 0.5 + 0.8;

    // フレームバッファの描画結果をテクスチャから読み出す
    vec4 samplerColor = texture2D(texture, vTexCoord);
    // vec4 samplerColor = texture2D(texture, ajustCenter);

    // ホワイトノイズを乗算して出力する
    // gl_FragColor = samplerColor * vec4(vec3(n), 1.0);
    gl_FragColor = samplerColor;
}
