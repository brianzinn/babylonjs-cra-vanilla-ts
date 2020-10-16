import React, { useRef, useContext, useEffect } from 'react';

import { useScene } from 'babylonjs-hook';
import { Task, TaskType, AssetManagerContext, useAssetManager } from 'react-babylonjs-loaders';
import { MeshBuilder, Nullable, MeshAssetTask, Vector3 } from '@babylonjs/core';
import { AdvancedDynamicTexture, Container, Control, Rectangle, TextBlock } from '@babylonjs/gui';

type AssetManagerFallbackType = {
    barColor: string
    textColor: string
    totalControls: number
}

type ControlRefs = {
    textRef: TextBlock
    progressRect: Rectangle
    progressText: TextBlock
}

export const AssetManagerFallback: React.FC<AssetManagerFallbackType> = ({ barColor, textColor, totalControls }) => {
    const context = useContext(AssetManagerContext);
    const controlRefs = useRef<Nullable<ControlRefs>>(null);
    const scene = useScene();

    useEffect(() => {
        const plane = MeshBuilder.CreatePlane('progress', { size: 2, }, scene);
        plane.rotation.y = Math.PI;

        var adt = AdvancedDynamicTexture.CreateForMesh(plane, 1024, 1024);

        // this is so much easier to do using react-babylonjs declarative syntax!
        const borderRect = new Rectangle('main-container')
        borderRect.height = 0.25;
        borderRect.width = 1;
        borderRect.thickness = 12;
        borderRect.cornerRadius = 24;
        borderRect.background = barColor;

        const textRect = new Rectangle('text-rect');
        textRect.height = 0.7;
        textRect.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        borderRect.addControl(textRect);

        const textBlock = new TextBlock('progress-text', `loaded 0/${totalControls}`);
        // textBlock.fontFamily = 'FontAwesome';
        textBlock.fontStyle = 'bold';
        textBlock.fontSize = 200;
        textBlock.color = textColor;
        textRect.addControl(textBlock);

        const backgroundRectangle = new Rectangle('background-rectangle');
        backgroundRectangle.width = 1;
        backgroundRectangle.height = 0.3;
        backgroundRectangle.background = '#596877';
        backgroundRectangle.cornerRadius = 10;
        backgroundRectangle.thickness = 4;
        backgroundRectangle.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;

        const progressHorizontalMargin: number = 0.02;
        const progressVerticalMargin: number = 0.1;

        const progressContainer = new Container('progress-container');
        progressContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        progressContainer.width = 1 - progressHorizontalMargin;
        progressContainer.left = `${progressHorizontalMargin / 2 * 100}%`;
        progressContainer.height = `${(1 - progressVerticalMargin * 2) * 100}%`;
        backgroundRectangle.addControl(progressContainer);

        const progressRectangle = new Rectangle('progress-rectangle');
        progressRectangle.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        progressRectangle.background = '#7BC14E';
        progressRectangle.cornerRadius = 10;
        progressRectangle.thickness = 4;
        progressRectangle.width = 0;
        progressContainer.addControl(progressRectangle);

        const progressText = new TextBlock('progress-text-overlay');
        progressText.text = '0%';
        progressText.fontSize = 48;
        progressText.fontFamily = 'Arial';
        progressText.color = 'white';
        progressText.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        progressText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        backgroundRectangle.addControl(progressText);

        borderRect.addControl(backgroundRectangle);

        controlRefs.current = {
            textRef: textBlock,
            progressRect: progressRectangle,
            progressText
        }

        adt.addControl(borderRect);

        return () => {
            // timeout, otherwise full load isn't visible
            setTimeout(() => {
                adt.dispose();
                plane.dispose();
                controlRefs.current = null;
            }, 500);
        }
    }, []);

    useEffect(() => {
        if (controlRefs.current && context?.lastProgress) {
            const { eventData } = context.lastProgress!;
            controlRefs.current.textRef.text = `loaded ${eventData.totalCount - eventData.remainingCount}/${eventData.totalCount}`;

            const percentComplete = (eventData.totalCount - eventData.remainingCount) / eventData.totalCount;
            controlRefs.current.progressRect.width = percentComplete;
            controlRefs.current.progressText.text = `${(percentComplete * 100).toFixed(0)}%`
        }
    }, [controlRefs, context?.lastProgress]);

    return null;
}

const baseUrl = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/';

const modelAssetTasks: Task[] = [
    { taskType: TaskType.Mesh, rootUrl: `${baseUrl}BoomBox/glTF/`, sceneFilename: 'BoomBox.gltf', name: 'boombox' },
    { taskType: TaskType.Mesh, rootUrl: `${baseUrl}Avocado/glTF/`, sceneFilename: 'Avocado.gltf', name: 'avocado' }
];

type AssetManagerModels = {
    boomboxPosition: Vector3
    avocadoPosition: Vector3
}

const AssetManagerModels: React.FC<AssetManagerModels> = ({ boomboxPosition, avocadoPosition }) => {
    const loadedAssets = useAssetManager(modelAssetTasks);

    const boomboxTask = loadedAssets.taskNameMap['boombox'] as MeshAssetTask;
    boomboxTask.loadedMeshes[0].position = boomboxPosition;
    boomboxTask.loadedMeshes[1].scaling = new Vector3(35, 35, 35);

    const avocadoTask = loadedAssets.taskNameMap['avocado'] as MeshAssetTask;
    avocadoTask.loadedMeshes[0].position = avocadoPosition;
    avocadoTask.loadedMeshes[1].scaling = new Vector3(20, 20, 20);

    return null;
}

export default AssetManagerModels;