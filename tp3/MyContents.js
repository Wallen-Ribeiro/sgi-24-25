import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { Ballon } from './models/Ballon.js';
import { PowerUp } from './models/PowerUp.js';

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
        this.reader.open("scene/scene.json");
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

        // clock
        this.clock = new THREE.Clock();

        // colidable objects
        this.collidableObjects = [];

        // point light
        const pointLight = new THREE.PointLight(0xffffff, 100);
        const pointLightHelper = new THREE.PointLightHelper(pointLight);
        pointLight.position.set(8, 5, 8);
        this.app.scene.add(pointLight);
        this.app.scene.add(pointLightHelper);

        // testing ballon
        this.ballon = new Ballon();
        this.app.scene.add(this.ballon);

        // testing power up
        const powerUp = new PowerUp();
        this.collidableObjects.push(powerUp);
        powerUp.position.set(15, 4, 0);
        this.app.scene.add(powerUp);

    }

    /**
     * Called when the scene JSON file load is completed
     * @param {Object} data with the entire scene object
     */
    onSceneLoaded(data) {
        this.onAfterSceneLoadedAndBeforeRender(data);
    }

    onAfterSceneLoadedAndBeforeRender(data) {
        console.log(data);
        this.app.scene.add(data.scene);
        this.app.scene.add(data.skybox);
        this.app.scene.add(data.ambientLight);
    }

    update() {
        this.ballon.update();
        this.collidableObjects.forEach(obj => {
            // check collision of ballon with collidable objects
            const distance = this.ballon.position.distanceTo(obj.position);
            const sumRadius = this.ballon.radius + obj.radius;

            if (distance < sumRadius) {
                console.log("Collision detected");
            }
        });
    }
}

export { MyContents };
