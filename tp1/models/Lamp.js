import * as THREE from 'three';
import { LampHead } from './LampHead.js';

/**
 * This class contains a 3D Lamp representation
 */
class Lamp extends THREE.Object3D {
    /**
     * 
     * @param {legSize} legSize the size of each leg
     * @param {legRadius} legRadius the radius of each leg
     * @param {baseWidth} baseWidth the width of the base
     * @param {baseHeight} baseHeight the height of the base
     * @param {color} color the color of the Lamp
     */
    constructor() {
        super();
        this.type = 'Group';

        this.baseRadius = 2;
        this.baseHeight = 0.4;

        this.lampColor = 0xFFFFFF;
        this.createBaseLamp();

    }

    /**
     * Create a cilinder geometry for the candle
     */
    createBaseLamp() {
        const cilinder = new THREE.CylinderGeometry(this.baseRadius - 0.2, this.baseRadius, this.baseHeight, 32);
        const cilinder2 = new THREE.CylinderGeometry(0.7, 0.7, 1, 32); 

        const box1 = new THREE.BoxGeometry(0.5, 2, 0.5);
        const box2 = new THREE.BoxGeometry(0.5, 4, 0.5);


        const lampMaterial = new THREE.MeshPhongMaterial({
            color: "#bababa", specular: "#e6e6e6", emissive: "#000000", shininess: 10
        });
        
        const base = new THREE.Mesh(cilinder, lampMaterial);
        const struct1 = new THREE.Mesh(cilinder2, lampMaterial); 
        const struct2 = new THREE.Mesh(box1, lampMaterial);
        const struct3 = new THREE.Mesh(box1, lampMaterial);
        const struct4 = new THREE.Mesh(box1, lampMaterial);
        const struct5 = new THREE.Mesh(box2, lampMaterial);


        struct1.position.y = this.baseHeight / 2;
        struct2.position.y = this.baseHeight + 1.1;
        struct3.position.y = this.baseHeight + 1.1;
        struct4.position.y = this.baseHeight + 2.2;
        struct5.position.y = this.baseHeight + 2.9;

        struct2.position.x -= 0.6;  
        struct3.position.x += 0.5;
        struct4.position.x += 0.5;
        struct5.position.x += 0.1;


        struct2.rotateZ(Math.PI / 4);
        struct3.rotateZ(-Math.PI / 4);
        struct4.rotateZ(Math.PI / 4)
        struct5.rotateZ(-Math.PI / 4)

        this.add(base);
        this.add(struct1);
        this.add(struct2);
        this.add(struct3);
        this.add(struct4);
        this.add(struct5);


        const lampHead = new LampHead();
        lampHead.scale.set(0.8, 0.8, 0.8);
        lampHead.position.y = this.baseHeight + 4.5;
        lampHead.position.x = 1.5;
        lampHead.rotateZ( -Math.PI/1.5 );
        this.add(lampHead);
    }


}

Lamp.prototype.isGroup = true;

export { Lamp };
