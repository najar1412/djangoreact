import React, { Component } from 'react';

import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import 'babylonjs-materials';


class Interactive extends Component {
    testFunction(){}

    render() {
        // GLOBAL
        const LOC_STATIC = `${process.env.PUBLIC_URL}`;
        const LOC_MESH = `${process.env.PUBLIC_URL}/mesh/`;

        // BIND ENGINE TO DOM ELEMENT
        var canvas = document.getElementById("renderCanvas"); // Get the canvas element 
        var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

        // HELPERS
        var toneMap = function(scene, active) {
            if (active) {
                scene.imageProcessingConfiguration.toneMappingEnabled = true;
                // scene.imageProcessingConfiguration.contrast = 1.6;
                scene.imageProcessingConfiguration.exposure = 3;
            }
            
        };

        var skyBox = function(scene) {
            // SKYBOX
            var box = BABYLON.Mesh.CreateBox('SkyBox', 1000, scene, false, BABYLON.Mesh.BACKSIDE);
            box.material = new BABYLON.SkyMaterial('sky', scene);
            // SKYBOX - SKYMATERIAL CTRL
            // box.material.luminance = 1;
            box.material.inclination = 0; // The solar inclination, related to the solar azimuth in interval [0, 1]
            //box.material.azimuth = 0.42; // The solar azimuth in interval [0, 1]

            return box;
        };

        var sceneWideShadowSettings = function(shadowGen) {
            shadowGen.bias = 0.000005;
            shadowGen.setDarkness(0.1);

            shadowGen.usePoissonSampling = true;
            shadowGen.usePercentageCloserFiltering = true;
            shadowGen.useContactHardeningShadow = true
            shadowGen.forceBackFacesOnly = true
        };

        var createScene = function () {
            var scene = new BABYLON.Scene(engine);
            var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 5, new BABYLON.Vector3(0, 0, 0), scene);
            camera.wheelPrecision = 15;
            camera.setPosition(new BABYLON.Vector3(0, 0, -20));
            camera.attachControl(canvas, true);

            // ENV SETTINGS
            toneMap(scene, true);
            var skybox = skyBox(scene);
            var envreflmap = new BABYLON.ReflectionProbe('ref', 512, scene);
            envreflmap.renderList.push(skybox);

            var sun = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(-15, -15, 20), scene);
            sun.intensity = 4;
            var ambi = new BABYLON.HemisphericLight("ambi", new BABYLON.Vector3(0, -1, 0), scene);
            ambi.diffuse = new BABYLON.Color3(.1, .1, .1);
            ambi.intensity = 0.5;

            var shadowGenerator = new BABYLON.ShadowGenerator(2048, sun);
            sceneWideShadowSettings(shadowGenerator);

            // PRESET MATERIALS
            var mDefaultWhite = new BABYLON.PBRSpecularGlossinessMaterial("mDefaultWhite", scene);
            mDefaultWhite.diffuseColor = new BABYLON.Color3(.2, .2, .2);
            // mDefaultWhite.environmentTexture = envreflmap.cubeTexture;
            mDefaultWhite.glossiness = 0;

            // IMPORT/PROCESS MESHES
            BABYLON.SceneLoader.ImportMesh("", LOC_MESH, "scheme_001.gltf", scene, function (newMeshes) {
                var i;
                for (i=0;i<newMeshes.length;i++) {
                    var objName = scene.getMeshByName(newMeshes[i].name);
                    // objName.material.environmentTexture = envreflmap;
                    
                    shadowGenerator.getShadowMap().renderList.push(objName);
                    objName.receiveShadows = true;
                };
            });

            BABYLON.SceneLoader.ImportMesh("", LOC_MESH, "scheme_001_floor_001.gltf", scene, function (newMeshes) {
                var i;
                for (i=0;i<newMeshes.length;i++) {
                    var objName = scene.getMeshByName(newMeshes[i].name);
                    shadowGenerator.getShadowMap().renderList.push(objName);
                    objName.receiveShadows = true;
                    // objName.material.environmentTexture = envreflmap.cubeTexture;
                };
            });

            BABYLON.SceneLoader.ImportMesh("", LOC_MESH, "ground_001.babylon", scene, function (newMeshes) {
                var i;
                for (i=0;i<newMeshes.length;i++) {
                    var objName = scene.getMeshByName(newMeshes[i].name);
                    objName.material = mDefaultWhite;
                    
                    // shadowGenerator.getShadowMap().renderList.push(objName);
                    objName.receiveShadows = true;
                };
            });

            BABYLON.SceneLoader.ImportMesh("", LOC_MESH, "furniture_001.gltf", scene, function (newMeshes) {
                var i;
                console.log(newMeshes);
                for (i=0;i<newMeshes.length;i++) {
                    var objName = scene.getMeshByName(newMeshes[i].name);
                    // objName.material.environmentTexture = envreflmap.cubeTexture;
                    
                    shadowGenerator.getShadowMap().renderList.push(objName);
                    objName.receiveShadows = true;
                };
            });

            return scene;
        };

        /******* End of the create scene function ******/    

        var scene = createScene(); //Call the createScene function

        // Register a render loop to repeatedly render the scene
        engine.runRenderLoop(function () { 
                scene.render();
        });

        // Watch for browser/canvas resize events
        window.addEventListener("resize", function () { 
                engine.resize();
        });

        return (
            // <canvas id="renderCanvas" touch-action="none"></canvas>
            <div></div>

        );
    }
}
export default Interactive;

