import React, { Component } from 'react';

import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import 'babylonjs-materials';


class Interactive extends Component {
    testFunction(){}

    render() {

        var canvas = document.getElementById("renderCanvas"); // Get the canvas element 
        var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

        /******* Add the create scene function ******/
        var createScene = function () {
            var scene = new BABYLON.Scene(engine);

            // scene.imageProcessingConfiguration.contrast = 1.6;
            // scene.imageProcessingConfiguration.exposure = 0.6;
            // scene.imageProcessingConfiguration.toneMappingEnabled = true;
        
            // Camera
            // Parameters: alpha, beta, radius, target position, scene
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);

    // Positions the camera overwriting alpha, beta, radius
        camera.setPosition(new BABYLON.Vector3(0, 0, 20));
    
    // This attaches the camera to the canvas
        camera.attachControl(canvas, true);
        
            // Light
            // var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
            // light.intensity = 0.7;

            var light = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(20, -20, -20), scene);
            light.intensity = 7;
            // light.setTarget(new BABYLON.Vector3.Zero());

            var light3 = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), scene);
        
            // Skybox
            var box = BABYLON.Mesh.CreateBox('SkyBox', 1000, scene, false, BABYLON.Mesh.BACKSIDE);
            box.material = new BABYLON.SkyMaterial('sky', scene);
            box.material.luminance = 1;
            

            box.material.inclination = 0; // The solar inclination, related to the solar azimuth in interval [0, 1]
            //box.material.azimuth = 0.42; // The solar azimuth in interval [0, 1]
        
            // Reflection probe
            var rp = new BABYLON.ReflectionProbe('ref', 512, scene);
            rp.renderList.push(box);

            // Shadows
            var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
            shadowGenerator.bias = 0.000005;
            shadowGenerator.setDarkness(0.04);
            shadowGenerator.forceBackFacesOnly = true

            // shadowGenerator.useBlurExponentialShadowMap = true;
            // shadowGenerator.useVarianceShadowMap = true;

            shadowGenerator.usePoissonSampling = true;
            shadowGenerator.usePercentageCloserFiltering = true;
            // shadowGenerator.useContactHardeningShadow = true
            
            

            

            // PBR
            const texturesUrl = `${process.env.PUBLIC_URL}/textures/`;
            var pbr_test = new BABYLON.PBRMaterial("pbr_test", scene);
            pbr_test.albedoColor = new BABYLON.Color3(1, 1, 1);
            pbr_test.reflectivityColor = new BABYLON.Color3(1.0, 1.0, 1.0);
            pbr_test.microSurface = .1; // Let the texture controls the value 
            // pbr_test.reflectionTexture = rp.cubeTexture;
            // pbr_test.reflectivityTexture = new BABYLON.Texture(texturesUrl + "sg.png", scene);
            // pbr_test.useMicroSurfaceFromReflectivityMapAlpha = true;
            // pbr_test.backFaceCulling = false;


            var mDefaultWhite = new BABYLON.PBRSpecularGlossinessMaterial("mDefaultWhite", scene);
            // mDefaultWhite.reflectionTexture = rp.cubeTexture;
            mDefaultWhite.diffuseColor = new BABYLON.Color3(.2, .2, .2);
            mDefaultWhite.environmentTexture = rp.cubeTexture;
            mDefaultWhite.glossiness = .2;

            var mDefaultGray = new BABYLON.PBRSpecularGlossinessMaterial("mDefaultGray", scene);
            // mDefaultGray.reflectionTexture = rp.cubeTexture;
            mDefaultGray.diffuseColor = new BABYLON.Color3(.2, .2, .2);
            mDefaultGray.environmentTexture = rp.cubeTexture;
            mDefaultGray.glossiness = .1;

             
             
        
            // Sphere
            var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
            sphere.position.y = 1;

            sphere.material = pbr_test;
            shadowGenerator.getShadowMap().renderList.push(sphere);

            const meshLoc = `${process.env.PUBLIC_URL}/mesh/`;

            // The first parameter can be used to specify which mesh to import. Here we import all meshes
            BABYLON.SceneLoader.ImportMesh("", meshLoc, "scheme_001.babylon", scene, function (newMeshes) {
                var i;
                for (i=0;i<newMeshes.length;i++) {
                    var objName = scene.getMeshByName(newMeshes[i].name);
                    objName.material = pbr_test;
                    
                    shadowGenerator.getShadowMap().renderList.push(objName);
                    objName.receiveShadows = true;
                };
            });

            BABYLON.SceneLoader.ImportMesh("", meshLoc, "ground_001.babylon", scene, function (newMeshes) {
                var i;
                for (i=0;i<newMeshes.length;i++) {
                    var objName = scene.getMeshByName(newMeshes[i].name);
                    objName.material = mDefaultGray;
                    
                    // shadowGenerator.getShadowMap().renderList.push(objName);
                    objName.receiveShadows = true;
                };
            });

            

            BABYLON.SceneLoader.ImportMesh("", meshLoc, "furniture_001.babylon", scene, function (newMeshes) {
                var i;
                for (i=0;i<newMeshes.length;i++) {
                    var objName = scene.getMeshByName(newMeshes[i].name);
                    objName.material = pbr_test;
                    
                    shadowGenerator.getShadowMap().renderList.push(objName);
                    objName.receiveShadows = true;
                };
            });
            

           
            // shadowGenerator.useVarianceShadowMap = true;
            
            // var shadowGenerator2 = new BABYLON.ShadowGenerator(512, light2);
            // shadowGenerator2.getShadowMap().renderList.push(torus);
            // shadowGenerator2.getShadowMap().renderList.push(torus2);
            // shadowGenerator2.useVarianceShadowMap = true;

            
        
            return scene;
        };



        /******* End of the create scene function ******/    

        var scene = createScene(); //Call the createScene function

        // Register a render loop to repeatedly render the scene
        engine.runRenderLoop(function () { 
                scene.render();
                console.log(' words');
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

