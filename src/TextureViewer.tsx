import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "./components/ui/card";
import { useAppStore } from "./stores";

function TextureViewer() {
    const updateLayers = useAppStore((state) => state.updateLayers);
    const layers = useAppStore((state) => state.layers);
    const noiseLayers = [1];


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
                        onValueChange={(value) => updateLayers(value[0])}
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
                        onValueChange={(value) => useAppStore.getState().updateFrequences(value)}
                        defaultValue={[0.001, 0.01, 0.1, 0.2, 0.5]}
                    />
                    <Label className="col-span-3 row-start-3 text-center">
                        {useAppStore.getState().frequencies.join(", ")}
                    </Label>
                    <Label htmlFor="amplitudes" className="col-start-1 row-start-4 justify-self-end">Amplitudes</Label>
                    <Slider
                        id="amplitudesSlider"
                        name="amplitudes"
                        className="col-start-2 row-start-4"
                        min={0}
                        max={500}
                        step={1}
                        onValueChange={(value) => useAppStore.getState().updateAmplitudes(value)}
                        defaultValue={[250, 100, 50, 25, 25]}
                    />
                    <Label className="col-span-3 row-start-5 text-center">
                        {useAppStore.getState().amplitudes.join(", ")}
                    </Label>
                    <Button variant="default"
                        className="col-span-3 row-start-6">
                        Generate
                    </Button>
                </CardContent>
            </Card >


            <div className="w-full h-3/4 flex flex-wrap justify-center gap-4 box-border p-4">
                {noiseLayers.map((item) =>
                    <div
                        key={item}
                        className="flex-[1_1_150px] aspect-quare rounded-xl bg-black">
                    </div >
                )}
            </div >
        </div >
    )
}

export default TextureViewer