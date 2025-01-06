import * as THREE from 'three';
import { Firework } from './Firework.js';

class FireworkBox extends THREE.Object3D {
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
            this.add(firework);
        }

        this.buildModel()
    }

    buildModel() {
        const geometry = new THREE.BoxGeometry(this.boxSize, this.boxHeight, this.boxSize);

        const material = new THREE.MeshToonMaterial({
            color: '#3b2820',
            emissive: '#000000'
        });

        const box = new THREE.Mesh(geometry, material);
        
        this.add(box);
    }

    update(delta) {
        this.fireworks.forEach(firework => {
            firework.update(delta);
        });
    }
}

export { FireworkBox };