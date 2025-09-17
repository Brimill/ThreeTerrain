import { shaderMaterial } from "@react-three/drei";

export const GroundMaterial = shaderMaterial(
  { heightMap: { value: null }, useHeightMap: false },
  // vertex shader
  `
    uniform sampler2D heightMap;
    uniform bool useHeightMap;
    varying float vheight;

    void main(){
        vec4 heightData = texture2D(heightMap, uv);
        vec3 newPosition = position;
        if(useHeightMap){
          float height = heightData.r * 0.1;
          vheight = height;
          newPosition.z = height;
        }else{
          vheight = position.z;
        }
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }`,
  // fragment shader
  `
    varying float vheight;
  void main(){
    vec4 blue = vec4(0.0, 0.0, 1.0, 1.0);
    vec4 sand = vec4(0.76, 0.7, 0.5, 1.0);
    vec4 green = vec4(0.0, 1.0, 0.0, 1.0);
    vec4 brown = vec4(0.5, 0.35, 0.05, 1.0);
    vec4 gray  = vec4(0.5, 0.5, 0.5, 1.0);
    vec4 white = vec4(1.0, 1.0, 1.0, 1.0);

    vec4 color;

    if (vheight < 1.0) {
    color = blue;
    }else if (vheight < 10.0) {
      float t = vheight / 10.0;
      color = mix(sand, green, t);
    }else if (vheight < 20.0) {
      float t = (vheight - 10.0) / 10.0;
      color = mix(green, brown, t);
    }else if (vheight < 30.0) {
      float t = (vheight - 20.0) / 10.0;
      color = mix(brown, gray, t);
    }else{
      color = white;
    }
    gl_FragColor = color;
}`,
);
