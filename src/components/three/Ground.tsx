import * as THREE from "three";
import { Helper } from "@react-three/drei";
import { Vector3, BoxHelper } from "three";
import { useAppStore } from "@/stores.ts";
import { useEffect, useRef } from "react";
import { TerrainGenerator } from "@/TerrainGenerator.ts";
import { GroundMaterial } from "@/shader.ts";
import { extend } from "@react-three/fiber";
import { useControls } from "leva";

extend(GroundMaterial);

export interface GroundProps {
  terrainGenerator: TerrainGenerator;
  position: Vector3;
  size: number;
}

function Ground({ terrainGenerator, position, size }: GroundProps) {
  const { useGradients } = useControls("Settings", { useGradients: true });
  const layers: number = useAppStore((state) => state.layers);
  const frequencies: number[] = useAppStore((state) => state.frequencies);
  const amplitudes: number[] = useAppStore((state) => state.amplitudes);

  const setNoiseTextures = useAppStore((state) => state.setNoiseTextures);

  const geometryRef = useRef<THREE.PlaneGeometry | null>(null);
  const segments: number = size;
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  const shiftedOrigin = position.clone();

  shiftedOrigin.x += size / 2;
  shiftedOrigin.y += size / 2;

  useEffect(() => {
    terrainGenerator.setFrequencies(frequencies);
    terrainGenerator.setAmplitudes(amplitudes);
    // Shift origin to the top-left corner of the mesh
    const { displacementTexture, textureLayers } =
      terrainGenerator.generateDisplacementMap(
        size,
        layers,
        shiftedOrigin,
        useGradients,
      );

    if (materialRef.current) {
      materialRef.current.uniforms.heightMap.value = displacementTexture;
      materialRef.current.uniforms.useHeightMap.value = true;
    }
    setNoiseTextures(textureLayers);
  }, [frequencies, amplitudes, layers, size, useGradients]);

  return (
    <>
      <mesh position={position}>
        <planeGeometry
          ref={geometryRef}
          args={[size, size, segments, segments]}
        />
        {/* <meshStandardMaterial
        // ref={materialRef}
        color="white"
        wireframe={true}
        displacementScale={0.1}
      /> */}
        <groundMaterial ref={materialRef} key={GroundMaterial.key} />

        <Helper type={BoxHelper} args={[0xff0000]} />
      </mesh>
    </>
  );
}
export default Ground;
