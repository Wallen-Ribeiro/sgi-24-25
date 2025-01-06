import * as THREE from 'three';
import { Mode } from './Mode.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class Garage extends Mode {
    constructor(contents) {
        super(contents);
        this.chosen1 = null;
        this.chosen2 = null;
        const balloon2 = './assets/air2.glb';
        const balloon3 = './assets/air3.glb';
        const balloon4 = './assets/air4.glb';
        const balloon6 = './assets/air6.glb';
        this.player_balloons = [ balloon2, balloon3];
        this.bot_balloons = [balloon4, balloon6];
    }

    async loadModel(path) {
        return new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            loader.load(
                path,
                (gltf) => {
                    resolve(gltf.scene);
                    console.log(`Model loaded: ${path}`);
                },
                undefined,
                (error) => {
                    reject(`Failed to load model from path: ${path}`);
                    console.error("Error loading model:", error);
                }
            );
        });
    }
    

    async initModel(path, position) {
        try {
            const model = await this.loadModel(path);
            model.position.set(position.x, position.y, position.z);
            model.scale.set(1, 1, 1);
            model.rotateY(-Math.PI / 2);
            this.contents.app.scene.add(model);
            this.mixer = new THREE.AnimationMixer(model);
            console.log("Model loaded successfully", model);
        } catch (error) {
            console.error("Failed to load model:", error);
        }
    }

    async init() {
        console.log("Garage mode initialized.");

        /*const geometry = new THREE.CircleGeometry(50, 32);
        const texture = new THREE.TextureLoader().load('image/road.jpg');
        const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
        const circle = new THREE.Mesh(geometry, material);
        circle.rotateX(Math.PI / 2);
        this.contents.app.scene.add(circle);*/

        //await this.initModel(this.player_balloons[0], { x: -15, y: 0, z: -15 });
        //await this.initModel(this.player_balloons[1], { x: 15, y: 0, z: -15 });

        //await this.initModel(this.bot_balloons[0], { x: -15, y: 0, z: 15 });
        //await this.initModel(this.bot_balloons[1], { x: 15, y: 0, z: 15 });

        console.log("Garage mode setup complete.");
    }

    update() {}

    cleanup() {}
}

export { Garage };
