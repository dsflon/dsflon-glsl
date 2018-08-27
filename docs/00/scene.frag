precision highp float;

uniform float area;
uniform float speed;

uniform vec2 resolution;
uniform float time;
uniform float startTime;
uniform float wheel;
uniform vec2 imgSize;
uniform sampler2D texture;
uniform sampler2D textureNext;
uniform sampler2D texturePrev;
uniform float showDetail;

uniform sampler2D textTexture;
uniform vec2 textImgSize;

varying vec2 vTexCoord;

const float Pi = 3.14159;


// フェードイン・アウト機能
/**
** t : 時間(進行度)
** b : 開始の値(開始時の座標やスケールなど)
** c : 開始と終了の値の差分
** d : Tween(トゥイーン)の合計時間
**/
float linear(float t, float b, float c, float d) {
    float t_ = t / d;
    return c * t_ + b;
}
float easeIn(float t, float b, float c, float d) {
    float t_ = t / d;
    return c * t_ * t_ + b;
}
float easeOut(float t, float b, float c, float d) {
    float t_ = t / d;
    t_ = t_ - 1.0;
    return -c * (t_ * t_ - 1.0) + b;
}
float easeInQuart(float t, float b, float c, float d) {
    float t_ = t / d;
    return c * t_ * t_ * t_ * t_ + b;
}
float easeOutQuart(float t, float b, float c, float d) {
    float t_ = t / d;
    t_ = t_ - 1.0;
    return -c * (t_ * t_ * t_ * t_ - 1.0) + b;
}
vec3 fadeWheel() {

    float nextTime = time - startTime;
    float opacity = easeOut( nextTime, 0.0, 1.0, speed );
    float num= (1.0 - opacity);
    float show = 0.0;

    if( wheel >= area && nextTime <= speed ) { // 下スクロール
        show = 1.0;
    } else if( wheel <= -area && nextTime <= speed ) { // 上スクロール
        show = 2.0;
    } else {
        opacity = 0.0;
        num = 1.0;
    }

    return vec3(opacity,num,show);
}
// フェードイン・アウト機能


void main(void) {

    vec2 ratio = vec2(
        min((resolution.x / resolution.y) / (imgSize.x / imgSize.y), 1.0),
        min((resolution.y / resolution.x) / (imgSize.y / imgSize.x), 1.0)
    );
    vec2 uv = vec2(
        vTexCoord.x * ratio.x + (1.0 - ratio.x) * 0.5,
        vTexCoord.y * ratio.y + (1.0 - ratio.y) * 0.5
    );

    ////
    vec2 textRatio = vec2(
        min((resolution.x / resolution.y) / (textImgSize.x / textImgSize.y), 1.0),
        min((resolution.y / resolution.x) / (textImgSize.y / textImgSize.x), 1.0)
    );
    vec2 textUv = vec2(
        vTexCoord.x * textRatio.x + (1.0 - textRatio.x) * 0.5,
        vTexCoord.y * textRatio.y + (1.0 - textRatio.y) * 0.5
    );
    ////

    vec2 destTex = uv;
    vec2 destTexNext = uv;
    vec2 destTexPrev = uv;
    vec2 destTexText = textUv;

    destTexNext.y += 1.0;
    destTexPrev.y -= 1.0;

    float opacity = fadeWheel().x;
    float num = fadeWheel().y;
    float show = fadeWheel().z;


    for(int i=1;i<6;i++) {

        float ii = float(i);

        destTex.y += ii * sin( ii * uv.x * 10.0 + (wheel*ii * (1.0+opacity*2.0) ) ) * 0.05 * wheel * 0.5 * num;
        destTex.y += ii * sin( ii * uv.x * 20.0 + (wheel*ii * (1.0+opacity*2.0) ) ) * 0.05 * wheel * 0.5 * num;

        destTexNext.y += ii * sin( ii * uv.x * 10.0 + (wheel*ii * (1.0+opacity*2.0) ) ) * 0.05 * wheel * 0.5 * num;
        destTexNext.y += ii * sin( ii * uv.x * 20.0 + (wheel*ii * (1.0+opacity*2.0) ) ) * 0.05 * wheel * 0.5 * num;

        destTexPrev.y += ii * sin( ii * uv.x * 10.0 + (wheel*ii * (1.0+opacity*2.0) ) ) * 0.05 * wheel * 0.5 * num;
        destTexPrev.y += ii * sin( ii * uv.x * 20.0 + (wheel*ii * (1.0+opacity*2.0) ) ) * 0.05 * wheel * 0.5 * num;

        destTexText.x += ii * sin( textUv.x * 200.0 + (wheel * ii * opacity ) ) * 0.001 * opacity;

    }

    destTex.y += wheel;
    destTexNext.y += wheel;
    destTexPrev.y += wheel;

    if( show == 1.0 ) { // 上スクロール
        destTex.y += opacity * area;
        destTexPrev.y += opacity * area;
    } else if( show == 2.0 ) { // 下スクロール
        destTex.y -= opacity * area;
        destTexNext.y -= opacity * area;
    }

    vec4 samplerColor = texture2D(texture, destTex);
    vec4 samplerColorNext = texture2D(textureNext, destTexNext);
    vec4 samplerColorPrev = texture2D(texturePrev, destTexPrev);

    vec4 samplerColorText = texture2D(textTexture, destTexText);


    float opacityNext = 0.0;
    float opacityPrev = 0.0;

    if( wheel < 0.0 ) { // 下にスクロール

        // samplerColor *= 1.0 - smoothstep(0.0,-0.01,destTex.y);//波々の境目を黒にする
        samplerColor *= step(0.0,destTex.y);//波々の境目を黒にする
        opacityNext = abs( pow(wheel / area, 1.0) );

    } else { // 上にスクロール

        // samplerColor *= smoothstep(1.01,1.0,destTex.y);//波々の境目を黒にする
        samplerColor *= 1.0 - step(1.0,destTex.y);//波々の境目を黒にする
        opacityPrev = abs( pow(wheel / area, 1.0) );

    }
    // samplerColorNext *= smoothstep(1.01,1.0,destTexNext.y);//波々の境目を黒にする
    // samplerColorPrev *= 1.0 - smoothstep(0.0,-0.01,destTexPrev.y);//波々の境目を黒にする
    samplerColorNext *= step(destTexNext.y,1.0);//波々の境目を黒にする
    samplerColorPrev *= step(0.0,destTexPrev.y);//波々の境目を黒にする


    float fix = 1.0;
    float opacityText = 0.0;

    if( (wheel >= area || wheel <= -area) && showDetail == 1.0 ) {

        fix -= easeInQuart( time - startTime, 0.0, 1.0, 0.5 );
        fix = max(0.0,fix);

    }

    if( show == 1.0 || show == 2.0 || showDetail == 1.0 ) {

        if( resolution.x >= 640.0 ) opacityText = num;

    }


    gl_FragColor = samplerColor * fix;
    gl_FragColor += samplerColorNext * opacityNext * ( 1.0 - showDetail );
    gl_FragColor += samplerColorPrev * opacityPrev * ( 1.0 - showDetail );
    gl_FragColor *= 0.5;

    gl_FragColor += samplerColorText * opacityText * ( 1.0 - showDetail );

}
