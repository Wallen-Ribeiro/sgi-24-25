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
        // adds a folder to the gui interface for the camera
        const cameraFolder = this.datgui.addFolder('Camera')
        cameraFolder.add(this.app, 'activeCameraName', ['Outside Perspective', 'Inside Perspective', 'Left', 'Top', 'Front', 'Right', 'Back', 'Bottom', 'Table']).name("active camera").onChange((value) => {
            this.app.setActiveCamera(value);
        });
        // note that we are using a property from the app 
        cameraFolder.add(this.app.activeCamera.position, 'x', 0, 10).name("x coord")
        cameraFolder.close()

        const pointLightFolder = this.datgui.addFolder('Point Light');
        pointLightFolder.add(this.contents.pointLightPosition, 'x', -10, 10).name("x coord")
        pointLightFolder.add(this.contents.pointLightPosition, 'y', -10, 10).name("y coord")
        pointLightFolder.add(this.contents.pointLightPosition, 'z', -10, 10).name("z coord")
        pointLightFolder.add(this.contents, 'pointLightIntensity', 0, 50).name("intensity").onChange((value) => { this.contents.updatePointLightIntensity(value) });
        pointLightFolder.addColor(this.contents, 'pointLightColor').onChange((value) => { this.contents.updatePointLightColor(value) });

        const tableFolder = this.datgui.addFolder('Table');
        tableFolder.add(this.contents.tableDisplacement, 'x', -5, 5).name("x displacement")
        tableFolder.add(this.contents.tableDisplacement, 'z', -5, 5).name("z displacement")

        const cakeFolder = this.datgui.addFolder('Cake');
        cakeFolder.add(this.contents.cakeDisplacement, 'x', -2, 2).name("x displacement")
        cakeFolder.add(this.contents.cakeDisplacement, 'z', -2, 2).name("z displacement")
    
        const shelfFolder = this.datgui.addFolder('Shelf');
        shelfFolder.add(this.contents.shelfDisplacement, 'z', -3, 5).name("z displacement")
    }
}

export { MyGuiInterface };
