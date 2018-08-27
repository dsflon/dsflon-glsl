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

    vec4 samplerColor = texture2D(textureUnit, gl_PointCoord.st); // st は xyと同じ

    vec4 color = vec4( abs(sin(time)), vColor.g - 0.2, vColor.b - 0.2, 0.6 );
    gl_FragColor = color * samplerColor * globalColor;

}
