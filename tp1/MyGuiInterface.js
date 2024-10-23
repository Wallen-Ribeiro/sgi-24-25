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
        // add a folder to the gui interface for the box
        const boxFolder = this.datgui.addFolder('Box');
        // note that we are using a property from the contents object 
        boxFolder.add(this.contents, 'boxMeshSize', 0, 10).name("size").onChange(() => { this.contents.rebuildBox() });
        boxFolder.add(this.contents, 'boxEnabled', true).name("enabled");
        boxFolder.add(this.contents.boxDisplacement, 'x', -5, 5)
        boxFolder.add(this.contents.boxDisplacement, 'y', -5, 5)
        boxFolder.add(this.contents.boxDisplacement, 'z', -5, 5)
        boxFolder.close()

        const data = {
            'diffuse color': this.contents.diffusePlaneColor,
            'specular color': this.contents.specularPlaneColor,
        };

        // adds a folder to the gui interface for the plane
        const planeFolder = this.datgui.addFolder('Plane');
        planeFolder.addColor(data, 'diffuse color').onChange((value) => { this.contents.updateDiffusePlaneColor(value) });
        planeFolder.addColor(data, 'specular color').onChange((value) => { this.contents.updateSpecularPlaneColor(value) });
        planeFolder.add(this.contents, 'planeShininess', 0, 1000).name("shininess").onChange((value) => { this.contents.updatePlaneShininess(value) });
        planeFolder.close();

        // adds a folder to the gui interface for the camera
        const cameraFolder = this.datgui.addFolder('Camera')
        cameraFolder.add(this.app, 'activeCameraName', ['Perspective', 'Left', 'Top', 'Front']).name("active camera");
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
    }
}

export { MyGuiInterface };
