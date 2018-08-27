precision mediump float;
uniform sampler2D textureUnit;   // フレームバッファに描画したレンダリング結果

varying vec2 vTexCoord; // 頂点シェーダから送られてきたテクスチャ座標

uniform float time;
uniform float slideTimer;
uniform vec2 mouse; // マウスカーソル正規化済み座標 @@@
uniform vec2 mousePrev; // マウスカーソル正規化済み座標 @@@
uniform vec2 resolution;
uniform vec2 imgSize;
uniform bool isSp;

uniform vec2 deviceorientation;

#define MAX_ITER 3

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
        // p.x *= res.y / res.x * 0.95;

    };

    return p;

}

float easeInQuart(float t, float b, float c, float d) {
    float t_ = t / d;
    return c*t_ * t_ * t_ * t_ + b;
}

float easeOutQuart(float t, float b, float c, float d) {
    float t_ = t / d;
    t_ = t_ - 1.0;
    return -c * (t_ * t_ * t_ * t_ - 1.0) + b;
}


void main(){

    vec2 p_ = fitPosition(vTexCoord, resolution, isSp);
    vec2 ajustCenter = (p_ / 2.0) + 0.5;

    float len = length(p_ - mouse);
    if( isSp ) len = length(p_ - deviceorientation) * 4.0;

    vec2 destTex = vec2(1.0,1.0);
    float destTex2 = 1.0;
    float destTex3 = 1.0;

    vec2 p  = p_ * 8.0 - vec2(20.0);
    vec2 i = p;
    float c = 1.0;
    float inten = .02;


    // フェードイン・アウト機能
    float nextTime = mod(time+1.0,slideTimer);
    float opacity = 0.0;
    float num = 1.0;

    if( 0.05 < nextTime && nextTime < 1.05 ) {
        opacity = easeOutQuart( nextTime, 0.0, 1.0, 1.0 );
        num += (1.0 - opacity);
    }
    else if( 1.05 <= nextTime && nextTime < slideTimer - 1.0 ) {
        opacity = 1.0;
    }
    else if( slideTimer - 1.0 <= nextTime && nextTime < slideTimer ) {
        opacity = easeInQuart( slideTimer - nextTime, 0.0, 1.0, 1.0 );
        num += (1.0 - opacity);
    }
    // フェードイン・アウト機能


    // 光のゆらぎ
    for (int n = 1; n < MAX_ITER; n++) {
        float t = (time * 0.5) * (2.0 - (3.0 / float(n))) + len;
        float t2 = (time * 0.1) + len;

        if( isSp ) {
            t = len;
            t2 = len;
        }

        i = p + vec2( cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x)) * num;

        c += 1.0 / length( vec2(p.x / (sin(i.x+t)/inten), p.y / (cos(i.y+t)/inten)) );

        destTex2 += (len*0.75) * length( vec2( (sin(i.x+t2)/inten), (cos(i.y+t2)/inten) ) ) * 0.0005 * pow(num,1.0);
        destTex3 += (len*0.75) * length( vec2( (sin(i.x+t2)/inten), (cos(i.y+t2)/inten) ) ) * 0.0002 * pow(num,1.0);
    }

    c /= float(MAX_ITER);
    c = 1.5 - sqrt(c);

    vec4 texColor = vec4(0.2, 0.2, 0.2, 1.);
    texColor.rgb *= (1.0/ (1.0 - (c + 0.05))) + (1.0-len*0.2);
    // if( isSp ) texColor = vec4(1.0);
    // 光のゆらぎ


    vec4 samplerColor = texture2D(textureUnit, ajustCenter * destTex3);
    vec4 samplerColor_ = texture2D(textureUnit, ajustCenter * destTex2);
    float r = samplerColor_.r;
    float g = samplerColor_.g;
    float b = samplerColor_.b;

    float mono = (r + g + b) / 1.2;
          // mono *= mono;

    gl_FragColor = vec4(mono,mono,mono,1.0) * samplerColor * texColor * opacity;

}
