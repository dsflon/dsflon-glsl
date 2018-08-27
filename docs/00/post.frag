precision highp float;

uniform float time;
uniform float slideTimer;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D texture;

varying vec2 vTexCoord;

void main(void) {

    gl_FragColor = texture2D(texture, vTexCoord);

}
