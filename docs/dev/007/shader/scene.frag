precision mediump float;
uniform sampler2D textureUnit;   // フレームバッファに描画したレンダリング結果

varying vec2 vTexCoord; // 頂点シェーダから送られてきたテクスチャ座標

uniform float time;
uniform vec2 mouse; // マウスカーソル正規化済み座標 @@@
uniform vec2 resolution;
uniform vec2 imgSize;
uniform bool isSp;

const float Pi = 3.14159;
const   vec4      greenColor = vec4(0.2, 1.0, 0.5, 1.0);

// ホワイトノイズを生成する乱数生成関数
float rnd(vec2 n){
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

void main(){

    float aspect = imgSize.y / imgSize.x;

    vec2 p = (vec2(1.0-vTexCoord.x, vTexCoord.y) * resolution * 2.0) - resolution;
    vec2 destTex = vec2(1.0,1.0);

    if( !isSp ) {

        if( resolution.x * aspect > resolution.y ) { // 上下左右フィット

            p /= max(resolution.x * aspect, resolution.y * aspect);

        } else {
            if( resolution.x > resolution.y ) {
                p /= min(resolution.x, resolution.y);
            } else {
                p /= max(resolution.x, resolution.y);
            }
        }
    } else {

        p /= max(resolution.x, resolution.y);
        p.x *= resolution.y / resolution.x;

    }

    float len = length(p - vec2(-mouse.x,mouse.y));
          len = len * 0.02;

    for( int i = 1; i < 10; i++ ) {

        float ii = float(i);

        destTex.x += 1.0 / sin( len * p.x * 100.0 + time * 0.1 ) * 0.005;
        destTex.x += 1.0 / sin( len * p.x * 300.0 + time * 0.3 ) * 0.005;
        destTex.x += 1.0 / sin( len * p.y * 200.0 + time * 0.2 ) * 0.005;
        destTex.y += cos( len * p.y * 100.0 + time * 0.2 ) * 0.005;

    }

    // vec2 ajustCenter = p;
    vec2 ajustCenter = (p / 2.0) + 0.5;

    // vec4 samplerColor = texture2D(textureUnit, ajustCenter);
    vec4 samplerColor = texture2D(textureUnit, ajustCenter * destTex);
    float r = samplerColor.r;
    float g = samplerColor.g;
    float b = samplerColor.b;

    float dest = (r + g + b) / 2.0;
    dest *= dest;
    dest *= dest / 2.0;
    dest *= destTex.x;

    float scanLine = abs(sin(p.y * 300.0 + time * 5.0 ));
          scanLine = scanLine * 0.5 + 0.9;// マイルド化
    dest *= scanLine;

    // float vignette = 1.7 - length(p);
    // dest *= vignette;

    // gl_FragColor = samplerColor * vec4(dest-0.02,dest,dest+0.02, 1.0);
    gl_FragColor = vec4(dest,dest,dest,1.0);

}
