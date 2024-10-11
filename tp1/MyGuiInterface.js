import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';

/**
    This class customizes the gui interface for the app
*/
class MyGuiInterface  {

    /**
     * 
     * @param {MyApp} app The application object 
     */
    constructor(app) {
        this.app = app
        this.datgui =  new GUI();
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
        const boxFolder = this.datgui.addFolder( 'Box' );
        // note that we are using a property from the contents object 
        boxFolder.add(this.contents, 'boxMeshSize', 0, 10).name("size").onChange( () => { this.contents.rebuildBox() } );
        boxFolder.add(this.contents, 'boxEnabled', true).name("enabled");
        boxFolder.add(this.contents.boxDisplacement, 'x', -5, 5)
        boxFolder.add(this.contents.boxDisplacement, 'y', -5, 5)
        boxFolder.add(this.contents.boxDisplacement, 'z', -5, 5)
        boxFolder.open()
        
        const data = {  
            'diffuse color': this.contents.diffusePlaneColor,
            'specular color': this.contents.specularPlaneColor,
            'spotlight color': this.contents.spotLightColor
        };

        // adds a folder to the gui interface for the plane
        const planeFolder = this.datgui.addFolder( 'Plane' );
        planeFolder.addColor( data, 'diffuse color' ).onChange( (value) => { this.contents.updateDiffusePlaneColor(value) } );
        planeFolder.addColor( data, 'specular color' ).onChange( (value) => { this.contents.updateSpecularPlaneColor(value) } );
        planeFolder.add(this.contents, 'planeShininess', 0, 1000).name("shininess").onChange( (value) => { this.contents.updatePlaneShininess(value) } );
        planeFolder.open();

        const spotLightFolder = this.datgui.addFolder('SpotLight');
        spotLightFolder.addColor(data, 'spotlight color').onChange( (value) => { this.contents.updateSpotLightColor(value) } );
        spotLightFolder.add(this.contents, 'spotLightIntensity', 0, 20).name("intensity").onChange( (value) => { this.contents.updateSpotLightIntensity(value) } );
        spotLightFolder.add(this.contents, 'spotLightDistance', 0, 10).name("distance").onChange( (value) => { this.contents.updateSpotLightDistance(value) } );
        spotLightFolder.add(this.contents, 'spotLightAngle', 10, 90).name("angle").onChange( (value) => { this.contents.updateSpotLightAngle(value) } );
        spotLightFolder.add(this.contents, 'spotLightPenumbra', 0, 1).name("penumbra").onChange( (value) => { this.contents.updateSpotLightPenumbra(value) } );
        spotLightFolder.add(this.contents, 'spotLightDecay', 1, 2).name("decay").onChange( (value) => { this.contents.updateSpotLightDecay(value) } );
        spotLightFolder.add(this.contents, 'spotLightX', -10, 10).name("x coord").onChange( (value) => { this.contents.updateSpotLightX(value) } );
        spotLightFolder.add(this.contents, 'spotLightY', -10, 10).name("y coord").onChange( (value) => { this.contents.updateSpotLightY(value) } );
        spotLightFolder.add(this.contents, 'spotLightTargetX', -10, 10).name("target x coord").onChange( (value) => { this.contents.updateSpotLightTargetX(value) } );
        spotLightFolder.add(this.contents, 'spotLightTargetY', -10, 10).name("target y coord").onChange( (value) => { this.contents.updateSpotLightTargetY(value) } );


        // adds a folder to the gui interface for the camera
        const cameraFolder = this.datgui.addFolder('Camera')
        cameraFolder.add(this.app, 'activeCameraName', [ 'Perspective', 'Left', 'Top', 'Front' ] ).name("active camera");
        // note that we are using a property from the app 
        cameraFolder.add(this.app.activeCamera.position, 'x', 0, 10).name("x coord")
        cameraFolder.open()
    }
}

export { MyGuiInterface };