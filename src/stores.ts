import { create } from "zustand";

type AppState = {
    size: number,
    layers: number,
    frequencies: number[],
    amplitudes: number[],

    updateSize: (newSize: number) => void,
    updateLayers: (newLayers: number) => void,
    updateFrequences: (newFrequences: number[]) => void,
    updateAmplitudes: (newAmplitudes: number[]) => void,
}

export const useAppStore = create<AppState>()((set) => ({
    size: 100,
    layers: 1,
    frequencies: [0.001, 0.01, 0.1, 0.2, 0.5],
    amplitudes: [250, 100, 50, 25, 25],
    updateSize: (newSize: number) => set({ size: newSize }),
    updateLayers: (newLayers: number) => set({ layers: newLayers }),
    updateFrequences: (newFrequences: number[]) => set({ frequencies: newFrequences }),
    updateAmplitudes: (newAmplitudes: number[]) => set({
        amplitudes: newAmplitudes
    })
}));
