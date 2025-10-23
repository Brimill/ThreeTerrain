import { useFrame } from "@react-three/fiber";
import Ground from "@/components/three/Ground";
import type { TerrainGenerator } from "@/TerrainGenerator";
import { BoxHelper, Vector2, Vector3 } from "three";
import { useMemo, useState, useLayoutEffect } from "react";
import { Helper } from "@react-three/drei";
import type { PerspectiveCamera } from "three";

interface GroundPlaneProps {
  terrainGenerator: TerrainGenerator; // Replace 'any' with the actual type if available
  cameraRef: React.RefObject<PerspectiveCamera | null>;
}

function GroundPlane({ terrainGenerator, cameraRef }: GroundPlaneProps) {
  // const camPosition = useThree((state) => state.camera.position);
  // const initialTiles = useMemo(
  //   () => calcSurroundingTiles(cameraRef.current.position),
  //   [],
  // );
  const [tilePositions, setTilePositions] = useState<Vector2[]>([]);
  let timeSinceLastCalc = 0;

  useLayoutEffect(() => {
    if (!cameraRef?.current) return;
    const pos = cameraRef.current.position;
    // run your calculation using pos.x/pos.y/pos.z
    setTilePositions(calcSurroundingTiles(pos));
  }, [cameraRef]);

  const checkTileListEquality = (a: Vector2[], b: Vector2[]) => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!a[i].equals(b[i])) return false;
    }
    return true;
  };

  useFrame((_state, delta) => {
    if (cameraRef.current === null) {
      return;
    }
    const camPosition = cameraRef.current.position;
    // console.log("Camera position in useFrame:", camPosition);
    // console.log(tilePositions);
    timeSinceLastCalc += delta;
    if (timeSinceLastCalc < 1) return;
    timeSinceLastCalc = 0;
    const newTiles = calcSurroundingTiles(camPosition);
    if (checkTileListEquality(newTiles, tilePositions) === false) {
      setTilePositions(newTiles);
    }
  });

  return (
    <>
      {tilePositions.map((tile) => {
        // <Ground key={tile.toString()} position={tile} />
        // console.log("Rendering tile at", tile);
        return (
          // <mesh key={tile.toString()} position={[tile.x, tile.y, 0]}>
          //   <planeGeometry args={[200, 200, 200, 200]} />
          //   <meshStandardMaterial color={"green"} />
          //   {/* <Helper type={PlaneHelper} /> */}

          //   <Helper type={BoxHelper} args={[0xff0000]} />
          // </mesh>
          <Ground
            key={tile.x + "," + tile.y}
            position={new Vector3(tile.x, tile.y, 0)}
            size={200}
            terrainGenerator={terrainGenerator}
          />
        );
      })}
    </>
  );
}

function calcSurroundingTiles(position: Vector3) {
  const tileSize = 200;
  // console.log("Camera position:", position);
  const currentTileX = Math.floor(position.x / tileSize);
  const currentTileY = Math.floor(position.y / tileSize);
  // console.log("Current tile:", currentTileX, currentTileY);
  const offsets = [
    [0, 0],
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ];

  return offsets.map(
    ([dx, dy]) =>
      new Vector2(
        (currentTileX + dx) * tileSize,
        (currentTileY + dy) * tileSize,
      ),
  );
}
export default GroundPlane;
