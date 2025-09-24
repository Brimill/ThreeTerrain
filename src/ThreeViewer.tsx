import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import Scene from "./Scene";
import { ToggleGroup, ToggleGroupItem } from "./components/ui/toggle-group";
import { useState } from "react";
import Scene2 from "./Scene2";

function ThreeViewer() {
  const [showScene1, setShowScene1] = useState<boolean>(true);
  return (
    <>
      <div id="canvas-container" className="size-full bg-muted flex flex-col">
        <Canvas>
          {showScene1 ? <Scene /> : <Scene2 />}
          <Perf position="bottom-right" deepAnalyze={true} minimal={true} />
        </Canvas>
        <ToggleGroup
          variant="outline"
          type="single"
          defaultValue="scene1"
          value={showScene1 ? "scene1" : "scene2"}
          className={"self-center z-50 bg-white dark:bg-black"}
          onValueChange={(value) => {
            setShowScene1(value === "scene1");
          }}
        >
          <ToggleGroupItem value="scene1">Scene 1</ToggleGroupItem>
          <ToggleGroupItem value="scene2">Scene 2</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </>
  );
}

export default ThreeViewer;
