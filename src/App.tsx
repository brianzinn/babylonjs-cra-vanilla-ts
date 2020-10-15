import React, { Suspense } from 'react';
import { Scene, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder, Mesh, Color3 } from '@babylonjs/core';

import SceneComponent from 'babylonjs-hook';
import { AssetManagerContextProvider, SceneLoaderContextProvider } from 'react-babylonjs-loaders';

import './App.css';
import AssetManagerModels, { AssetManagerFallback } from'./AssetManagerModels';
import SceneLoaderModels, { SceneLoaderFallback} from './SceneLoaderModels';

let box: Mesh | undefined;

const onSceneReady = (scene: Scene) => {
  var camera = new ArcRotateCamera('camera1', Math.PI / 2, Math.PI * 0.45, 8, Vector3.Zero(), scene);

  const canvas: HTMLCanvasElement = scene.getEngine()!.getRenderingCanvas()!;

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  var light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  // Our built-in 'box' shape.
  box = MeshBuilder.CreateBox("box", { size: 0.5 /* was 2 */ }, scene);

  // Move the box upward 1/2 its height
  box.position.y = -0.5;

  // Our built-in 'ground' shape.
  const ground = MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);
  ground.position.y = -0.75;
}

const onRender = (scene: Scene) => {
  if (box !== undefined) {
    var deltaTimeInMillis = scene.getEngine().getDeltaTime();

    const rpm = 10;
    box.rotation.y += ((rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000));
  }
}

const sceneLoaderPosition = new Vector3(0, 1.5, 0);
const boomboxPosition = new Vector3(2.5, 0.5, 0);
const avocadoPosition = new Vector3(-2.5, 0, 0);

export default () => (
  <div>
    <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} id='my-canvas' renderChildrenWhenReady>
      <AssetManagerContextProvider>
        <Suspense fallback= {<AssetManagerFallback barColor='#666666' textColor='white' totalControls={2} />}>
            <AssetManagerModels boomboxPosition={boomboxPosition} avocadoPosition={avocadoPosition} />
        </Suspense>
      </AssetManagerContextProvider>
      <SceneLoaderContextProvider>
        <Suspense fallback= {<SceneLoaderFallback position={sceneLoaderPosition} width={2} height={0.5} depth={0.2} barColor={Color3.Red()} />}>
            <SceneLoaderModels position={sceneLoaderPosition} />
        </Suspense>
      </SceneLoaderContextProvider>
    </SceneComponent>
  </div>
)
