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
  const setFrequency = useAppStore((state) => state.setFrequency);

  // Amplitudes-related state and actions
  const amplitudes = useAppStore((state) => state.amplitudes);
  const addAmplitude = useAppStore((state) => state.addAmplitude);
  const removeAmplitude = useAppStore((state) => state.removeAmplitude);
  const setAmplitude = useAppStore((state) => state.setAmplitude);

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
  };

  return (
    <div className="size-full">
      <Card className="w-9/10 m-5 box-border">
        <CardContent className="grid grid-cols-[min-content_1fr_min-content] gap-4 items-center justify-items-center">
          <Label
            htmlFor="layers"
            className="col-start-1 row-start-1 justify-self-end"
          >
            Layers
          </Label>
          <Slider
            id="layerSlider"
            name="layers"
            className="col-start-2 row-start-1"
            min={1}
            max={8}
            step={1}
            onValueChange={(value) => {
              updateLayers(value[0]);
            }}
          />
          <Label className="col-start-3 row-start-1 text-center">
            {layers}
          </Label>
          <Button variant="default" className="col-span-3 row-start-2">
            Generate
          </Button>
        </CardContent>
      </Card>

      <div className="w-full h-3/4 flex flex-wrap justify-center gap-4 box-border items-center">
        {Array.from({ length: layers }).map((_, index) => (
          <Card
            key={index}
            className="w-64 p-3 flex items-center justify-center rounded-xl overflow-hidden"
          >
            {noiseTextures[index] && (
              <canvas
                className="w-full h-full aspect-square"
                ref={(ref) => {
                  if (ref) {
                    ref.width = noiseTextures[index].width;
                    ref.height = noiseTextures[index].height;
                    const context = ref.getContext("2d");
                    if (context) {
                      context.putImageData(noiseTextures[index], 0, 0);
                    }
                  }
                }}
              />
            )}
            <form className="w-full grid grid-rows-4 grid-cols-[1fr_min-content]">
              <Label
                className="col-start-1 col-span-2"
                htmlFor={`freqSlider${index}`}
              >
                Frequency
              </Label>
              <Slider
                className="col-start-1"
                id={`freqSlider${index}`}
                defaultValue={[frequencies[index] ?? 0.001]}
                onValueChange={(freq) => setFrequency(index, freq[0])}
                max={0.5}
                step={0.001}
              />
              <Label className="col-start-2">{frequencies[index]}</Label>

              <Label
                className="col-start-1 col-span-2"
                htmlFor={`ampSlider${index}`}
              >
                Amplitude
              </Label>
              <Slider
                id={`ampSlider${index}`}
                defaultValue={[amplitudes[index] ?? 1]}
                onValueChange={(amp) => setAmplitude(index, amp[0])}
                max={500}
              />
              <Label className="col-start-2">{amplitudes[index]}</Label>
            </form>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default TextureViewer;
