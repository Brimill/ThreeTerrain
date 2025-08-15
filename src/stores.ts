import { create } from "zustand";

type AppState = {
    size: number,
    updateSize: (newSize: number) => void,
}

export const useAppStore = create<AppState>()((set) => ({
    size: 100,
    updateSize: (newSize: number) => set({ size: newSize }),
}))
