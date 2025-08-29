import * as THREE from "three";
import { useAppStore } from "./stores.ts";
import { createNoise2D, type NoiseFunction2D } from "simplex-noise";
import { useEffect, useRef, useMemo } from "react";


function Ground() {
  const size: number = useAppStore((state) => state.size);
  const layers: number = useAppStore((state) => state.layers);
  const frequencies: number[] = useAppStore((state) => state.frequencies);
  const amplitudes: number[] = useAppStore((state) => state.amplitudes);
  const setNoiseTextures = useAppStore((state) => state.setNoiseTextures);
  const geometryRef = useRef<THREE.PlaneGeometry | null>(null);
  const segments: number = size;
  const materialRef = useRef<THREE.MeshPhongMaterial | null>(null);

  const noiseLayers = useMemo<NoiseFunction2D[]>(() => {
    let noiseArray: NoiseFunction2D[] = [];
    for (let i = 0; i < 8; i++) {
      noiseArray.push(createNoise2D());
    }
    return noiseArray;
  }, []);


  useEffect(() => {
    const { displacementTexture, textureLayers } = generateDisplacementMap(size, frequencies, amplitudes, noiseLayers, layers);
    if (materialRef.current) {
      materialRef.current.displacementMap = displacementTexture;
      materialRef.current.needsUpdate = true;
    }
    setNoiseTextures(textureLayers);
  }, [frequencies, amplitudes])


  return (
    <mesh>
      <planeGeometry ref={geometryRef} args={[size, size, segments, segments]} />
      <meshPhongMaterial ref={materialRef} color="white" wireframe={true} displacementScale={10} />
    </mesh>
  )
}

function generateDisplacementMap(
  size: number,
  frequencies: number[],
  amplitudes: number[],
  noiseLayers: NoiseFunction2D[],
  layers: number,
): { displacementTexture: THREE.CanvasTexture, textureLayers: ImageData[] } {
  if (frequencies.length !== amplitudes.length) {
    throw new Error("Frequencies and amplitudes arrays must have the same length");
  }
  // const noiseLayers: NoiseFunction2D[] = frequencies.map(() => createNoise2D());

  const textureLayers: ImageData[] = []

  // const size = 1000;
  // const frequencies = [0.001, 0.01, 0.1, 0.2, 0.5];
  // const amplitudes = [250, 100, 50, 25, 25];

  // create texture for each currently active noise layer
  for (let i = 0; i < layers; i++) {
    const noise = noiseLayers[i]
    const frequency = frequencies[i]
    const amplitude = amplitudes[i]

    const imageData = new ImageData(size, size);
    const pixels = imageData.data;

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const value: number = noise(x * frequency, y * frequency) * amplitude;
        const cell: number = (x + y * size) * 4;
        pixels[cell] = pixels[cell + 1] = pixels[cell + 2] = Math.floor(value); // grayscale
        pixels[cell + 3] = 255; // alpha
      }
    }
    textureLayers.push(imageData);
  }
  // create accumulated texture from all layers
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const context = canvas.getContext("2d");
  if (context === null) {
    throw new Error("Could not get 2d context");
  }
  const imageData = context.getImageData(0, 0, size, size);
  const pixels = imageData.data;

  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      let value = 0;
      for (let i = 0; i < layers; i++) {
        value += noiseLayers[i](x * frequencies[i], y * frequencies[i]) * amplitudes[i];
      }
      // const value: number = noise(x * frequency, y * frequency);
      // normalize to [0, 255]
      const max = amplitudes.reduce((acc, amp) => acc + Math.abs(amp), 0);
      const normalized = (value / max) * 255;

      const cell: number = (x + y * size) * 4;
      pixels[cell] = pixels[cell + 1] = pixels[cell + 2] = Math.floor((normalized)); // grayscale
      pixels[cell + 3] = 255; // alpha
    }
  }
  context.putImageData(imageData, 0, 0);

  return {
    displacementTexture: new THREE.CanvasTexture(canvas),
    textureLayers: textureLayers,
  };
}

export default Ground;