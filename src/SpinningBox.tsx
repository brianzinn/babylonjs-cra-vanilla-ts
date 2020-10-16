import { Color3, Mesh, MeshBuilder, Nullable, StandardMaterial, Vector3 } from '@babylonjs/core';
import { useBeforeRender, useScene } from 'babylonjs-hook';
import React, { useRef, useEffect} from 'react';

type SpinningBoxProps = {
    position: Vector3
    color: Color3
  }
  
export const SpinningBox: React.FC<SpinningBoxProps> = ({position, color}) => {
    const boxRef = useRef<Nullable<Mesh>>()
    const scene = useScene();
    useEffect(() => {
      if (scene !== null) {
        const box: Mesh = MeshBuilder.CreateBox("box", { size: 0.5 /* was 2 */ }, scene);
        box.position = position;

        const boxMat = new StandardMaterial('box', scene);
        boxMat.diffuseColor = color;
        boxMat.specularColor = Color3.Black();
        box.material = boxMat;

        boxRef.current = box;
        return () => {
          box?.dispose();
        }
      }
    }, [scene]);
  
    useBeforeRender((scene) => {
      if (boxRef.current) {
        var deltaTimeInMillis = scene.getEngine().getDeltaTime();
  
        const rpm = 10;
        boxRef.current.rotation.y += ((rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000));
      }
    })

    if (boxRef.current) {
      boxRef.current.position = position;
    }

    return null;
  }