import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MyAxis } from './MyAxis.js';
import { Cake } from './models/Cake.js'
import { CakeSlice } from './models/CakeSlice.js';
import { Plate } from './models/Plate.js';
import { Table } from './models/Table.js';
import { Candle } from './models/Candle.js';
import { Room } from './models/Room.js';
import { Window } from './models/Window.js';
import { Painting } from './models/Painting.js';
import { Lamp } from './models/Lamp.js';
import { Jar } from './models/Jar.js';
import { BeetleFrame } from './models/BeetleFrame.js';
import { Spring } from './models/Spring.js'
import { Flower } from './models/Flower.js';
import { Newspaper } from './models/Newspaper.js';
import { Door } from './models/Door.js';

/**
 *  This class contains the contents of out application
 */
class MyContents {

    /**
     * Constructor for the MyContents class
     * @param {MyApp} app - The application object
     * @property {MyApp} app - The application object
     * @property {MyAxis} axis - The axis object
     * @property {THREE.Mesh} boxMesh - The box mesh
     * @property {number} boxMeshSize - The size of the box mesh
     * @property {boolean} boxEnabled - The box enabled flag
     * @property {boolean} lastBoxEnabled - The last box enabled flag
     * @property {THREE.Vector3} boxDisplacement - The displacement of the box
     * @property {string} diffusePlaneColor - The diffuse color of the plane
     * @property {string} specularPlaneColor - The specular color of the plane
     * @property {number} planeShininess - The shininess of the plane
     * @property {THREE.MeshPhongMaterial} planeMaterial - The material of the plane
     * @property {THREE.Vector3} pointLightPosition - The position of the point light
     * @property {string} pointLightColor - The color of the point light
     * @property {number} pointLightIntensity - The intensity of the point light
     * @property {THREE.PointLight} pointLight - The point light object
     * @property {THREE.PointLightHelper} pointLightHelper - The point light helper object
     * @property {THREE.Object3D} table - The table object
     * @property {THREE.Object3D} cake - The cake object
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

        // point light related attributes
        this.pointLightPosition = new THREE.Vector3(0,10, 0)
        this.pointLightColor = "#ffffff"
        this.pointLightIntensity = 50

        // table attributes
        this.tableDisplacement = new THREE.Vector3(-2.5, 0, 0);

        // cake attributes
        this.cakeDisplacement = new THREE.Vector3(1, 0, 0);
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
        this.pointLight = new THREE.PointLight(this.pointLightColor, 50, 0);
        this.pointLight.position.set(0, 9, 0);
        this.app.scene.add(this.pointLight);

        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        this.pointLightHelper = new THREE.PointLightHelper(this.pointLight, sphereSize);
        this.app.scene.add(this.pointLightHelper);

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
        this.buildLamp();
        this.buildBeetleFrame();
        this.buildSpring(); 
        this.buildVaseWithFLower();
        this.buildNewspaper();
        this.buildDoor();

        const loader = new GLTFLoader(); 
loader.load(
    'textures/linguini.glb',
    function (gltf) {
        const model = gltf.scene;

        model.position.set(4, 0, 0); 

        model.scale.set(3, 3, 3); 

        model.rotateY(-Math.PI / 2);

        this.app.scene.add(model);
    }.bind(this),
    undefined,
    function (error) {
        console.error(error);
    }
);
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

    updatePointLightIntensity(value) {
        this.pointLightIntensity = value;
        this.pointLight.intensity = this.pointLightIntensity;
    }

    updatePointLightColor(value) {
        this.pointLightColor = value;
        this.pointLight.color.set(this.pointLightColor);
    }


    /**
     * updates the contents
     * this method is called from the render method of the app
     * 
     */
    update() {
        // check if box mesh needs to be updated
        //this.updateBoxIfRequired()

        // sets the box mesh position based on the displacement vector
        this.boxMesh.position.x = this.boxDisplacement.x
        this.boxMesh.position.y = this.boxDisplacement.y
        this.boxMesh.position.z = this.boxDisplacement.z

        this.pointLight.position.set(...this.pointLightPosition);
        this.pointLightHelper.update();

        this.table.position.set(...this.tableDisplacement);

        this.cake.position.setX(this.cakeDisplacement.x);
        this.cake.position.setZ(this.cakeDisplacement.z); 

        this.pointLight.position.set(...this.pointLightPosition);
        this.pointLightHelper.update();
    }

