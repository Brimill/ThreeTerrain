import { PlaneGeometry } from "three";
import { useAppStore } from "./stores.ts";

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

export default Ground;