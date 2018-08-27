precision mediump float;
uniform sampler2D texture;   // フレームバッファに描画したレンダリング結果
uniform sampler2D textureUnit; // テクスチャユニット
uniform float     time;      // 時間の経過
varying vec2      vTexCoord; // テクスチャ座標

uniform vec2  resolution;

// ホワイトノイズを生成する乱数生成関数
float rnd(vec2 n){
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

void main(){

    vec2 p = (vec2(gl_FragCoord.x,gl_FragCoord.y) * 2.0 - resolution);

    float aspectX = 4.0;
    float aspectY = 3.0;

    if( resolution.x * aspectY / aspectX > resolution.y ) { // 上下左右フィット
        p /= max(resolution.x, resolution.y);
        p.y *= aspectX / aspectY;
    } else {
        if( resolution.x > resolution.y ) {
            p /= min(resolution.x, resolution.y);
            p.x *= aspectY / aspectX;
        } else {
            p /= max(resolution.x, resolution.y);
            p.x *= aspectY / aspectX;
        }
    }

    vec2 ajustCenter = (p / 2.0) + 0.5;
    vec2 destTex = ajustCenter;

    float s_rgb = sin(time*2.0);
          s_rgb += sin(time*3.0);
          s_rgb += sin(time*4.0);
          s_rgb += sin(time*9.0);

    float s_wave = sin(time*2.0);
          s_wave += sin(time*4.0);
          s_wave += sin(time*7.0);
          s_wave += sin(time*8.0);

    float maskLine = abs( p.y + mod(time*0.2, 2.0) - 1.0 );
          maskLine = 1.0 + step( maskLine, 0.001 );


    float timing_rgb = step(0.5, s_rgb * 0.5);
    float zure_rgb = ( sin(time*60.0) * cos(time*30.0) * (s_rgb) * 0.003 ) * timing_rgb;

    float timing_wave = step(0.75, s_wave * 0.5);
    float zure_wave = ( sin(time*60.0) * cos(time*30.0) * timing_wave );

    for(int i=1;i<6;i++) {
        float ii = float(i);
        destTex.x += ii * sin( ii * vTexCoord.y * 800.0 * zure_wave + (time * 0.25 * ii) ) * 0.002 * timing_wave;
    }

    // フレームバッファの描画結果をテクスチャから読み出す
    vec4 samplerColor = texture2D(textureUnit, vec2( destTex.x * maskLine, destTex.y ));

    float r = texture2D(textureUnit, (destTex) + zure_rgb ).r;
    float g = texture2D(textureUnit, (destTex) ).g;
    float b = texture2D(textureUnit, (destTex) - zure_rgb ).b;

    float dest = 1.0;

    // ホワイトノイズを生成 @@@
    float noise = rnd(p + mod(time, 2.0));
    dest *= noise * 0.5 + 0.7;;// マイルド化

    float scanLine = abs(sin(p.y * 400.0 + time * 5.0 ));
    dest *= scanLine * 0.5 + 0.9;// マイルド化

    gl_FragColor = dest * (samplerColor + vec4(r, g, b, 1.0)) * 0.5;

}