    buildCakeAndPlate() {
        this.cake = new Cake(0.6, 0.3, 6);
        this.cake.castShadow = true; // Enable shadow casting for the cake
        this.cakeSlice = new CakeSlice(0.6, 0.3, 6);
        this.cakeSlice.castShadow = true; // Enable shadow casting for the cake slice
        this.plate = new Plate(0.6);
        this.plate.castShadow = true; // Enable shadow casting for the plate
        this.candle = new Candle();
        this.candle.castShadow = true; // Enable shadow casting for the candle

        this.plate.add(this.cakeSlice);
        this.cakeSlice.position.set(0.2, this.plate.height, -0.3);
        this.plate.position.set(-1, this.table.height, 1);

        this.cake.add(this.candle);
        this.candle.scale.set(0.3, 0.3, 0.3);
        this.candle.position.set(0, this.cake.height)
        this.cake.position.set(1, this.table.height, 0);
        this.cake.rotateY(-Math.PI / 4);

        this.table.add(this.cake);
        this.table.add(this.plate);
        this.table.add(this.lamp)
    }

    buildTable() {
        this.table = new Table();
        this.table.receiveShadow = true; // Enable shadow receiving for the table
        this.room.add(this.table);
    }

    buildRoom() {
        this.room = new Room(15, 15, 10);

        this.app.scene.add(this.room);
    }

    buildPaintings() {
        this.painting1 = new Painting(new THREE.TextureLoader().load('textures/remi.jpg'));
        this.painting2 = new Painting(new THREE.TextureLoader().load('textures/gusteau.webp'));

        this.painting1.position.set(-2, 5, -this.room.length / 2);
        this.painting2.position.set(2, 5, -this.room.length / 2);

        this.room.add(this.painting1);
        this.room.add(this.painting2);
    }

    buildWindow() {
        this.window = new Window();
        this.window.position.set(-this.room.width / 2 + this.window.depth * 2, 5, 0);
        this.window.rotation.y = Math.PI / 2;
        this.app.scene.add(this.window);
    }

    buildLamp() {
        this.lamp = new Lamp();
        this.lamp.scale.set(0.3, 0.3, 0.3);
    
        this.lamp.position.set(-0.5, 2.5, -1.5);
        this.lamp.rotateY(-Math.PI / 4);
    
        this.spotLight = new THREE.SpotLight(0xffff00);
        this.spotLight.position.set(this.lamp.position.x + 3, this.lamp.position.y + 2.5, this.lamp.position.z + 1.5);  // Position relative to the lamp's origin
        this.spotLight.target.position.set(7, 0, 0);
        this.spotLight.angle = Math.PI / 6;
        this.spotLight.decay = 2;
        this.spotLight.intensity = 3;
        this.spotLight.castShadow = true;
        this.spotLight.shadow.mapSize.width = 4096;
        this.spotLight.shadow.mapSize.height = 4096;
        this.spotLight.shadow.camera.near = 0.5;

        this.lamp.add(this.spotLight);
        this.lamp.add(this.spotLight.target);  
        this.spotLightHelper = new THREE.SpotLightHelper(this.spotLight);
        //this.app.scene.add(this.spotLightHelper); 
    
        this.table.add(this.lamp);
    }
    
    

    buildBeetleFrame() {
        this.beetleFrame = new BeetleFrame();
        this.beetleFrame.rotateY(-Math.PI / 2);
        this.beetleFrame.position.set(this.room.width / 2, 5, 0);
        this.room.add(this.beetleFrame);
    }

    buildSpring() {
        this.spring = new Spring();

        this.spring.rotateX(-Math.PI / 2);
        this.spring.position.set(-1, this.table.height + this.spring.outerRadius, -2);
        this.table.add(this.spring);
    }

    buildVaseWithFLower(){
        this.jar = new Jar();
        this.flower = new Flower(8, 0.35, 0xFF20FF, 3);
        this.app.scene.add(this.flower);
        this.jar.scale.set(0.3, 0.4, 0.3);
        this.flower.position.set(-this.room.length/3, 0, this.room.length/3);
        this.jar.position.set(-this.room.length/3 - 0.1, 0, this.room.length/3 + 0.1);
        this.app.scene.add(this.jar);
    }

    buildNewspaper() {
        this.newspaper = new Newspaper();
        this.newspaper.position.set(0, this.table.height + 0.05, -3);
        this.table.add(this.newspaper);
    }

    buildDoor() {
        this.door = new Door();
        this.door.position.set(0, this.room.heigth/2 - 1 , this.room.length/2 - 0.1);
        this.room.add(this.door);
    }
}

export { MyContents };