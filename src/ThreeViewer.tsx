import { Canvas } from "@react-three/fiber";
import Scene from "./Scene";

function ThreeViewer() {
  return (
    <div id="canvas-container" className="size-full bg-muted">
      <Canvas>
        <Scene />
      </Canvas>
    </div>
  );
}

export default ThreeViewer;
