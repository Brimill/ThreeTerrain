import * as THREE from "three";
import { useAppStore } from "./stores.ts";
import { createNoise2D, type NoiseFunction2D } from "simplex-noise";
import { useEffect, useRef, useMemo } from "react";
import { GroundMaterial } from "./shader";
import { extend, type ThreeElement } from "@react-three/fiber";
import {
  generateDisplacementMap,
  TerrainGenerator,
} from "./TerrainGenerator.ts";
import type { GroundProps } from "./Ground.tsx";

extend({ GroundMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    groundMaterial: ThreeElement<typeof GroundMaterial>;
  }
}

function GroundCPU(props: GroundProps) {
  const size: number = useAppStore((state) => state.size);
  const layers: number = useAppStore((state) => state.layers);
  const frequencies: number[] = useAppStore((state) => state.frequencies);
  const amplitudes: number[] = useAppStore((state) => state.amplitudes);
  const setNoiseTextures = useAppStore((state) => state.setNoiseTextures);
  const geometryRef = useRef<THREE.PlaneGeometry | null>(null);
  const segments: number = size;
  const materialRef = useRef<THREE.MeshPhongMaterial | null>(null);

  useEffect(() => {
    // const { displacementTexture, textureLayers } = generateDisplacementMap(
    //   size,
    //   frequencies,
    //   amplitudes,
    //   noiseLayers,
    //   layers,
    // );
    props.terrainGenerator.setFrequencies(frequencies);
    props.terrainGenerator.setAmplitudes(amplitudes);
    const { textureLayers } = props.terrainGenerator.generateDisplacementMap(
      size,
      layers,
    );
    if (geometryRef.current) {
      console.log("Reached geometry update");
      const position = geometryRef.current.attributes.position;
      const vertices = position.array as Float32Array;
      for (let i = 0; i < vertices.length; i += 3) {
        const x = vertices[i];
        const y = vertices[i + 1];
        const height = props.terrainGenerator.calculateHeightAtPosition(
          x,
          y,
          layers,
        );
        console.log(`Vertex ${i / 3}: (${x}, ${y}) -> height: ${height}`);
        vertices[i + 2] = height * 0.1;
      }
      position.needsUpdate = true;
      geometryRef.current.computeVertexNormals();
    }
    // if (materialRef.current && geometryRef.current) {
    //   const position = geometryRef.current?.attributes.position;
    //   const vertices = position?.array as Float32Array;
    //   for (let i = 0; i < vertices.length; i += 3) {
    //     const x = Math.floor(
    //       ((vertices[i] / size + 0.5) * displacementTexture.image.width) %
    //         displacementTexture.image.width,
    //     );
    //     const y = Math.floor(
    //       ((vertices[i + 1] / size + 0.5) * displacementTexture.image.height) %
    //         displacementTexture.image.height,
    //     );
    //     const cell = (x + y * displacementTexture.image.width) * 4;
    //     const height = displacementTexture.image.data[cell] / 255; // assuming grayscale
    //     vertices[i + 2] = height * 100; // scale height
    //   }
    // position.needsUpdate = true;
    // geometryRef.current.computeVertexNormals();
    // materialRef.current.displacementMap = displacementTexture;
    // materialRef.current.needsUpdate = true;
    // }
    setNoiseTextures(textureLayers);
  }, [frequencies, amplitudes]);

  return (
    <mesh>
      <planeGeometry
        ref={geometryRef}
        args={[size, size, segments, segments]}
      />
      <meshPhongMaterial wireframe={true} />
      {/* <groundMaterial /> */}
    </mesh>
  );
}

export default GroundCPU;
