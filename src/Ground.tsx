import * as THREE from "three";
import { useAppStore } from "./stores.ts";
import { createNoise2D, type NoiseFunction2D } from "simplex-noise";
import { useEffect, useRef } from "react";


type GroundProps = {
  size: number,
}

function Ground() {
  const size: number = useAppStore((state) => state.size);
  const frequencies: number[] = useAppStore((state) => state.frequencies);
  const amplitudes: number[] = useAppStore((state) => state.amplitudes);
  const setNoiseTextures = useAppStore((state) => state.setNoiseTextures);
  const geometryRef = useRef<THREE.PlaneGeometry | null>(null);
  const segments: number = size;
  const { displacementTexture: texture, textureLayers: canvases } = generateDisplacementMap(size, frequencies, amplitudes);
  // set the texture in the store
  setNoiseTextures(canvases);


  return (
    <mesh>
      <planeGeometry ref={geometryRef} args={[size, size, segments, segments]} />
      <meshPhongMaterial color="white" wireframe={true} displacementMap={texture} />
    </mesh>
  )
}

function generateDisplacementMap(
  size: number,
  frequencies: number[],
  amplitudes: number[]
): { displacementTexture: THREE.CanvasTexture, textureLayers: ImageData[] } {
  if (frequencies.length !== amplitudes.length) {
    throw new Error("Frequencies and amplitudes arrays must have the same length");
  }
  const noiseLayers: NoiseFunction2D[] = frequencies.map(() => createNoise2D());
  const textureLayers: ImageData[] = []

  // const size = 1000;
  // const frequencies = [0.001, 0.01, 0.1, 0.2, 0.5];
  // const amplitudes = [250, 100, 50, 25, 25];

  // create texture for each noise layer
  const canvases: HTMLCanvasElement[] = [];
  for (let i = 0; i < noiseLayers.length; i++) {
    const noise = noiseLayers[i]
    const frequency = frequencies[i]
    const amplitude = amplitudes[i]
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
        const value: number = noise(x * frequency, y * frequency) * amplitude;
        const cell: number = (x + y * size) * 4;
        pixels[cell] = pixels[cell + 1] = pixels[cell + 2] = Math.floor(value); // grayscale
        pixels[cell + 3] = 255; // alpha
      }
    }
    context.putImageData(imageData, 0, 0);
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
      const value: number = frequencies.reduce((acc, frequency, i) => {
        return acc + noiseLayers[i](x * frequency, y * frequency) * amplitudes[i];
      }, 0);
      // const value: number = noise(x * frequency, y * frequency);
      const cell: number = (x + y * size) * 4;
      pixels[cell] = pixels[cell + 1] = pixels[cell + 2] = Math.floor((value)); // grayscale
      pixels[cell + 3] = 255; // alpha
    }
  }
  context.putImageData(imageData, 0, 0);

  // document.body.appendChild(canvas);

  return {
    displacementTexture: new THREE.CanvasTexture(canvas),
    textureLayers: textureLayers,
  };
}

export default Ground;