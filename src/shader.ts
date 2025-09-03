import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";

export const GroundMaterial = shaderMaterial(
  {},
  // vertex shader
  `
    varying vec2 vUv;
    void main(){
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
  // fragment shader
  `void main(){
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}`,
);
