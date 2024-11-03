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
import { Shelf } from './models/Shelf.js';
import { BigLamp } from './models/BigLamp.js';
import { SkyDome } from './models/SkyDome.js';
import { CerealBox } from './models/CerealBox.js';

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
     * @property {THREE.Vector3} shelfDisplacement - The displacement of the shelf
    */
    constructor(app) {
        this.app = app
        this.axis = null

        // point light related attributes
        this.pointLightPosition = new THREE.Vector3(0,10, 0)
        this.pointLightColor = "#ffffff"
        this.pointLightIntensity = 50

        // table attributes
        this.tableDisplacement = new THREE.Vector3(-2.5, 0, 0);

        // cake attributes
        this.cakeDisplacement = new THREE.Vector3(1, 0, 0);

        // shelf attributes
        this.shelfDisplacement = new THREE.Vector3(6.5, 0, -3);
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
        //this.app.scene.add(this.pointLightHelper);

        // add an ambient light
        const ambientLight = new THREE.AmbientLight(0x555555);
        this.app.scene.add(ambientLight);

        this.buildRoom();
        this.buildTable();
        this.buildCakeAndPlate();
        this.buildWindow();
        this.buildPaintings(); 
        this.buildLamp();
        this.buildBeetleFrame();
        this.buildSpring(); 
        this.buildShelf();
        this.buildVaseWithFLower();
        this.buildNewspaper();
        this.buildDoor();
        this.buildSkyDome();
        this.buildSmallVaseWithFlower();
        this.buildCerealBox();
        this.buildBigLamp();

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
        this.pointLight.position.set(...this.pointLightPosition);
        this.pointLightHelper.update();

        this.table.position.set(...this.tableDisplacement);

        this.cake.position.setX(this.cakeDisplacement.x);
        this.cake.position.setZ(this.cakeDisplacement.z); 

        this.shelf.position.set(...this.shelfDisplacement);

        this.pointLight.position.set(...this.pointLightPosition);
        this.pointLightHelper.update();
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
        this.cake.rotateY(-Math.PI / 4);

        this.table.add(this.cake);
        this.table.add(this.plate);
    }

    buildTable() {
        this.table = new Table();
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
        this.flower = new Flower(12, 0.35, 0xFFFF00, 3);
        this.app.scene.add(this.flower);
        this.jar.scale.set(0.3, 0.4, 0.3);
        this.flower.position.set(-this.room.length/3, 0, this.room.length/3);
        this.jar.position.set(-this.room.length/3 - 0.1, 0, this.room.length/3 + 0.1);
        this.app.scene.add(this.jar);
    }

    buildDoor() {
        this.door = new Door();
        this.door.position.set(0, this.room.heigth/2 - 1 , this.room.length/2 - 0.1);
        this.room.add(this.door);
    }

    buildShelf() {
        this.shelf = new Shelf();
        this.shelf.rotateY(-Math.PI / 2);
        this.room.add(this.shelf);
    }

    buildNewspaper() {
        this.newspaper = new Newspaper();
        this.shelf.add(this.newspaper);
        this.newspaper.position.set(0, this.shelf.height, 0);
    }

    buildSmallVaseWithFlower() {
        const smallJar = new Jar();
        const smallFlower = new Flower(6, 0.25, 0xFF20FF, 1);

        const smallVaseGroup = new THREE.Group();
        smallVaseGroup.add(smallJar);
        smallVaseGroup.add(smallFlower);

        smallJar.position.set(0, 0, 0);
        smallFlower.position.set(0, 2, 0);

        smallFlower.scale.set(3, 5, 3);

        smallVaseGroup.scale.set(0.2, 0.3, 0.2);
        this.shelf.add(smallVaseGroup);
        smallVaseGroup.position.set(-0.5, this.shelf.height, 0);
    }

    buildBigLamp() {
        this.lamp = new BigLamp();
        this.lamp.position.set(6.5, 0, -6.5);

        this.spotLight = new THREE.SpotLight(0xffffff);
        this.spotLight.position.set(0, 5.84, 0.35);
        this.spotLight.target.position.set(0, 0, 6);
        this.spotLight.angle = Math.PI / 6;
        this.spotLight.decay = 2;
        this.spotLight.intensity = 5;
        this.spotLight.castShadow = true;
        this.spotLight.shadow.mapSize.width = 4096;
        this.spotLight.shadow.mapSize.height = 4096;
        this.spotLight.shadow.camera.near = 0.5;

        this.lamp.add(this.spotLight);
        this.lamp.add(this.spotLight.target);  
        this.spotLightHelper = new THREE.SpotLightHelper(this.spotLight);
        //this.app.scene.add(this.spotLightHelper); 

        this.room.add(this.lamp);
    }

    buildSkyDome() {
        this.skyDome = new SkyDome('textures/paris_dome.jpg', 150);
        this.skyDome.rotateY(Math.PI);
        this.app.scene.add(this.skyDome);
    }

    buildCerealBox() {
        this.cerealBox = new CerealBox(1, 0.5, 1.5);
        this.cerealBox.rotateY(Math.PI / 6);
        this.cerealBox.rotateX(Math.PI / 2);
        this.cerealBox.position.set(-1, (this.shelf.height - this.shelf.thickness) / 2 + this.cerealBox.length / 2 + 0.001, 0);
        this.shelf.add(this.cerealBox);
    }
}

export { MyContents };