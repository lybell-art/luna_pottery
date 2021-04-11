#version 400

precision mediump float;

uniform vec2 uResolution;
uniform float uTime;
uniform vec4 inCol;

vec2 hash( vec2 p ) {
	p = vec2( dot(p,vec2(127.1,311.7)),
			  dot(p,vec2(269.5,183.3)) );

	return -1.0 + 2.0*fract(sin(p) * 43758.5453123);
}
float noise( in vec2 p ) {
    const float K1 = 0.366025404; // (sqrt(3)-1)/2;
    const float K2 = 0.211324865; // (3-sqrt(3))/6;

	vec2 i = floor( p + (p.x+p.y) * K1 );

    vec2 a = p - i + (i.x+i.y) * K2;
    vec2 o = step(a.yx,a.xy);
    vec2 b = a - o + K2;
	vec2 c = a - 1.0 + 2.0*K2;

    vec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );

	vec3 n = h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));

    return dot( n, vec3(70.0) );
}
float fbm ( in vec2 p ) {
	float f = 0.0;
	mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );
	f  = 0.5000*noise(p); p = m*p;
	f += 0.2500*noise(p); p = m*p;
	f += 0.1250*noise(p); p = m*p;
	f += 0.0625*noise(p); p = m*p;
	f = 0.5 + 0.5 * f;
	return f;
}

vec4 screenBlend(vec4 a, vec4 b)
{
	return 1.0-(1.0-a)*(1.0-b);
}

void main()
{
	vec2 uv = gl_FragCoord.xy/uResolution;
	float tt = uTime * 0.01;

	//generate mountains
	float mountain[4];
	for(int i=0;i<4;i++)
	{
		float iF=float(i);
		mountain[i]=1.0-fbm(vec2((uv.x+tt*(iF+1.0))*(1.0+0.5*iF), iF*10.0))*(0.5+(0.1*iF))-(0.1*iF)+0.05;
	}
	vec4 col[4] = vec4[4](vec4(0.9,0.9,0.9, 1.0),
	vec4(0.7,0.7,0.7, 1.0),
	vec4(0.5,0.5,0.5, 1.0),
	vec4(0.3,0.3,0.3, 1.0));
	vec4 outCol[4];
//	vec4 inCol = vec4(0.737,0.807,0.674, 1.0);
	const vec4 white = vec4(1.0,1.0,1.0, 1.0);

	//mix color gradation
	for(int i=0;i<4;i++)
	{
		outCol[i]=mix(col[i], white, (mountain[i] > uv.y) ? (mountain[i]-uv.y)*3.0 : 1.0);
	}
	vec4 tempCol = outCol[0] * outCol[1] * outCol[2] * outCol[3];

	//color tint   
	gl_FragColor = screenBlend(inCol*0.7, tempCol);
}
