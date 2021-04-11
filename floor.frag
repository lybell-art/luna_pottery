precision mediump float;

uniform vec2 uResolution;
uniform float uTime;
uniform vec4 inCol;

out vec4 outColor;

vec4 screenBlend(vec4 a, vec4 b)
{
	return 1.0-(1.0-a)*(1.0-b);
}

void main()
{
	vec2 uv = gl_FragCoord.xy/uResolution;
	float fractTime = fract(uTime/2.0);
	float dist = max(abs(uv.x-0.5),abs(uv.y-0.5));
//	vec4 inCol = vec4(0.737,0.807,0.674, 1.0);
	float distTime = abs(dist - fractTime);
	float tempCol = (distTime < 0.02) ? ((distTime*50.0)*(distTime*50.0))/2.0+0.5) : 1.0;
	tempCol = 1.0 - (1.0 - tempCol) * (1.0-abs(dist+0.5));
	vec4 outCol=vec4(tempCol,tempCol,tempCol,1.0);
	outColor=screenBlend(inCol*0.7, outCol);
}
