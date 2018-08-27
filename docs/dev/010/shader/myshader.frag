// based on: http://glslsandbox.com/e#14877.2

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float random (in vec2 st) {
    return fract(sin(dot(st.xy,vec2(12.9898,78.233)))
		 * 43758.5453123);
}

// The MIT License
// Copyright © 2013 Inigo Quilez
float n( in vec2 p )
{
    vec2 i = floor( p );
    vec2 f = fract( p );

    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( random( i + vec2(0.0,0.0) ),
                     random( i + vec2(1.0,0.0) ), u.x),
                mix( random( i + vec2(0.0,1.0) ),
                     random( i + vec2(1.0,1.0) ), u.x), u.y);
}

const float Pi = 3.14159;

void main( void ) {

	vec3 p = ( gl_FragCoord.yyx * 2. - resolution.xyy ) / min(resolution.x, resolution.y);
	// p *= 1.;
	float t = time;

	for(float i = 1.; i < 6.; i++) {
		vec3 np = p;
		np.x -= .5/i*cos(i*Pi*p.y-n(p.zx+t)-cos(i*t+i)*.1)+.1;
		np.y -= .5/i*sin(i*Pi*p.z-n(p.xy+t)+t)-.1;
		np.z -= .5/i*cos(i*Pi*p.x-n(p.yz+t)+t+i*.1)-.1;
		p = np;

		p += abs(p*p*i)/dot(p,p*i)*.5;
	}

	p = vec3(sin(p.x+p.y)*.5+.5, sin(p.y+p.z+6.)*.5+.5, sin(p.z+p.y+12.)*.5+.5);

	gl_FragColor = vec4( p*p, 1.0 );

}
