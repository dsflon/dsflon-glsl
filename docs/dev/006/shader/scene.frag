precision mediump float;
uniform sampler2D textureUnit;   // フレームバッファに描画したレンダリング結果

varying vec2 vTexCoord; // 頂点シェーダから送られてきたテクスチャ座標

uniform   float time;
uniform   vec2 mouse; // マウスカーソル正規化済み座標 @@@
uniform vec2 resolution;
uniform vec2 imgSize;

const float Pi = 3.14159;


void main(){

    float aspect = imgSize.y / imgSize.x;

    vec2 p = (vTexCoord * resolution * 2.0) - resolution;
    vec2 dist = vec2(1.0,1.0);

    if( resolution.x * aspect > resolution.y ) { // 上下左右フィット

        p /= max(resolution.x * aspect, resolution.y * aspect);

    } else {
        if( resolution.x > resolution.y ) {
            p /= min(resolution.x, resolution.y);
        } else {
            p /= max(resolution.x, resolution.y);
        }
    }

    vec2 ajustCenter = (p / 2.0) + 0.5;

    vec2 mouse_ = mouse;


    // vec2 p = (1.0 * texCoord);
    float len = length(p - mouse_ );
          len = len * 0.05;

    for( int i = 1; i < 6; i++ ) {

        float ii = float(i);

        dist.x += 1.0 / sin( len * p.x * 100.0 + time * 0.5 ) * 0.005;
        dist.x += 1.0 / sin( len * p.x * 300.0 + time * 1.5 ) * 0.005;
        dist.x += 1.0 / sin( len * p.y * 200.0 + time * 0.5 ) * 0.005;
        dist.y += cos( len * p.y * 100.0 + time * 0.5 ) * 0.005;

    }

    vec4 samplerColor = texture2D(textureUnit, ajustCenter * dist);

    gl_FragColor = samplerColor;

}
