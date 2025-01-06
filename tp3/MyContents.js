import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { Ballon } from './models/Ballon.js';
import { PowerUp } from './models/PowerUp.js';
import { Track } from './models/Track.js';
import { Opponent } from './player/Opponent.js';
import { SpikeBall } from './models/SpikeBall.js';
import { Outdoor } from './models/Outdoor.js';
import { MyShader } from './MyShader.js';
import { Game } from './modes/Game.js';
import { TextRender } from './models/Text.js';

/**
 *  This class contains the contents of our application
 */
class MyContents {

    /**
       constructs the object
       @param {MyApp} app The application object
    */
    constructor(app) {
        this.app = app;
        this.axis = null;
        this.trackWidth = 10;
        this.reader = new MyFileReader(this.onSceneLoaded.bind(this));
        this.reader.open("scene/scene.json");
        this.currentMode = null;
    }

    /**
     * initializes the contents
     */
    init() {
        if (this.axis === null) {
            this.axis = new MyAxis(this);
            this.app.scene.add(this.axis);
        }

        this.clock = new THREE.Clock();

        const pointLight = new THREE.PointLight(0xffffff, 100);
        const pointLightHelper = new THREE.PointLightHelper(pointLight);
        pointLight.position.set(8, 5, 8);
        this.app.scene.add(pointLight);
        this.app.scene.add(pointLightHelper);

        const outdoor = new Outdoor();
        outdoor.position.set(-50, 10, -50);
        this.app.scene.add(outdoor);

        // testing text
        const text1 = new TextRender("Hello", 10, 15);
        text1.position.set(10, 10, 0);
        this.app.scene.add(text1);

        // Initialize the default mode (Game mode)
        this.switchMode(new Game(this));
    }

    /**
     * Switches the current mode
     * @param {Mode} newMode The new mode to switch to
     */
    switchMode(newMode) {
        if (this.currentMode) {
            this.currentMode.cleanup();
        }
        this.currentMode = newMode;
        this.currentMode.init();
    }

    /**
     * Returns the current mode
     * @returns {Mode} The current mode
     */
    getCurrentMode() {
        return this.currentMode;
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
        if (this.currentMode) {
            this.currentMode.update();
        }
    }
}

export { MyContents };
