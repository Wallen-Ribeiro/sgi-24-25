import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { Cake } from './models/Cake.js'
import { CakeSlice } from './models/CakeSlice.js';
import { Plate } from './models/Plate.js';
import { Table } from './models/Table.js';
import { Candle } from './models/Candle.js';
import { Room } from './models/Room.js';
import { Window } from './models/Window.js';
import { Painting } from './models/Painting.js';
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

        // box related attributes
        this.boxMesh = null
        this.boxMeshSize = 1.0
        this.boxEnabled = true
        this.lastBoxEnabled = null
        this.boxDisplacement = new THREE.Vector3(0, 2, 0)

        // plane related attributes
        this.diffusePlaneColor = "#00ffff"
        this.specularPlaneColor = "#777777"
        this.planeShininess = 30
        this.planeMaterial = new THREE.MeshPhongMaterial({
            color: this.diffusePlaneColor,
            specular: this.specularPlaneColor, emissive: "#000000", shininess: this.planeShininess
        })
    }

    /**
     * builds the box mesh with material assigned
     */
    buildBox() {
        let boxMaterial = new THREE.MeshPhongMaterial({
            color: "#ffff77",
            specular: "#000000", emissive: "#000000", shininess: 90
        })

        // Create a Cube Mesh with basic material
        let box = new THREE.BoxGeometry(this.boxMeshSize, this.boxMeshSize, this.boxMeshSize);
        this.boxMesh = new THREE.Mesh(box, boxMaterial);
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
        const pointLight = new THREE.PointLight(0xffffff, 50, 0);
        pointLight.position.set(0, 9, 0);
        this.app.scene.add(pointLight);

        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
        this.app.scene.add(pointLightHelper);

        // add an ambient light
        const ambientLight = new THREE.AmbientLight(0x555555);
        this.app.scene.add(ambientLight);

        this.buildBox()

        // Create a Plane Mesh with basic material

        let plane = new THREE.PlaneGeometry(10, 10);
        this.planeMesh = new THREE.Mesh(plane, this.planeMaterial);
        this.planeMesh.rotation.x = -Math.PI / 2;
        this.planeMesh.position.y = -0;
        //this.app.scene.add( this.planeMesh );

        this.buildRoom();
        this.buildTable();
        this.buildCakeAndPlate();
        this.buildWindow();
        this.buildPaintings();
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
                //this.app.scene.add(this.boxMesh)
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

    buildCandle() {

    }

    buildCakeAndPlate() {
        this.cake = new Cake(0.6, 0.3, 6);
        this.cakeSlice = new CakeSlice(0.6, 0.3, 6);
        this.plate = new Plate(0.6);
        this.candle = new Candle();


        this.plate.add(this.cakeSlice);
        this.cakeSlice.position.set(0.2, this.plate.height, -0.3);
        this.plate.position.set(-1, this.table.height, 1);

        this.cake.add(this.candle);
        this.candle.scale.set(0.3, 0.3, 0.3);
        this.candle.position.set(0, this.cake.height)
        this.cake.position.set(1, this.table.height, 0);

        this.app.scene.add(this.cake);
        this.app.scene.add(this.plate);
    }

    buildTable() {
        this.table = new Table();
        this.room.add(this.table);
    }

    buildRoom() {
        this.room = new Room(10, 10, 10);

        this.app.scene.add(this.room);
    }

    buildPaintings() {
        this.painting1 = new Painting();

        this.painting1.position.set(0, 5, -this.room.width / 2);

        this.room.add(this.painting1);
    }

    buildWindow() {
        const window = new Window();
        window.position.set(-4.8, 6, 0);
        window.rotation.y = Math.PI/2;
        this.app.scene.add(window);
    }


}

export { MyContents };
