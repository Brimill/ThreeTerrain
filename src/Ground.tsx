import { PlaneGeometry } from "three";
import * as THREE from "three";
import { useAppStore } from "./stores.ts";
import { createNoise2D, type NoiseFunction2D } from "simplex-noise";


type GroundProps = {
    size: number,
}

function Ground() {
    const size: number = useAppStore((state) => state.size);
    const segments: number = size;

    return (
        <mesh>
            <planeGeometry args={[size, size, segments, segments]} />
            <meshPhongMaterial color="white" wireframe={true} />
        </mesh>
    )
}

function generateDisplacementMap(): THREE.CanvasTexture {
    const noise: NoiseFunction2D = createNoise2D();
    const size = 1000;
    const enableSets = [true, true, true, true, true];
    const frequencies = [0.001, 0.01, 0.1, 0.2, 0.5];
    const amplitudes = [250, 100, 50, 25, 25];
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
                if (!enableSets[i]) {
                    return acc;
                }
                return acc + noise(x * frequency, y * frequency) * amplitudes[i];
            }, 0);
            // const value: number = noise(x * frequency, y * frequency);
            const cell: number = (x + y * size) * 4;
            pixels[cell] = pixels[cell + 1] = pixels[cell + 2] = Math.floor((value)); // grayscale
            pixels[cell + 3] = 255; // alpha
        }
    }
    context.putImageData(imageData, 0, 0);

    document.body.appendChild(canvas);

    return new THREE.CanvasTexture(canvas);
}

export default Ground;