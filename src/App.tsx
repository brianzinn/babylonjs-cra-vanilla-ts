import React, { Suspense, useState } from 'react';
import { Scene, Vector3, HemisphericLight, MeshBuilder,Color3 } from '@babylonjs/core';

import SceneComponent from 'babylonjs-hook';
import { AssetManagerContextProvider, SceneLoaderContextProvider } from 'react-babylonjs-loaders';

import './App.css';
import AssetManagerModels, { AssetManagerFallback } from'./AssetManagerModels';
import SceneLoaderModels, { SceneLoaderFallback} from './SceneLoaderModels';
import { MyCamera } from './MyCamera';
import { SpinningBox } from './SpinningBox';

const GROUND_SIZE = 6;

/**
 * Called once when the scene is ready.
 */
const onSceneReady = (scene: Scene) => {
  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  var light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  // Our built-in 'ground' shape.
  const ground = MeshBuilder.CreateGround("ground", { width: GROUND_SIZE, height: GROUND_SIZE }, scene);
  ground.position.y = -0.75;
}

const sceneLoaderPosition = new Vector3(0, 1.5, 0);
const boomboxPosition = new Vector3(2.5, 0.5, 0);
const avocadoPosition = new Vector3(-2.5, 0, 0);

export default () => {
  const [xyPosition, setXyPosition] = useState(8);
  // TODO: put button on @babylonjs/gui full screen
  return (<div>
    <button onClick={() => setXyPosition(xyPosition === 10 ? 6 : 10)}>zoom</button>
    <SceneComponent antialias onSceneReady={onSceneReady} id='my-canvas' renderChildrenWhenReady>
      {
      [[xyPosition/2, xyPosition/2], [xyPosition/-2, xyPosition/-2], [xyPosition/2, xyPosition/-2], [xyPosition/-2, xyPosition/2]].map((vec: number[], index: number) => (
        <SpinningBox key={`box-${index}`} position={new Vector3(vec[0], 0, vec[1])} color={index % 2 === 0 ? Color3.Red() : Color3.Blue() } />
      ))}
      <MyCamera radius={xyPosition + 2} />
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
  </div>)
}
