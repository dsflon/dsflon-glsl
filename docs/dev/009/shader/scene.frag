precision mediump float;
uniform sampler2D textureUnit;   // フレームバッファに描画したレンダリング結果

varying vec2 vTexCoord; // 頂点シェーダから送られてきたテクスチャ座標

uniform float time;
uniform vec2 mouse; // マウスカーソル正規化済み座標 @@@
uniform vec2 resolution;
uniform vec2 imgSize;
uniform bool isSp;

uniform float range;
uniform bool mono;

const float dx = 0.001953125;
const float dy = 0.001953125;

vec2 fitPosition(vec2 tex, vec2 res, bool isSp) {

    vec2 p = (tex * res * 2.0) - res;
    float aspect = imgSize.y / imgSize.x;

    if( !isSp ) {

        if( res.x * aspect > res.y ) { // 上下左右フィット

            p /= max(res.x * aspect, res.y * aspect);

        } else {
            if( res.x > res.y ) {
                p /= min(res.x, res.y);
            } else {
                p /= max(res.x, res.y);
            }
        }
    } else {

        p /= max(res.x, res.y);
        p.x *= res.y / res.x * 0.95;

    }

    return (p / 2.0) + 0.5;

}

float peek(float x, float y){
    return texture2D(textureUnit, vec2(x, y)).r;
}

void main (){

    vec2 p = fitPosition(vec2(1.0-vTexCoord.x, vTexCoord.y), resolution, isSp);

    vec4 samplerColor = texture2D(textureUnit, p);
    float r = samplerColor.r;
    float g = samplerColor.g;
    float b = samplerColor.b;

    float dest = (r + g + b) / 1.0;
    dest *= range * 4.0;

    if( mono ) {
        samplerColor = vec4(1.0,1.0,1.0,1.0);
        dest = (r + g + b) / 2.0;
        dest *= dest * 3.0;
    } else {
        if( isSp ) samplerColor *= samplerColor;
    }

    float x = p.x;
    float y = p.y;

    /*
    **
    ** 輪郭検出　参考:http://marina.sys.wakayama-u.ac.jp/~tokoi/?date=20081208
    **
    */
    mat3 m = mat3(
        peek(x - dx, y - dy), peek(x, y - dy), peek(x + dx, y - dy),
        peek(x - dx, y     ), peek(x, y     ), peek(x + dx, y     ),
        peek(x - dx, y + dy), peek(x, y + dy), peek(x + dx, y + dy)
        );

    vec2 h = vec2(
        m[0][0] - m[0][2] + (m[1][0] - m[1][2]) * 2.0 + m[2][0] - m[2][2],
        m[0][0] - m[2][0] + (m[0][1] - m[2][1]) * 2.0 + m[0][2] - m[2][2]
        );

    // float d = 1.0 - length(h);
    float d = step(range, 1.0 - length(h)); //２値化
    /*
    ** 輪郭検出
    */

    gl_FragColor = samplerColor * vec4(dest,dest,dest,1.0) * vec4(vec3(d), 1.0);


}
