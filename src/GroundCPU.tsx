import * as THREE from "three";
import { useAppStore } from "./stores.ts";
import { useEffect, useRef } from "react";
import { GroundMaterial } from "./shader";
import { extend, type ThreeElement } from "@react-three/fiber";
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
        const xNoise = x + size / 2;
        const yNoise = -y + size / 2;
        const height = props.terrainGenerator.calculateHeightAtPosition(
          xNoise,
          yNoise,
          layers,
        );
        // console.log(
        //   `Vertex ${i / 3}: (${x}, ${y}) -> ${xNoise}, ${yNoise} -> height: ${height}`,
        // );
        vertices[i + 2] = height * 0.1;
      }
      position.needsUpdate = true;
      geometryRef.current.computeVertexNormals();
    }
    setNoiseTextures(textureLayers);
  }, [frequencies, amplitudes]);

  return (
    <mesh>
      <planeGeometry
        ref={geometryRef}
        args={[size, size, segments, segments]}
      />
      {/* <meshPhongMaterial wireframe={true} /> */}
      <groundMaterial key={GroundMaterial.key} />
    </mesh>
  );
}

export default GroundCPU;
