import { Canvas } from "@react-three/fiber"
import Ground from "./Ground"
import { OrthographicCamera, PerspectiveCamera } from "@react-three/drei"
import { useAppStore } from "./stores"

function ThreeViewer() {
    const size: number = useAppStore((state => state.size));
    const cameraHeight = size * 1.5;
    return (
        <div id="canvas-container" className="size-full bg-muted">
            <Canvas>
                <ambientLight intensity={0.5} />
                <PerspectiveCamera makeDefault position={[0, 0, cameraHeight]} />
                <Ground />
            </Canvas>
        </div >
    )
}

export default ThreeViewer