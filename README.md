# babylonjs-cra-vanilla-ts
babylonjs *vanilla* typescript - not reliant on `react-babylonjs` react renderer.

You can copy the code in `babylonjs-hook` if you want to avoid a dependency, but the only small dependency (104 lines) is on `babylonjs-hook`, so you can create a Babylon Scene and the context provides access to the scene for you without prop drilling.  The component will create a canvas, open and dispose automatically on mount/unmount.  Note that in the sample an onRender callback is used, but plan to bring more hooks over from main project soon (ie: `useBeforeRender`).

There is an optional dependency on `react-babylonjs-loaders`, which is a series of hooks and optional context providers for fallback progress that allow you to easily use SceneLoader and AssetManager with React Suspense.  In this sample application the `useSceneLoader` hook loads the water bottle (with download progress) and the `useAssetManager` hook loads the other 2 models, but the AssetManager can be used for textures, etc as well.

[github pages demo](https://brianzinn.github.io/babylonjs-cra-vanilla-ts/)
