import { useThree, useFrame } from "@react-three/fiber";
import Ground from "@/components/three/Ground";
import { PerspectiveCamera as PerspectiveCameraType, Vector3 } from "three";
import { PerspectiveCamera } from "@react-three/drei";
import { useAppStore } from "@/stores.ts";
import { useEffect, useMemo, useRef } from "react";
import { useControls } from "leva";
import GroundCPU from "@/components/three/GroundCPU";
import GroundPlane from "./GroundPlane";
import { type SceneProps } from "./Scene";

function Scene2({ terrainGenerator }: SceneProps) {
  const { camera, size: viewportSize } = useThree();
  const { useGPU } = useControls(
    "Settings",
    { useGPU: true },
    { collapsed: true },
  );
  const size: number = useAppStore((state) => state.size);
  const cameraRef = useRef<PerspectiveCameraType>(null);
  const cameraHeight = size * 4;

  useEffect(() => {
    if (!cameraRef.current) return;
    cameraRef.current.aspect = viewportSize.width / viewportSize.height;
    cameraRef.current.up.set(0, 0, 1); // Set Z as up direction
    cameraRef.current.updateProjectionMatrix();
  }, [viewportSize, camera]);

  useEffect(() => {
    console.log("useEffect: size or cameraHeight changed", size, cameraHeight);
    if (cameraRef.current) {
      cameraRef.current.lookAt(0, 0, 0);
    }
  }, [size, cameraHeight]);

  useFrame((_state, delta) => {
    if (!cameraRef.current) return;
    const camera = cameraRef.current;
    camera.position.x += delta * 20;
  });

  return (
    <>
      <axesHelper args={[size * 3]} />
      <ambientLight intensity={0.5} />
      <PerspectiveCamera
        makeDefault
        ref={cameraRef}
        position={[0, 0, cameraHeight]} // X, Y, Z (Z is up)
        // position={[-size, 0, (size / 2) * 10]} // X, Y, Z (Z is up)
      />
      <GroundPlane terrainGenerator={terrainGenerator} cameraRef={cameraRef} />
    </>
  );
}

export default Scene2;
