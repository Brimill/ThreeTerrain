import * as THREE from "three";
import { useAppStore } from "./stores.ts";
import { useEffect, useRef } from "react";
import { TerrainGenerator } from "./TerrainGenerator.ts";
import { GroundMaterial } from "./shader.ts";
import { extend } from "@react-three/fiber";
import { useControls } from "leva";

extend(GroundMaterial);

export interface GroundProps {
  terrainGenerator: TerrainGenerator;
}

function Ground({ terrainGenerator }: GroundProps) {
  const { useGradients } = useControls("Settings", { useGradients: true });
  const size: number = useAppStore((state) => state.size);
  const layers: number = useAppStore((state) => state.layers);
  const frequencies: number[] = useAppStore((state) => state.frequencies);
  const amplitudes: number[] = useAppStore((state) => state.amplitudes);

  const setNoiseTextures = useAppStore((state) => state.setNoiseTextures);

  const geometryRef = useRef<THREE.PlaneGeometry | null>(null);
  const segments: number = size;
  // const materialRef = useRef<THREE.MeshPhongMaterial | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  useEffect(() => {
    terrainGenerator.setFrequencies(frequencies);
    terrainGenerator.setAmplitudes(amplitudes);
    const { displacementTexture, textureLayers } =
      terrainGenerator.generateDisplacementMap(size, layers, useGradients);

    if (materialRef.current) {
      console.log("Applying displacement map to material", displacementTexture);
      // materialRef.current.displacementMap = displacementTexture;
      // materialRef.current.needsUpdate = true;

      materialRef.current.uniforms.heightMap.value = displacementTexture;
      materialRef.current.uniforms.useHeightMap.value = true;
    }
    setNoiseTextures(textureLayers);
  }, [frequencies, amplitudes, layers, size]);

  return (
    <mesh>
      <planeGeometry
        ref={geometryRef}
        args={[size, size, segments, segments]}
      />
      {/* <meshStandardMaterial
        ref={materialRef}
        color="white"
        wireframe={true}
        displacementScale={0.1}
      /> */}
      <groundMaterial ref={materialRef} key={GroundMaterial.key} />
    </mesh>
  );
}
export default Ground;
