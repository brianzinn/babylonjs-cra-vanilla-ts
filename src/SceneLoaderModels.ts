import React, { useRef, useContext, useEffect } from 'react';

import { useScene } from 'babylonjs-hook';
import { LoaderStatus, SceneLoaderContext, useSceneLoader } from 'react-babylonjs-loaders';
import { MeshBuilder, Nullable, Mesh, Vector3, Matrix, Color3, StandardMaterial, TransformNode } from '@babylonjs/core';

type SceneLoaderFallbackType = {
    position: Vector3
    width: number
    height?: number
    depth?: number
    barColor: Color3
}

/**
 * Example of a simple progress bar as a Suspense fallback (progress updated via context).
 */
export const SceneLoaderFallback: React.FC<SceneLoaderFallbackType> = ({position, width, height, depth, barColor}) => {
    const boxRef = useRef<Nullable<Mesh>>(null);
    const context = useContext(SceneLoaderContext);
    const scene = useScene();

    useEffect(() => {
        const node = new TransformNode('fallback-parent', scene);
        node.position = position;

        const meshHeight = height ?? 1;
        const meshDepth = depth ?? 0.1;

        const progressBox = MeshBuilder.CreateBox('fallback-progress', { 
            width,
            height: meshHeight,
            depth: meshDepth
        }, scene);
        progressBox.parent = node;
        progressBox.position = new Vector3(width / 2, 0, 0);;
        progressBox.setPivotMatrix(Matrix.Translation(-width, 0, 0))
        progressBox.setPreTransformMatrix(Matrix.Translation(-width /2 , 0, 0));

        const boxMat = new StandardMaterial('fallback-mat', scene!);
        boxMat.diffuseColor = barColor;
        boxMat.specularColor = Color3.Black();
        progressBox.material = boxMat;

        boxRef.current = progressBox;

        const backDepth = Math.min(depth ?? 0.1, 0.1);
        const backBox = MeshBuilder.CreateBox('fallback-back', {
            width,
            height: meshHeight,
            depth: backDepth
        }, scene);
        backBox.parent = node;
        backBox.position = new Vector3(0, 0, (meshDepth / -2) + (backDepth / -2));

        return () => {
            progressBox.dispose();
            backBox.dispose();
            node.dispose();
            boxRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (boxRef.current) {
            const progressEvent = context?.lastProgress;
            
            if (progressEvent) {
                const progressPercent = (progressEvent.lengthComputable === true)
                    ? progressEvent.loaded/progressEvent.total
                    : 0;
                boxRef.current.scaling = new Vector3(progressPercent, 1, 1);
            } else {
                boxRef.current.scaling = new Vector3(0, 1, 1);
            }
        }
    }, [boxRef, context?.lastProgress])

    return null;
}

type SceneLoaderModelProps = {
    position: Vector3
}

const SceneLoaderModels: React.FC<SceneLoaderModelProps> = ({position}) => {
    const rootUrl = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/WaterBottle/glTF/';
    const loadedWaterBottle = useSceneLoader(rootUrl, 'WaterBottle.gltf', undefined, {
        reportProgress: true,
        scaleToDimension: 2,
        onModelLoaded: (loadedModel) => {
            if (loadedModel.status === LoaderStatus.Loaded) {
                console.log('Model Loaded:', position, loadedModel);
                loadedModel.rootMesh!.position = position;
            } else {
                console.log('Model not loaded', loadedModel);
            }
        }
    });
    console.log('water bottle:', loadedWaterBottle);

    return null;
}

export default SceneLoaderModels;