import * as THREE from "three";
import { useAppStore } from "./stores.ts";
import { useEffect, useRef, useMemo } from "react";
import { TerrainGenerator } from "./TerrainGenerator.ts";

export type GroundProps = {
  terrainGenerator: TerrainGenerator;
};

function Ground({ terrainGenerator }: GroundProps) {
  const size: number = useAppStore((state) => state.size);
  const layers: number = useAppStore((state) => state.layers);
  const frequencies: number[] = useAppStore((state) => state.frequencies);
  const amplitudes: number[] = useAppStore((state) => state.amplitudes);

  const setNoiseTextures = useAppStore((state) => state.setNoiseTextures);

  const geometryRef = useRef<THREE.PlaneGeometry | null>(null);
  const segments: number = size;
  const materialRef = useRef<THREE.MeshPhongMaterial | null>(null);

  useEffect(() => {
    terrainGenerator.setFrequencies(frequencies);
    terrainGenerator.setAmplitudes(amplitudes);
    const { displacementTexture, textureLayers } =
      terrainGenerator.generateDisplacementMap(size, layers);

    if (materialRef.current) {
      console.log("Applying displacement map to material", displacementTexture);
      materialRef.current.displacementMap = displacementTexture;
      materialRef.current.needsUpdate = true;
    }
    setNoiseTextures(textureLayers);
  }, [frequencies, amplitudes]);

  return (
    <mesh>
      <planeGeometry
        ref={geometryRef}
        args={[size, size, segments, segments]}
      />
      <meshStandardMaterial
        ref={materialRef}
        color="white"
        wireframe={true}
        displacementScale={0.1}
      />
    </mesh>
  );
}
export default Ground;
