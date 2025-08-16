import React from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "./components/ui/card";
import { useAppStore } from "./stores";

function TextureViewer() {
  // Layers-related state and actions
  const layers = useAppStore((state) => state.layers);
  const setLayers = useAppStore((state) => state.setLayers);

  // Frequencies-related state and actions
  const frequencies = useAppStore((state) => state.frequencies);
  const addFrequency = useAppStore((state) => state.addFrequency);
  const removeFrequency = useAppStore((state) => state.removeFrequency);
  const setFrequencies = useAppStore((state) => state.setFrequencies);

  // Amplitudes-related state and actions
  const amplitudes = useAppStore((state) => state.amplitudes);
  const addAmplitude = useAppStore((state) => state.addAmplitude);
  const removeAmplitude = useAppStore((state) => state.removeAmplitude);
  const setAmplitudes = useAppStore((state) => state.setAmplitudes);

  const noiseLayers = [1];
  const noiseTextures = useAppStore((state) => state.noiseTextures);

  const updateLayers = (newLayers: number) => {
    if (newLayers > layers) {
      addFrequency(1);
      addAmplitude(1);
    } else {
      removeFrequency();
      removeAmplitude();
    }
    setLayers(newLayers);
  }


  return (
    <div className="size-full">
      <Card className="w-9/10 h-1/4 m-5 box-border">
        <CardContent className="h-full grid grid-cols-[min-content_1fr_min-content] grid-rows-6 gap-4 items-center justify-items-center">
          <Label htmlFor="layers" className="col-start-1 row-start-1 justify-self-end">Layers</Label>
          <Slider
            id="layerSlider"
            name="layers"
            className="col-start-2 row-start-1"
            min={1}
            max={8}
            step={1}
            onValueChange={(value) => { updateLayers(value[0]); }}
          />
          <Label className="col-start-3 row-start-1 text-center">
            {layers}
          </Label>
          <Label htmlFor="frequencies" className="col-start-1 row-start-2 justify-self-end">Frequencies</Label>
          <Slider
            id="frequenciesSlider"
            name="frequencies"
            className="col-start-2 row-start-2"
            min={0.001}
            max={0.5}
            step={0.001}
            value={frequencies}
            onValueChange={(value) => setFrequencies(value)}
            defaultValue={[1]}
          />
          <Label className="col-span-3 row-start-3 text-center">
            {frequencies.join(", ")}
          </Label>
          <Label htmlFor="amplitudes" className="col-start-1 row-start-4 justify-self-end">Amplitudes</Label>
          <Slider
            id="amplitudesSlider"
            name="amplitudes"
            className="col-start-2 row-start-4"
            min={0}
            max={500}
            step={1}
            value={amplitudes}
            onValueChange={(value) => setAmplitudes(value)}
            defaultValue={[1]}
          />
          <Label className="col-span-3 row-start-5 text-center">
            {amplitudes.join(", ")}
          </Label>
          <Button variant="default"
            className="col-span-3 row-start-6">
            Generate
          </Button>
        </CardContent>
      </Card >


      <div className="w-full h-3/4 flex flex-wrap justify-center gap-4 box-border p-4">
        {noiseTextures.map((imageData, index) =>
          <canvas
            className="aspect-square rounded-xl bg-black"
            key={index}
            ref={(ref) => {
              if (ref) {
                const context = ref.getContext("2d");
                if (context) {
                  context.putImageData(imageData, 0, 0);
                }
              }
            }}>
          </canvas >
        )}
      </div >
    </div >
  )
}

export default TextureViewer