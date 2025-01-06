import * as THREE from 'three';
import { Mode } from './Mode.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { TextRender } from '../models/Text.js';
import { Game } from './Game.js';


class Garage extends Mode {
    constructor(contents) {
        super(contents);
        this.chosen1 = null;
        this.chosen2 = null;
        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();
        this.selectedBalloons = [];
        this.button = null;

        const balloon2 = './assets/air2.glb';
        const balloon3 = './assets/air3.glb';
        const balloon4 = './assets/air4.glb';
        const balloon6 = './assets/air6.glb';
        this.player_balloons = [balloon2, balloon3];
        this.bot_balloons = [balloon4, balloon6];

        // Register the event listener for pointer clicks
        document.addEventListener('pointerdown', this.onPointerDown.bind(this));
        console.log("Event listener registered for pointerdown");
    }

    async loadModel(path) {
        return new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            loader.load(
                path,
                (gltf) => {
                    resolve(gltf.scene);
                },
                undefined,
                (error) => {
                    reject(error);
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
            model.name = `balloon_${position.x}_${position.z}`; 
            
            const boxGeometry = new THREE.BoxGeometry(5, 5, 5); 
            const boxMaterial = new THREE.MeshBasicMaterial({ wireframe: true, color: 0xffff00 });
            const box = new THREE.Mesh(boxGeometry, boxMaterial);
            box.position.set(position.x, position.y, position.z);
            box.name = `box_${model.name}`; 
    
            this.contents.app.scene.add(model);
            this.contents.app.scene.add(box);
    
            model.boundingBox = box;
    
            this.mixer = new THREE.AnimationMixer(model);
            console.log("Model loaded successfully", model);
        } catch (error) {
            console.error("Failed to load model:", error);
        }
    }
    
    

    async init() {
        console.log("Garage mode initialized.");

        const geometry = new THREE.CircleGeometry(50, 32);
        const texture = new THREE.TextureLoader().load('image/road.jpg');
        const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
        const circle = new THREE.Mesh(geometry, material);
        circle.rotateX(Math.PI / 2);
        this.contents.app.scene.add(circle);

        await this.initModel(this.player_balloons[0], { x: -15, y: 3, z: -15 });
        await this.initModel(this.player_balloons[1], { x: 15, y: 3, z: -15 });
        await this.initModel(this.bot_balloons[0], { x: -15, y: 3, z: 15 });
        await this.initModel(this.bot_balloons[1], { x: 15, y: 3, z: 15 });

        console.log("Garage mode setup complete.");
    }

    onPointerDown(event) {
        console.log("Pointer down event detected");
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
        this.raycaster.setFromCamera(this.pointer, this.contents.app.activeCamera);
    
        const intersects = this.raycaster.intersectObjects(this.contents.app.scene.children);
        console.log("Intersects:", intersects);
    
        if (intersects.length > 0) {
            const selectedObject = intersects[0].object;
    
            if (selectedObject.name.startsWith("box_")) {
                if (this.chosen1 === null) {
                    this.chosen1 = selectedObject;
                    this.highlightBox(this.chosen1, 0xff0000); 
                    console.log("First box chosen:", selectedObject.name);
                } else if (this.chosen2 === null && selectedObject !== this.chosen1) {
                    this.chosen2 = selectedObject;
                    this.highlightBox(this.chosen2, 0x0000ff); 
                    console.log("Second box chosen:", selectedObject.name);
                }

                if (this.chosen1 && this.chosen2 && !this.button) {
                    const bg = new THREE.BoxGeometry(50, 20, 1); 
                    const bmaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); 
                    this.button = new THREE.Mesh(bg, bmaterial); 
                    this.button.position.set(0, 10, 49);
                    this.button.userData.isClickable = true;
                    this.contents.app.scene.add(this.button);
                }
            } else if (selectedObject.userData.isClickable && selectedObject === this.button) {
                this.contents.switchMode(new Game(this.contents));
            }
        }
    }
    
    highlightBox(box, color) {
        box.material.color.setHex(color); // Change color of the bounding box
    }
    

    update() {}

    cleanup() {
        document.removeEventListener('pointerdown', this.onPointerDown.bind(this));

        const objectsToRemove = [];
        this.contents.app.scene.children.forEach(child => {
            if (child.name.startsWith('balloon_')) {
                objectsToRemove.push(child);
                if (child.boundingBox) {
                    objectsToRemove.push(child.boundingBox);
                }
            }
        });

        objectsToRemove.forEach(obj => {
            this.contents.app.scene.remove(obj);
        });

        if (this.button) {
            this.contents.app.scene.remove(this.button);
            this.button = null;
        }

        const circlesToRemove = [];
        this.contents.app.scene.children.forEach(child => {
            if (child instanceof THREE.Mesh && child.geometry instanceof THREE.CircleGeometry) {
                circlesToRemove.push(child);
            }
        });

        circlesToRemove.forEach(circle => {
            this.contents.app.scene.remove(circle);
        });

        this.chosen1 = null;
        this.chosen2 = null;
        this.selectedBalloons = [];
    }
    
}

export { Garage };
