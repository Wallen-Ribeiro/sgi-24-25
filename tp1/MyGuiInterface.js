import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';

/**
 * This class customizes the GUI interface for the app.
 */
class MyGuiInterface {

    /**
     * 
     * @param {MyApp} app The application object 
     */
    constructor(app) {
        this.app = app;
        this.datgui = new GUI();
        this.contents = null;
    }

    /**
     * Set the contents object
     * @param {MyContents} contents The contents object 
     */
    setContents(contents) {
        this.contents = contents;
    }

    /**
     * Initialize the GUI interface
     */
    init() {
        // Folder for Floor properties
        const floorFolder = this.datgui.addFolder('Floor');
        floorFolder.addColor(this.contents, 'diffuseFloorColor').name("Diffuse Color").onChange(value => this.contents.floorMaterial.color.set(value));
        floorFolder.addColor(this.contents, 'specularFloorColor').name("Specular Color").onChange(value => this.contents.floorMaterial.specular.set(value));
        floorFolder.add(this.contents, 'shininessFloor', 0, 100).name("Shininess").onChange(value => this.contents.floorMaterial.shininess = value);
        floorFolder.open();

        // Folder for Volume properties
        const volumeFolder = this.datgui.addFolder('Volume');
        volumeFolder.add(this.contents, 'nbrPolyg', 1, 1000, 1).name("Polygons").onChange(() => this.contents.rebuildVolume());
        volumeFolder.add(this.contents, 'volumeDimX', 1, 20).name("Volume Dim X").onChange(() => this.contents.rebuildVolume());
        volumeFolder.add(this.contents, 'volumeDimY', 1, 20).name("Volume Dim Y").onChange(() => this.contents.rebuildVolume());
        volumeFolder.add(this.contents, 'volumeDimZ', 1, 20).name("Volume Dim Z").onChange(() => this.contents.rebuildVolume());
        volumeFolder.open();

        // Folder for Light settings
        const lightFolder = this.datgui.addFolder('Lighting');
        lightFolder.add(this.contents, 'mapSize', 512, 8192).name("Shadow Map Size").onChange(value => {
            this.app.scene.traverse((obj) => {
                if (obj.isLight) {
                    obj.shadow.mapSize.set(value, value);
                    obj.shadow.map.dispose(); // required to update map size
                    obj.shadow.map = null;
                }
            });
        });
        lightFolder.open();

        // Folder for Camera properties
        const cameraFolder = this.datgui.addFolder('Camera');
        cameraFolder.add(this.app, 'activeCameraName', ['Perspective', 'Left', 'Top', 'Front']).name("Active Camera");
        cameraFolder.add(this.app.activeCamera.position, 'x', 0, 20).name("Camera X");
        cameraFolder.add(this.app.activeCamera.position, 'y', 0, 20).name("Camera Y");
        cameraFolder.add(this.app.activeCamera.position, 'z', 0, 20).name("Camera Z");
        cameraFolder.open();
    }
}

export { MyGuiInterface };
