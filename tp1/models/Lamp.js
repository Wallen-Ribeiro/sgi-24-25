import * as THREE from 'three';

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

        this.height = 0.01;
        this.radius = 0.5;


        this.candleHeight = 0.7;
        this.stemHeight = 0.05;
        this.candleRadius = 0.15;
        this.stemRadius = 0.01;
        this.candleColor = 0xFFFFFF;
        this.stemColor = 0x000000;
        this.flameColor = 0xFF4500;

        this.createLamp();

    }

    /**
     * Create a cilinder geometry for the candle
     */
    createLamp() {
        const cilinder = new THREE.CylinderGeometry(this.radius - 0.1, this.radius, this.candleHeight, 32);
        const cilinder2 = new THREE.CylinderGeometry(this.radius - 0.1, this.radius, this.candleHeight, 32);
        const lampMaterial = new THREE.MeshPhongMaterial({color: this.candleColor});
        const lamp = new THREE.Mesh(cilinder, lampMaterial);
        this.add(lamp);
    }

}

Lamp.prototype.isGroup = true;

export { Lamp };
