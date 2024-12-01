import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';

/**
    This class customizes the gui interface for the app
*/
class MyGuiInterface {

    /**
     * 
     * @param {MyApp} app The application object 
     */
    constructor(app) {
        this.app = app
        this.datgui = new GUI();
        this.contents = null
    }

    /**
     * Set the contents object
     * @param {MyContents} contents the contents objects 
     */
    setContents(contents) {
        this.contents = contents
    }

    /**
     * Initialize the gui interface
     */
    init() {
        const cameraNames = Object.keys(this.app.cameras);
        const cameraFolder = this.datgui.addFolder('Camera');
        cameraFolder.add(this.app, 'activeCameraName', cameraNames).name("active camera").onChange((value) => {
            this.app.setActiveCamera(value);
        });

        const sceneFolder = this.datgui.addFolder('Scene');
        const wireframeButton = sceneFolder.add(this.app, 'wireframe').name('wireframe').listen();
        wireframeButton.onChange((value) => {
            this.app.setWireframe(value);
        });
    }
}

export { MyGuiInterface };
