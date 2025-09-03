import { useThree } from "@react-three/fiber";
import Ground from "./Ground";
import { PerspectiveCamera as PerspectiveCameraType } from "three";
import { OrthographicCamera, PerspectiveCamera } from "@react-three/drei";
import { useAppStore } from "./stores";
import { useEffect, useRef } from "react";

function Scene() {
  const { camera, size: viewportSize } = useThree();

  const size: number = useAppStore((state) => state.size);
  const cameraRef = useRef<PerspectiveCameraType>(null);
  const cameraHeight = size * 1.5;

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

  return (
    <>
      <axesHelper args={[size]} />
      <ambientLight intensity={0.5} />
      <PerspectiveCamera
        makeDefault
        ref={cameraRef}
        position={[-size, -size, size / 2]} // X, Y, Z (Z is up)
      />
      <Ground />
    </>
  );
}

export default Scene;
