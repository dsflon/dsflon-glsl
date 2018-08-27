precision mediump float;
uniform sampler2D textureUnit;   // フレームバッファに描画したレンダリング結果

varying vec2 vTexCoord; // 頂点シェーダから送られてきたテクスチャ座標

uniform float time;
uniform vec2 mouse; // マウスカーソル正規化済み座標 @@@
uniform vec2 resolution;
uniform vec2 imgSize;
uniform bool isSp;

uniform vec2 deviceorientation;

const float Pi = 3.14159;

void main(){

    float aspect = imgSize.y / imgSize.x;
    // vec2 jyro = normalize(deviceorientation);
    // vec2 jyro = (deviceorientation);

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

    float len = length(p - vec2(mouse.x,mouse.y)) * 0.1;
    vec2 move = vec2(mouse.x*0.01,mouse.y * 0.01);

    if( isSp ) {
        len = (0.5 - length(deviceorientation)) * 0.8;
        move = deviceorientation * 0.1;
    }

    for(int i=1;i<14;i++)
    {
        float ii = float(i);

        destTex.x += len * ii * sin( ii * Pi * vTexCoord.y * 15.0 + (time * 0.25 * ii) ) * 0.002;
        destTex.x += len * ii * sin( ii * Pi * vTexCoord.y * 15.0 + (time * 0.25 * ii) ) * 0.002;
        destTex.x += len * ii * sin( ii * Pi * vTexCoord.y * 15.0 + (time * 0.25 * ii) ) * 0.004;

        destTex.y += len * ii * cos( ii * Pi * vTexCoord.x * 30.0 + (time * 0.25 * ii) ) * 0.002;
        destTex.y += len * ii * cos( ii * Pi * vTexCoord.x * 30.0 + (time * 0.25 * ii) ) * 0.002;
        destTex.y += len * ii * cos( ii * Pi * vTexCoord.x * 30.0 + (time * 0.25 * ii) ) * 0.004;
    }

    // vec2 ajustCenter = p;
    vec2 ajustCenter = (p / 2.0) + 0.5;

    // vec4 samplerColor = texture2D(textureUnit, ajustCenter);
    vec4 samplerColor = texture2D(textureUnit, (ajustCenter * destTex) + move);
    float r = samplerColor.r;
    float g = samplerColor.g;
    float b = samplerColor.b;

    float dest = (r + g + b) / ( 1.7 + abs( sin(time * 0.5) * cos(time * 0.2) ) );
    dest *= dest;
    // dest *= dest / 2.0;
    //
    // float scanLine = abs(sin(p.y * 300.0 + time * 6.0 ));
    //       scanLine = scanLine * 0.5 + 0.9;// マイルド化
    // dest *= scanLine;

    // gl_FragColor = vec4(dest,dest,dest,1.0) * vec4(cos(destTex.x+destTex.y+3.+time)*.5+.5, sin(destTex.x+destTex.y+6.+time)*.5+.5, (sin(destTex.x+destTex.y+9.+time)+cos(destTex.x+destTex.y+12.+time))*.25+.5, .8);
    gl_FragColor = vec4(dest,dest,dest,1.0) * vec4(r,g,b,1.0);

}
