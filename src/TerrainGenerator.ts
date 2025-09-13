import * as THREE from "three";
import { type NoiseFunction2D, createNoise2D } from "simplex-noise";

export class TerrainGenerator {
  amplitudes: number[];
  frequencies: number[];
  noiseLayers: NoiseFunction2D[];

  constructor(amplitudes: number[], frequencies: number[]) {
    this.amplitudes = amplitudes;
    this.frequencies = frequencies;
    let noiseArray: NoiseFunction2D[] = [];
    for (let i = 0; i < 8; i++) {
      noiseArray.push(createNoise2D());
    }
    this.noiseLayers = noiseArray;
  }

  setAmplitudes(amplitudes: number[]) {
    this.amplitudes = amplitudes;
  }

  setFrequencies(frequencies: number[]) {
    this.frequencies = frequencies;
  }

  /**
   * Calculate the height at a given position using the noise layers
   * @param x
   * @param y
   * @param layers The amount of layers to use for the calculation
   * @returns The height at the given position
   */
  calculateHeightAtPosition(x: number, y: number, layers: number): number {
    if (this.frequencies.length !== this.amplitudes.length) {
      throw new Error(
        "Frequencies and amplitudes arrays must have the same length",
      );
    }
    let height = 0;
    for (let i = 0; i < layers; i++) {
      height +=
        this.noiseLayers[i](x * this.frequencies[i], y * this.frequencies[i]) *
        this.amplitudes[i];
    }
    return height;
  }

  /**
   * Generate a displacement map using multiple layers of 2D noise
   * @param size The size of the texture (size x size)
   * @param layers The amount of layers to use for the generation
   * @returns An object containing the displacement texture and an array of ImageData for each layer
   */
  generateDisplacementMap(
    size: number,
    layers: number,
  ): { displacementTexture: THREE.DataTexture; textureLayers: ImageData[] } {
    if (this.frequencies.length !== this.amplitudes.length) {
      throw new Error(
        "Frequencies and amplitudes arrays must have the same length",
      );
    }

    const textureLayers: ImageData[] = [];

    // create texture for each currently active noise layer
    for (let i = 0; i < layers; i++) {
      const noise = this.noiseLayers[i];
      const frequency = this.frequencies[i];
      const amplitude = this.amplitudes[i];

      const imageData = new ImageData(size, size);
      const pixels = imageData.data;

      for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
          const value: number = noise(x * frequency, y * frequency) * amplitude;
          const cell: number = (x + y * size) * 4;
          pixels[cell] =
            pixels[cell + 1] =
            pixels[cell + 2] =
              Math.floor(value); // grayscale
          pixels[cell + 3] = 255; // alpha
        }
      }
      textureLayers.push(imageData);
    }

    const heightMap = new Float32Array(size * size);
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        heightMap[x + y * size] = this.calculateHeightAtPosition(x, y, layers);
      }
    }

    // console.log("Frequencies:", this.frequencies);
    // console.log("Amplitudes:", this.amplitudes);
    // console.log("Height map stats:", {
    //   minimum: Math.min(...heightMap),
    //   maximum: Math.max(...heightMap),
    // });

    const texture = new THREE.DataTexture(
      heightMap,
      size,
      size,
      THREE.RedFormat,
      THREE.FloatType,
    );
    texture.needsUpdate = true;
    texture.flipY = true;

    return {
      displacementTexture: texture,
      textureLayers: textureLayers,
    };
  }
}

/**
 * Convert a Float32Array of height values to an ImageData object
 * @param floatArray A Float32Array containing height values
 * @param size The width and height of the resulting ImageData (size x size)
 * @returns An ImageData object representing the height values as a grayscale image
 */
function floatArrayToImageData(
  floatArray: Float32Array,
  size: number,
): ImageData {
  const min = Math.min(...floatArray);
  const max = Math.max(...floatArray);
  const range = max - min || 1; // prevent division by zero

  const imageData = new ImageData(size, size);
  const pixels = imageData.data;
  for (let i = 0; i < floatArray.length; i++) {
    const normalized = Math.floor(((floatArray[i] - min) / range) * 255); // normalize to [0, 255]
    const j = i * 4;
    pixels[j] = normalized; // R
    pixels[j + 1] = normalized; // G
    pixels[j + 2] = normalized; // B
    pixels[j + 3] = 255; // A
  }
  return imageData;
}

export function generateDisplacementMap(
  size: number,
  frequencies: number[],
  amplitudes: number[],
  noiseLayers: NoiseFunction2D[],
  layers: number,
): { displacementTexture: THREE.CanvasTexture; textureLayers: ImageData[] } {
  if (frequencies.length !== amplitudes.length) {
    throw new Error(
      "Frequencies and amplitudes arrays must have the same length",
    );
  }
  // const noiseLayers: NoiseFunction2D[] = frequencies.map(() => createNoise2D());

  const textureLayers: ImageData[] = [];

  // const size = 1000;
  // const frequencies = [0.001, 0.01, 0.1, 0.2, 0.5];
  // const amplitudes = [250, 100, 50, 25, 25];

  // create texture for each currently active noise layer
  for (let i = 0; i < layers; i++) {
    const noise = noiseLayers[i];
    const frequency = frequencies[i];
    const amplitude = amplitudes[i];

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
        value +=
          noiseLayers[i](x * frequencies[i], y * frequencies[i]) *
          amplitudes[i];
      }
      // const value: number = noise(x * frequency, y * frequency);
      // normalize to [0, 255]
      const max = amplitudes.reduce((acc, amp) => acc + Math.abs(amp), 0);
      const normalized = (value / max) * 255;

      const cell: number = (x + y * size) * 4;
      pixels[cell] =
        pixels[cell + 1] =
        pixels[cell + 2] =
          Math.floor(normalized); // grayscale
      pixels[cell + 3] = 255; // alpha
    }
  }
  context.putImageData(imageData, 0, 0);

  return {
    displacementTexture: new THREE.CanvasTexture(canvas),
    textureLayers: textureLayers,
  };
}
