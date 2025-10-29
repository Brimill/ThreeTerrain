import { useFrame } from "@react-three/fiber";
import Ground from "@/components/three/Ground";
import type { TerrainGenerator } from "@/TerrainGenerator";
import { Vector2, Vector3 } from "three";
import { useState, useLayoutEffect } from "react";
import type { PerspectiveCamera } from "three";

interface GroundPlaneProps {
  terrainGenerator: TerrainGenerator;
  cameraRef: React.RefObject<PerspectiveCamera | null>;
}

function GroundPlane({ terrainGenerator, cameraRef }: GroundPlaneProps) {
  const [tilePositions, setTilePositions] = useState<Vector2[]>([]);
  let timeSinceLastCalc = 0;

  useLayoutEffect(() => {
    if (!cameraRef?.current) return;
    const pos = cameraRef.current.position;
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
        return (
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
  const currentTileX = Math.floor(position.x / tileSize);
  const currentTileY = Math.floor(position.y / tileSize);
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
