attribute vec3 position; //頂点座標
attribute vec2 uv; //テクスチャを貼るためのUV座標

varying vec2 vTexCoord;

void main(void) {
    vTexCoord = uv;
    gl_Position = vec4(position, 1.0);
}
