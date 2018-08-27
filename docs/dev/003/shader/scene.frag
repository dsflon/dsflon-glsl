precision highp float;
uniform float time;         // 時間の経過 @@@
uniform vec4 globalColor; // グローバルカラー
uniform sampler2D textureUnit; // テクスチャユニット
varying vec4 vColor;      // 頂点シェーダから送られてきた色

vec3 hsv(float h, float s, float v){

	vec4 t = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
	vec3 p = abs(fract(vec3(h) + t.xyz) * 6.0 - vec3(t.w));

	return v * mix(vec3(t.x), clamp(p - vec3(t.x), 0.0, 1.0), s);

}

void main(){

    // vec4 color = vec4( vColor.r, vColor.g, vColor.b, sin(time) );
    // vec4 color = vec4( vColor.r, vColor.g, vColor.b, 0.1 );

    // 色同士を掛け合わせて出力

    // テクスチャから色を読み出し利用する @@@
    // gl_PointCoord 点の矩形の中のテクスチャ座標
    vec4 samplerColor = texture2D(textureUnit, gl_PointCoord.st); // st は xyと同じ

    // vec3 color_hsv = hsv(sin(time/4.0), 0.6, 0.8);
    // gl_FragColor = vec4(color_hsv, 1.0) * samplerColor * globalColor;
    // gl_FragColor = vColor * samplerColor * globalColor;

    vec4 color = vec4( abs(sin(time)), vColor.g, vColor.b, 1.0 );
    gl_FragColor = color * samplerColor * globalColor;

}
