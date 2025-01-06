import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { Ballon } from './models/Ballon.js';
import { PowerUp } from './models/PowerUp.js';
import { SpikeBall } from './models/SpikeBall.js';
import { Outdoor } from './models/Outdoor.js';
import { MyShader } from './MyShader.js';

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
        this.app.scene.add(this.ballon.shadow);

        // testing power up
        const powerUp = new PowerUp();
        this.collidableObjects.push(powerUp);
        powerUp.position.set(20, 4, 0);
        this.app.scene.add(powerUp);

        // testing spikeball
        const spikeBall = new SpikeBall();
        this.collidableObjects.push(spikeBall);
        spikeBall.position.set(40, 4, 0);
        this.app.scene.add(spikeBall);
        const spikeBall1 = new SpikeBall();
        this.collidableObjects.push(spikeBall1);
        spikeBall1.position.set(60, 4, 0);
        this.app.scene.add(spikeBall1);

        // testing background
        const outdoor = new Outdoor();
        outdoor.position.set(-50, 10, -50);
        this.app.scene.add(outdoor);

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

        if(this.ballon.invencible) { // invencible -> dont check collisions
            return;
        }

        this.collidableObjects.forEach(collidable => {
            // check collision of ballon with collidable objects
            const distance = this.ballon.position.distanceTo(collidable.position);
            const sumRadius = this.ballon.radius + collidable.radius;

            if (distance < sumRadius) {
                console.log("collsion");
                this.handleCollision(this.ballon, collidable);
            }
        });
    }

    handleCollision(ballon, collidable) {
        const type = collidable.type ?? "";
        console.log(type)

        switch (type) {
            case "POWERUP":
                this.ballon.vouchers += 1;
                this.ballon.setInvencible();
                console.log(this.ballon.vouchers);

                break;
            case "OBSTACLE":
                if(this.ballon.vouchers > 0) {
                    this.ballon.vouchers -= 1;
                    this.ballon.setInvencible();
                } else {
                    this.ballon.setStunned();
                }
                console.log(this.ballon.vouchers);
                break;
            default:
                break;
        }

    }
}

export { MyContents };
