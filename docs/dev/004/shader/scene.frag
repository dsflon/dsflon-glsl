precision mediump float;
uniform sampler2D textureUnit;   // フレームバッファに描画したレンダリング結果

varying vec2 vTexCoord; // 頂点シェーダから送られてきたテクスチャ座標

uniform float time;
uniform vec2 mouse; // マウスカーソル正規化済み座標 @@@
uniform vec2 resolution;
uniform vec2 imgSize;
uniform bool isSp;

// ホワイトノイズを生成する乱数生成関数
float rnd(vec2 n){
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

const float Pi = 3.14159;

void main(){

    float aspect = imgSize.y / imgSize.x;

    vec2 p = (vec2(vTexCoord.x, vTexCoord.y) * resolution * 2.0) - resolution;
    // vec2 p = (vec2(1.0-vTexCoord.x, vTexCoord.y) * resolution * 2.0) - resolution;
    vec2 destTex = vec2(1.0,1.0);
    // vec2 destTex= vTexCoord;

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

    vec2 ajustCenter = (p / 2.0) + 0.5;

    vec4 samplerColor = texture2D(textureUnit, ajustCenter);

    float zure = 0.005;

    float r = texture2D(textureUnit, ajustCenter + zure ).r; // 中心に寄せたりする
    float g = texture2D(textureUnit, ajustCenter ).g; // 中心に寄せたりする
    float b = texture2D(textureUnit, ajustCenter - zure ).b; // 中心に寄せたりする

    // 簡単なモノクロ化 @@@
    float dest = (r + g + b) / 2.0;
    dest *= dest;
    dest *= 2.0;

    // ビネット（四隅が暗くなるような演出） @@@
    float vignette = 1.5 - length(p);
    dest *= vignette;

    // ホワイトノイズを生成 @@@
    float noise = rnd(gl_FragCoord.st + mod(time, 10.0));
    if( resolution.x > 640.0 ) {
        dest *= noise * 0.5 + 0.8;
    } else {
        dest *= noise + 0.5;
    }

    // // ブラウン管モニタのような走査線 @@@
    float scanLine = abs(sin(p.y * 200.0 + time * 5.0 ));
          scanLine += abs(sin(p.y * 5.0 + time ));
          scanLine = scanLine * 0.5 + 0.5;// マイルド化
    dest *= scanLine;

    gl_FragColor = vec4(r,g,b,1.0) * vec4(dest - 0.02, dest, dest, 1.0);

}
