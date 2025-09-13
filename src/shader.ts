import { shaderMaterial } from "@react-three/drei";

export const GroundMaterial = shaderMaterial(
  {},
  // vertex shader
  `
    varying float vheight;
    void main(){
        vheight = position.z;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
  // fragment shader
  `
    varying float vheight;
  void main(){
    if (vheight < 0.2) {
      gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
      return;
    }else if (vheight < 10.0) {
      gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
      return;
    }else if (vheight < 20.0) {
      gl_FragColor = vec4(0.5, 0.35, 0.05, 1.0);
      return;
    }else if (vheight < 30.0) {
      gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0);
      return;
    }
}`,
);
