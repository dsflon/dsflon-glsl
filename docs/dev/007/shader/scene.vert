attribute vec3 position;
attribute vec2 texCoord;
uniform   mat4 mvpMatrix;
varying   vec2 vTexCoord;

void main(){

    // gl_Position = mvpMatrix * vec4(position, 1.0);
    gl_Position = vec4(position, 1.0);
    //
    // vec2 p = (1.0 * texCoord);
    // float len = length(p-mouse);
    //
    // float dist = len*2.0;
    //
    // for( int i = 2; i < 10; i++ ) {
    //
    //     float ii = float(i);
    //
    //     p.x += sin( dist + p.x * 10.0 + time * 0.5 ) * 0.001;
    //     p.x += sin( dist + p.x * 30.0 + time * 1.5 ) * 0.001;
    //     p.x += sin( dist + p.y * 200.0 + time ) * 0.001;
    //     p.y += cos( dist + p.x * 20.0 + time ) * 0.001;
    //
    // }

    vTexCoord = texCoord;
    // vTexCoord = vec2( cos(p.x+p.y+13.)*.5+.5, sin(p.x*1.3+p.y*0.12+6.)*.5+.5 );
    // vTexCoord = vec2( (p.x), (p.y) );

}
