import * as THREE from 'three';
import { Firework } from './Firework.js';

class FireworkBox extends THREE.Object3D {
    /**
     * Builds a firework box
     * @param {THREE.Object3D} app The app object
     * @param {THREE.Scene} scene The scene object
     * @param {number} boxSize The size of the box
     * @param {number} boxHeight The height of the box
     * @param {number} numFireworks The number of fireworks
     * @param {number} explodeTime The time to explode
     * @returns {FireworkBox} The firework box object
     */
    constructor(app, scene, boxSize = 5, boxHeight = 2, numFireworks = 5, explodeTime = 2) {
        super();

        this.scene = scene;
        this.boxSize = boxSize;
        this.numFireworks = numFireworks;
        this.fireworks = [];
        this.explodeTime = explodeTime;

        for (let i = 0; i < this.numFireworks; i++) {
            const x = Math.random() * this.boxSize - this.boxSize / 2;
            const y = Math.random() * this.boxSize - this.boxSize / 2;
            const z = Math.random() * this.boxSize - this.boxSize / 2;

            const firework = new Firework(app, scene, this.explodeTime);
            firework.position.set([x, y, z]);
            this.fireworks.push(firework);
        }

        this.buildModel()
    }

    /**
     * Builds the firework box model
     */
    buildModel() {
        const geometry = new THREE.BoxGeometry(this.boxSize, this.boxHeight, this.boxSize);

        const material = new THREE.MeshToonMaterial({
            color: '#3b2820',
            emissive: '#000000'
        });

        const box = new THREE.Mesh(geometry, material);
        
        this.add(box);
    }

    /**
     * Updates the firework box object
     * @param {number} delta The time delta
     */
    update(delta) {
        this.fireworks.forEach(firework => {
            firework.update(delta);
        });
    }
}

export { FireworkBox };