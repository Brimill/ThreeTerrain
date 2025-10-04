import { useThree } from "@react-three/fiber";
import Ground from "@/components/three/Ground";
import { PerspectiveCamera as PerspectiveCameraType } from "three";
import { PerspectiveCamera } from "@react-three/drei";
import { useAppStore } from "@/stores.ts";
import { useEffect, useMemo, useRef } from "react";
import { useControls } from "leva";
import GroundCPU from "@/components/three/GroundCPU";
import { TerrainGenerator } from "@/TerrainGenerator";

function Scene() {
  const { camera, size: viewportSize } = useThree();
  const { useGPU } = useControls(
    "Settings",
    { useGPU: false },
    { collapsed: true },
  );
  const size: number = useAppStore((state) => state.size);
  const frequencies: number[] = useAppStore((state) => state.frequencies);
  const amplitudes: number[] = useAppStore((state) => state.amplitudes);
  const cameraRef = useRef<PerspectiveCameraType>(null);
  const cameraHeight = size * 1.5;
  const terrainGenerator = useMemo(
    () => new TerrainGenerator(frequencies, amplitudes),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

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
      {useGPU ? (
        <Ground terrainGenerator={terrainGenerator} />
      ) : (
        <GroundCPU terrainGenerator={terrainGenerator} />
      )}
    </>
  );
}

export default Scene;
