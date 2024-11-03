import * as THREE from 'three';
import { LampHead } from './LampHead.js';

/**
 * This class contains a 3D BigLamp representation
 */
class BigLamp extends THREE.Object3D {
    /**
     * 
     * @param {legSize} legSize the size of each leg
     * @param {legRadius} legRadius the radius of each leg
     * @param {baseWidth} baseWidth the width of the base
     * @param {baseHeight} baseHeight the height of the base
     * @param {color} color the color of the BigLamp
     */
    constructor() {
        super();
        this.type = 'Group';

        this.baseRadius = 1;
        this.baseHeight = 0.4;

        this.lampColor = 0xFFFFFF;
        this.createBaseLamp();
    }

    /**
     * Create a cylinder geometry for the lamp
     */
    createBaseLamp() {
        const cylinder = new THREE.CylinderGeometry(this.baseRadius - 0.2, this.baseRadius, this.baseHeight, 32);
        const cylinder2 = new THREE.CylinderGeometry(0.4, 0.4, 1, 32); 
        const box2 = new THREE.BoxGeometry(0.2, 5, 0.2);

        const lampMaterial = new THREE.MeshPhongMaterial({
            color: "#bababa", specular: "#e6e6e6", emissive: "#000000", shininess: 10
        });
        
        const base = new THREE.Mesh(cylinder, lampMaterial);
        const struct1 = new THREE.Mesh(cylinder2, lampMaterial); 
        const struct5 = new THREE.Mesh(box2, lampMaterial);

        struct1.position.y = this.baseHeight / 2;
        struct5.position.y = this.baseHeight + this.baseHeight * 7;

        this.add(base);
        this.add(struct1);
        this.add(struct5);

        const lampHead = new LampHead(0x000000);
        lampHead.scale.set(0.35, 0.35, 0.35);
        lampHead.position.y = this.baseHeight + 5.2;
        lampHead.position.z = 0.2;
        lampHead.rotateZ(Math.PI);
        lampHead.rotateX(Math.PI / 3);

        this.add(lampHead);
    }
}

BigLamp.prototype.isGroup = true;

export { BigLamp };
