import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import Scene from "./Scene";

function ThreeViewer() {
  return (
    <div id="canvas-container" className="size-full bg-muted">
      <Canvas>
        <Scene />
        <Perf position="bottom-right" deepAnalyze={true} minimal={false} />
      </Canvas>
    </div>
  );
}

export default ThreeViewer;
