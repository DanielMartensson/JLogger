#ifdef GL_ES
#extension GL_OES_standard_derivatives : enable
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
precision highp int;
#else
precision mediump float;
precision mediump int;
#endif
#else
#define highp
#define mediump
#define lowp
#endif
varying vec2 texCoord0;
varying vec2 texCoord1;
varying lowp vec4 perVertexColor;
uniform vec4 jsl_pixCoordOffset;
uniform vec2 oinvarcradii;
lowp float mask(vec2 tco, vec2 oflatdim) {
vec2 absecctco = max(abs(tco) - oflatdim, 0.001) * oinvarcradii;
float ecclensq = dot(absecctco, absecctco);
float pix = dot(absecctco / ecclensq, oinvarcradii);
return clamp(0.5 + (1.0 + 0.25 * pix * pix - ecclensq) / (2.0 * pix), 0.0, 1.0);
}
uniform sampler2D inputTex;
uniform vec4 xParams;
uniform vec4 yParams;
uniform vec3 perspVec;
uniform vec4 content;
lowp vec4 paint(vec2 winCoord) {
vec3 fragCoord = vec3(winCoord.x, winCoord.y, 1.0);
float wParam = dot(fragCoord, perspVec);
vec2 texCoord = vec2(dot(xParams.xyz, fragCoord) / wParam + xParams.w, dot(yParams.xyz, fragCoord) / wParam + yParams.w);
texCoord = fract(texCoord);
texCoord = vec2(content.x, content.y) + texCoord * vec2(content.z, content.w);
return texture2D(inputTex, texCoord);
}
void main() {vec2 pixcoord = vec2(
    gl_FragCoord.x-jsl_pixCoordOffset.x,
    ((jsl_pixCoordOffset.z-gl_FragCoord.y)*jsl_pixCoordOffset.w)-jsl_pixCoordOffset.y);

gl_FragColor = mask(texCoord0, texCoord1) * paint(pixcoord) * perVertexColor;
}
