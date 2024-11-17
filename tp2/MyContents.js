import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { MyApp } from './MyApp.js';
/**
 *  This class contains the contents of out application
 */
class MyContents {

    /**
       constructs the object
       @param {MyApp} app The application object
    */
    constructor(app) {
        this.app = app
        this.axis = null

        this.reader = new MyFileReader(this.onSceneLoaded.bind(this));
        this.reader.open("scenes/demo/demo.json");
    }

    /**
     * initializes the contents
     */
    init() {
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }
    }

    /**
     * Called when the scene JSON file load is completed
     * @param {Object} data with the entire scene object
     */
    onSceneLoaded(data) {
        console.info("YASF loaded.")
        this.onAfterSceneLoadedAndBeforeRender(data);
    }

    printYASF(data, indent = '') {
        for (let key in data) {
            if (typeof data[key] === 'object' && data[key] !== null) {
                console.log(`${indent}${key}:`);
                this.printYASF(data[key], indent + '\t');
            } else {
                console.log(`${indent}${key}: ${data[key]}`);
            }
        }
    }

    onAfterSceneLoadedAndBeforeRender(data) {
        //this.printYASF(data)
        console.log(data);
        this.app.scene.add(data.scene);
        this.app.scene.add(data.ambientLight);
        //this.addCameras(data.cameras, data.activeCamera);
    }

    addCameras(cameras, activeCamera) {
        console.log(cameras);
        Object.keys(cameras).forEach((cameraId) => {
            this.app.cameras[cameraId] = cameras[cameraId];
        });

        console.log(this.app.cameras[activeCamera])
        this.app.setActiveCamera(this.app.cameras[activeCamera]);
    }

    update() {
    }
}

export { MyContents };
