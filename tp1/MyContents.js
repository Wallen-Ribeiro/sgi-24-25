import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';

/**
 *  This class contains the contents of out application
 */
class MyContents  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app) {
        this.app = app
        this.axis = null

        // box related attributes
        this.boxMesh = null
        this.boxMeshSize = 1.0
        this.boxEnabled = true
        this.lastBoxEnabled = null
        this.boxDisplacement = new THREE.Vector3(0,2,0)

        // plane related attributes
        this.diffusePlaneColor = "rgb(128,128,128)"
        this.specularPlaneColor = "rgb(0,0,0)"
        this.planeShininess = 0
        this.planeMaterial = new THREE.MeshPhongMaterial({ color: this.diffusePlaneColor, 
            specular: this.specularPlaneColor, emissive: "#000000", shininess: this.planeShininess })
            
        // spot light related attributes
        this.spotLightColor = "#ffffff"
        this.spotLightIntensity = 15
        this.spotLightDistance = 8
        this.spotLightAngle = 40
        this.spotLightPenumbra = 0
        this.spotLightDecay = 0
        this.spotLightX = 2
        this.spotLightY = 5
        this.spotLightTargetX = 1
        this.spotLightTargetY = 0
    }

    /**
     * builds the box mesh with material assigned
     */
    buildBox() {    
        let boxMaterial = new THREE.MeshPhongMaterial({ color: "#ffff77", 
        specular: "#000000", emissive: "#000000", shininess: 90 })

        // Create a Cube Mesh with basic material
        let box = new THREE.BoxGeometry(  this.boxMeshSize,  this.boxMeshSize,  this.boxMeshSize );
        this.boxMesh = new THREE.Mesh( box, boxMaterial );
        this.boxMesh.rotation.x = -Math.PI / 2;
        this.boxMesh.position.y = this.boxDisplacement.y;
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

        // add a point light on top of the model
        // const pointLight = new THREE.PointLight( 0xffffff, 500, 0 );
        // pointLight.position.set( 0, 20, 0 );
        // this.app.scene.add( pointLight );

        // add a point light helper for the previous point light
        // const sphereSize = 0.5;
        // const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
        // this.app.scene.add( pointLightHelper );

        // const light2 = new THREE.DirectionalLight(0xffffff, 2);
        // light2.position.set(5, 10, 2);
        // light2.target.position.set(1, 0, 1);
        // this.app.scene.add(light2);
        // const handler = new THREE.DirectionalLightHelper(light2, 5);
        // this.app.scene.add(handler);

        this.spotLight = new THREE.SpotLight(this.spotLightColor, this.spotLightIntensity, this.spotLightDistance,
             this.spotLightAngle * Math.PI / 180, this.spotLightPenumbra, this.spotLightDecay);
        this.spotLight.position.set(this.spotLightX, this.spotLightY, 1);
        this.spotLight.target.position.set(this.spotLightTargetX, this.spotLightTargetY, 1);
        this.app.scene.add(this.spotLight);
        this.handler2 = new THREE.SpotLightHelper(this.spotLight);
        this.app.scene.add(this.handler2);


        // add an ambient light
        const ambientLight = new THREE.AmbientLight( 0x6f6f6f );
        this.app.scene.add( ambientLight );

        this.buildBox()
        
        // Create a Plane Mesh with basic material
        
        let plane = new THREE.PlaneGeometry( 10, 10 );
        this.planeMesh = new THREE.Mesh( plane, this.planeMaterial );
        this.planeMesh.rotation.x = -Math.PI / 2;
        this.planeMesh.position.y = -0;
        this.app.scene.add( this.planeMesh );
    }
    
    /**
     * updates the diffuse plane color and the material
     * @param {THREE.Color} value 
     */
    updateDiffusePlaneColor(value) {
        this.diffusePlaneColor = value
        this.planeMaterial.color.set(this.diffusePlaneColor)
    }
    /**
     * updates the specular plane color and the material
     * @param {THREE.Color} value 
     */
    updateSpecularPlaneColor(value) {
        this.specularPlaneColor = value
        this.planeMaterial.specular.set(this.specularPlaneColor)
    }
    /**
     * updates the plane shininess and the material
     * @param {number} value 
     */
    updatePlaneShininess(value) {
        this.planeShininess = value
        this.planeMaterial.shininess = this.planeShininess
    }

    updateSpotLightColor(value) {
        this.spotLightColor = value
        this.spotLight.color.set(this.spotLightColor)
    }

    updateSpotLightIntensity(value) {
        this.spotLightIntensity = value
        this.spotLight.intensity = this.spotLightIntensity
    }

    updateSpotLightDistance(value) {
        this.spotLightDistance = value
        this.spotLight.distance = this.spotLightDistance
        this.handler2.update()
    }

    updateSpotLightAngle(value) {
        this.spotLightAngle = value
        this.spotLight.angle = this.spotLightAngle * Math.PI / 180
        this.handler2.update()
    }

    updateSpotLightPenumbra(value) {
        this.spotLightPenumbra = value
        this.spotLight.penumbra = this.spotLightPenumbra
        this.handler2.update()
    }

    updateSpotLightDecay(value) {
        this.spotLightDecay = value
        this.spotLight.decay = this.spotLightDecay
        this.handler2.update()
    }

    updateSpotLightX(value) {
        this.spotLightX = value
        this.spotLight.position.x = this.spotLightX
        this.handler2.update()
    }

    updateSpotLightY(value) {
        this.spotLightY = value
        this.spotLight.position.y = this.spotLightY
        this.handler2.update()
    }

    updateSpotLightTargetX(value) {
        this.spotLightTargetX = value
        this.spotLight.target.position.x = this.spotLightTargetX
        this.handler2.update()
    }

    updateSpotLightTargetY(value) {
        this.spotLightTargetY = value
        this.spotLight.target.position.y = this.spotLightTargetY
        this.handler2.update()
    }

    
    /**
     * rebuilds the box mesh if required
     * this method is called from the gui interface
     */
    rebuildBox() {
        // remove boxMesh if exists
        if (this.boxMesh !== undefined && this.boxMesh !== null) {  
            this.app.scene.remove(this.boxMesh)
        }
        this.buildBox();
        this.lastBoxEnabled = null
    }
    
    /**
     * updates the box mesh if required
     * this method is called from the render method of the app
     * updates are trigered by boxEnabled property changes
     */
    updateBoxIfRequired() {
        if (this.boxEnabled !== this.lastBoxEnabled) {
            this.lastBoxEnabled = this.boxEnabled
            if (this.boxEnabled) {
                this.app.scene.add(this.boxMesh)
            }
            else {
                this.app.scene.remove(this.boxMesh)
            }
        }
    }

    /**
     * updates the contents
     * this method is called from the render method of the app
     * 
     */
    update() {
        // check if box mesh needs to be updated
        this.updateBoxIfRequired()

        // sets the box mesh position based on the displacement vector
        this.boxMesh.position.x = this.boxDisplacement.x
        this.boxMesh.position.y = this.boxDisplacement.y
        this.boxMesh.position.z = this.boxDisplacement.z
        
    }

}

export { MyContents };