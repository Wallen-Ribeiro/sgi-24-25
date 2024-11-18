import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { MyApp } from './MyApp.js';
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

        this.reader = new MyFileReader(this.onSceneLoaded.bind(this));
        this.reader.open("scenes/car/car.json");
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

        // ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.app.scene.add(ambientLight);

        // light point
        const light = new THREE.PointLight(0xffffff, 50);
        const pointLightHelper = new THREE.PointLightHelper(light);
        light.position.set(0, 5, -5);
        this.app.scene.add(light);
        this.app.scene.add(pointLightHelper);

        //this.buildSkyBox();
        //this.buildCar();

        console.log(this.app.scene.toJSON())
    }

    /**
     * Called when the scene JSON file load is completed
     * @param {Object} data with the entire scene object
     */
    onSceneLoaded(data) {
        console.info("YASF loaded.")
        this.onAfterSceneLoadedAndBeforeRender(data);
    }

    printYASF(data, indent = '') {
        for (let key in data) {
            if (typeof data[key] === 'object' && data[key] !== null) {
                console.log(`${indent}${key}:`);
                this.printYASF(data[key], indent + '\t');
            } else {
                console.log(`${indent}${key}: ${data[key]}`);
            }
        }
    }

    onAfterSceneLoadedAndBeforeRender(data) {
        //this.printYASF(data)
        console.log(data);
        this.app.scene.add(data.scene);
        //this.app.scene.add(data.skybox);
        this.app.scene.add(data.ambientLight);
        //this.addCameras(data.cameras, data.activeCamera);
    }

    addCameras(cameras, activeCamera) {
        console.log(cameras);
        Object.keys(cameras).forEach((cameraId) => {
            this.app.cameras[cameraId] = cameras[cameraId];
        });

        console.log(this.app.cameras[activeCamera])
        this.app.setActiveCamera(this.app.cameras[activeCamera]);
    }

    buildCar() {
        this.carLength = 6;
        this.carWidth = 3;
        this.carHeight = 3;
        this.carHoodLength = this.carLength / 2;
        this.carRoofLength = this.carLength - this.carHoodLength;
        this.carBezelWidth = 1 / 4;
        // red color
        this.carBodyColor = 0x8f0000;
        this.carBodySpecular = 0xffffff;
        // black wheels
        this.carWheelColor = 0x000000;
        // car bottom grey
        this.carBottomColor = 0x808080;

        this.buildCarBody();
        this.buildCarWheels();
    }

    buildCarBody() {
        const carGroup = new THREE.Group();
        this.app.scene.add(carGroup);
        carGroup.position.set(0, 0, 0);

        const carSideGeometry = new THREE.PlaneGeometry(this.carLength, this.carHeight / 2);
        const carFrontGeometry = new THREE.PlaneGeometry(this.carWidth, this.carHeight / 2);
        const carHoodGeometry = new THREE.PlaneGeometry(this.carWidth, this.carHoodLength);
        const carRoofGeometry = new THREE.PlaneGeometry(this.carWidth, this.carRoofLength);
        const carBezelGeometry = new THREE.PlaneGeometry(this.carBezelWidth, this.carHeight / 2);
        const frontCarLight = new THREE.CylinderGeometry(this.carWidth / 8, this.carWidth / 8, this.carWidth / 10, 32);
        const backCarLight = new THREE.BoxGeometry(this.carWidth / 1.2, this.carWidth / 8, this.carWidth / 15);
        const licensePlate = new THREE.PlaneGeometry(this.carWidth / 4, this.carHeight / 5);


        const materialParameters = { color: this.carBodyColor, specular: this.carBodySpecular, side: THREE.DoubleSide };
        const carMaterial = new THREE.MeshPhongMaterial(materialParameters);

        const lightMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        const frontCarLightMesh1 = new THREE.Mesh(frontCarLight, lightMaterial);
        const frontCarLightMesh2 = new THREE.Mesh(frontCarLight, lightMaterial);
        const backCarLightMesh = new THREE.Mesh(backCarLight, lightMaterial);

        const licenseTexture = new THREE.TextureLoader().load('scenes/textures/license_plate.jpg');
        const frontLicensePlateMesh = new THREE.Mesh(licensePlate,
            new THREE.MeshPhongMaterial({ map: licenseTexture, side: THREE.DoubleSide }));
        const backlicensePlateMesh = new THREE.Mesh(licensePlate,
            new THREE.MeshPhongMaterial({ map: licenseTexture, side: THREE.DoubleSide }));
        const carSideMeshRight = new THREE.Mesh(carSideGeometry, carMaterial);
        const carSideMeshLeft = new THREE.Mesh(carSideGeometry, carMaterial);
        const carFrontMesh = new THREE.Mesh(carFrontGeometry, carMaterial);
        const carBackMesh = new THREE.Mesh(carFrontGeometry, carMaterial);
        const carHoodMesh = new THREE.Mesh(carHoodGeometry, carMaterial);
        const carRoofMesh = new THREE.Mesh(carRoofGeometry, carMaterial);
        const carBezelMeshes = [];
        for (let i = 0; i < 8; i++) {
            carBezelMeshes.push(new THREE.Mesh(carBezelGeometry, carMaterial));
        }

        carSideMeshRight.rotateY(Math.PI / 2);
        carSideMeshRight.position.set(this.carWidth / 2, 0, 0);
        carSideMeshLeft.rotateY(Math.PI / 2);
        carSideMeshLeft.position.set(-this.carWidth / 2, 0, 0);
        carFrontMesh.position.set(0, 0, this.carLength / 2);
        carBackMesh.position.set(0, 0, -this.carLength / 2);
        carHoodMesh.rotateX(Math.PI / 2);
        carHoodMesh.position.set(0, this.carHeight / 4, this.carLength / 2 - this.carHoodLength / 2);
        carRoofMesh.rotateX(Math.PI / 2);
        carRoofMesh.position.set(0, 3 * this.carHeight / 4, -this.carRoofLength / 2);
        carBezelMeshes[0].position.set(this.carWidth / 2 - this.carBezelWidth / 2, this.carHeight / 2, 0);
        carBezelMeshes[1].position.set(-this.carWidth / 2 + this.carBezelWidth / 2, this.carHeight / 2, 0);
        carBezelMeshes[2].position.set(this.carWidth / 2 - this.carBezelWidth / 2, this.carHeight / 2, -this.carLength / 2);
        carBezelMeshes[3].position.set(-this.carWidth / 2 + this.carBezelWidth / 2, this.carHeight / 2, -this.carLength / 2);
        carBezelMeshes[4].rotateY(Math.PI / 2);
        carBezelMeshes[4].position.set(this.carWidth / 2, this.carHeight / 2, -this.carBezelWidth / 2);
        carBezelMeshes[5].rotateY(Math.PI / 2);
        carBezelMeshes[5].position.set(-this.carWidth / 2, this.carHeight / 2, -this.carBezelWidth / 2);
        carBezelMeshes[6].rotateY(Math.PI / 2);
        carBezelMeshes[6].position.set(this.carWidth / 2, this.carHeight / 2, -this.carLength / 2 + this.carBezelWidth / 2);
        carBezelMeshes[7].rotateY(Math.PI / 2);
        carBezelMeshes[7].position.set(-this.carWidth / 2, this.carHeight / 2, -this.carLength / 2 + this.carBezelWidth / 2);
        frontCarLightMesh1.position.set(this.carWidth / 3, 0, this.carLength / 2);
        frontCarLightMesh2.position.set(-this.carWidth / 3, 0, this.carLength / 2);
        frontCarLightMesh1.rotateX(Math.PI / 2);
        frontCarLightMesh2.rotateX(Math.PI / 2);
        backCarLightMesh.position.set(0, this.carHeight / 10, -this.carLength / 2);
        frontLicensePlateMesh.position.set(0, -this.carHeight / 10, this.carLength / 2 + 0.1);
        backlicensePlateMesh.position.set(0, -this.carHeight / 10, -this.carLength / 2 - 0.1);

        carGroup.add(carSideMeshRight);
        carGroup.add(carSideMeshLeft);
        carGroup.add(carFrontMesh);
        carGroup.add(carBackMesh);
        carGroup.add(carHoodMesh);
        carGroup.add(carRoofMesh);
        carGroup.add(...carBezelMeshes);
        carGroup.add(frontCarLightMesh1);
        carGroup.add(frontCarLightMesh2);
        carGroup.add(backCarLightMesh);
        carGroup.add(frontLicensePlateMesh);
        carGroup.add(backlicensePlateMesh);
    }

    buildCarWheels() {
        const carBottomGroup = new THREE.Group();
        this.app.scene.add(carBottomGroup);

        const wheelRadius = this.carHeight / 4;
        const wheelThickness = this.carHeight / 8;

        const wheelGeometry = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelThickness, 32);
        const carBottomGeometry = new THREE.PlaneGeometry(this.carWidth, this.carLength);

        const materialParameters = { color: this.carWheelColor };
        const materialParameters2 = { color: this.carBottomColor, side: THREE.DoubleSide };
        const wheelMaterial = new THREE.MeshPhongMaterial(materialParameters);
        const carBottomMaterial = new THREE.MeshPhongMaterial(materialParameters2);

        const carBottomMesh = new THREE.Mesh(carBottomGeometry, carBottomMaterial);
        const wheelMeshes = [];
        for (let i = 0; i < 4; i++) {
            wheelMeshes.push(new THREE.Mesh(wheelGeometry, wheelMaterial));
            wheelMeshes[i].rotateZ(Math.PI / 2);
        }

        carBottomMesh.rotateX(Math.PI / 2);
        carBottomMesh.position.set(0, -this.carHeight / 4, 0);

        const extrudingPercentage = 0.2;
        const wheelWidth = this.carWidth / 2 - wheelThickness * extrudingPercentage;
        const wheelOffset = this.carLength / 2 - wheelRadius - 0.1
        wheelMeshes[0].position.set(wheelWidth, -this.carHeight / 4, wheelOffset);
        //console.log(wheelWidth, -this.carHeight/4, wheelOffset);
        wheelMeshes[1].position.set(-wheelWidth, -this.carHeight / 4, wheelOffset);
        //console.log(-wheelWidth, -this.carHeight/4, wheelOffset);
        wheelMeshes[2].position.set(wheelWidth, -this.carHeight / 4, -wheelOffset);
        //console.log(wheelWidth, -this.carHeight/4, -wheelOffset);
        wheelMeshes[3].position.set(-wheelWidth, -this.carHeight / 4, -wheelOffset);
        //console.log(-wheelWidth, -this.carHeight/4, -wheelOffset);

        carBottomGroup.add(carBottomMesh);
        carBottomGroup.add(...wheelMeshes);
    }

    buildSkyBox() {
        const skyBoxGeometry = new THREE.BoxGeometry(500, 500, 500);
        const textureLoader = new THREE.TextureLoader();
        const skyBoxTextures = [
            textureLoader.load('scenes/car/textures/px.png'),
            textureLoader.load('scenes/car/textures/nx.png'),
            textureLoader.load('scenes/car/textures/py.png'),
            textureLoader.load('scenes/car/textures/ny.png'),
            textureLoader.load('scenes/car/textures/pz.png'),
            textureLoader.load('scenes/car/textures/nz.png')
        ];
        const skyBoxMaterials = [
            new THREE.MeshBasicMaterial({ map: skyBoxTextures[0], side: THREE.BackSide }),
            new THREE.MeshBasicMaterial({ map: skyBoxTextures[1], side: THREE.BackSide }),
            new THREE.MeshBasicMaterial({ map: skyBoxTextures[2], side: THREE.BackSide }),
            new THREE.MeshBasicMaterial({ map: skyBoxTextures[3], side: THREE.BackSide }),
            new THREE.MeshBasicMaterial({ map: skyBoxTextures[4], side: THREE.BackSide }),
            new THREE.MeshBasicMaterial({ map: skyBoxTextures[5], side: THREE.BackSide })
        ];

        const skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterials);
        this.app.scene.add(skyBox);
    }


    update() {
    }
}

export { MyContents };
