import { ArcRotateCamera, Scene, Vector3 } from '@babylonjs/core';
import { useCamera } from 'babylonjs-hook';
import React from 'react';

type CameraPosition = {
    radius: number
}
export const MyCamera: React.FC<CameraPosition> = ({radius}) => {
    const camera = useCamera<ArcRotateCamera>((scene: Scene) => {
        console.log('creating camera...');
        return new ArcRotateCamera('camera1', Math.PI / 2, Math.PI * 0.45, radius, Vector3.Zero(), scene);
    })

    if (camera) {
        camera.radius = radius;
    }
    return null;
}