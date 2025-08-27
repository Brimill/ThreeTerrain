import { create } from "zustand";

type AppState = {
  size: number,
  layers: number,
  frequencies: number[],
  amplitudes: number[],
  noiseTextures: ImageData[],

  setSize: (newSize: number) => void,
  setLayers: (newLayers: number) => void,

  setFrequencies: (newFrequencies: number[]) => void,
  setFrequency: (index: number, value: number) => void,
  addFrequency: (newFrequency: number) => void,
  removeFrequency: () => void,

  setAmplitudes: (newAmplitudes: number[]) => void,
  setAmplitude: (index: number, value: number) => void,
  addAmplitude: (newAmplitude: number) => void,
  removeAmplitude: () => void,
  setNoiseTextures: (newTextures: ImageData[]) => void,
}

export const useAppStore = create<AppState>()((set) => ({
  size: 100,
  layers: 1,
  frequencies: [1, 1, 1, 1, 1, 1, 1, 1],
  amplitudes: [1, 1, 1, 1, 1, 1, 1, 1],
  noiseTextures: [],
  setSize: (newSize: number) => set({ size: newSize }),
  setLayers: (newLayers: number) => set({ layers: newLayers }),
  setFrequencies: (newFrequencies: number[]) => set({ frequencies: newFrequencies }),
  setFrequency: (index: number, value: number) => set((state) => {
    const newFrequencies = [...state.frequencies];
    newFrequencies[index] = value;
    return { frequencies: newFrequencies };
  }),
  addFrequency: (newFrequency: number) => set((state) => ({
    frequencies: [...state.frequencies, newFrequency]
  })),
  removeFrequency: () => set((state) => {
    const newFrequencies = [...state.frequencies];
    newFrequencies.pop();
    return { frequencies: newFrequencies };
  }),
  setAmplitudes: (newAmplitudes: number[]) => set({
    amplitudes: newAmplitudes
  }),
  setAmplitude: (index: number, value: number) => set((state) => {
    const newAmplitudes = [...state.amplitudes];
    newAmplitudes[index] = value;
    return { amplitudes: newAmplitudes };
  }),
  addAmplitude: (newAmplitude: number) => set((state) => ({
    amplitudes: [...state.amplitudes, newAmplitude]
  })),
  removeAmplitude: () => set((state) => {
    const newAmplitudes = [...state.amplitudes];
    newAmplitudes.pop();
    return { amplitudes: newAmplitudes };
  }),
  setNoiseTextures: (newTextures: ImageData[]) => set({ noiseTextures: newTextures }),
}));
