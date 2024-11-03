import * as THREE from 'three';

/**
 * This class contains a 3D Candle representation
 */
class Candle extends THREE.Object3D {
    /**
     * Constructor of the class Candle
     * Initializes the candle with default properties.
     * 
     * @param {number} candleHeight - The height of the candle.
     * @param {number} stemHeight - The height of the stem.
     * @param {number} candleRadius - The radius of the candle.
     * @param {number} stemRadius - The radius of the stem.
     * @param {number} candleColor - The color of the candle.
     * @param {number} stemColor - The color of the stem.
     * @param {number} flameColor - The color of the flame.
     */
    constructor() {
        super();
        this.type = 'Group';
        this.candleHeight = 0.7;
        this.stemHeight = 0.05;
        this.candleRadius = 0.15;
        this.stemRadius = 0.01;
        this.candleColor = 0xFFFFFF;
        this.stemColor = 0x000000;
        this.flameColor = 0xFF4500;

        this.createCandle();
        this.createFlame();

    }

    /**
     * Create a cilinder geometry for the candle
     */
    createCandle() {
        const cilinder = new THREE.CylinderGeometry(this.candleRadius, this.candleRadius, this.candleHeight, 32);
        const cilinder2 = new THREE.CylinderGeometry(0.05, 0.05, this.stemHeight, 32);
        const candleMaterial = new THREE.MeshToonMaterial({color: this.candleColor});
        const stemMaterial = new THREE.MeshPhongMaterial({color: this.stemColor});
        const candle = new THREE.Mesh(cilinder, candleMaterial);
        candle.castShadow = true;
        candle.receiveShadow = true
        const stem = new THREE.Mesh(cilinder2, stemMaterial);

        candle.position.y = this.candleHeight / 2;
        stem.position.y = this.candleHeight + this.stemHeight / 2;

        this.add(candle);
        this.add(stem);
    }

    /**
     * Create legs for the Candle legs
     */
    createFlame() {
        const flameHeight = 0.2;
        const cone = new THREE.ConeGeometry(0.08, flameHeight, 32);
        const flameMaterial = new THREE.MeshBasicMaterial({color: this.flameColor});
        const flame = new THREE.Mesh(cone, flameMaterial);
        flame.position.y = this.candleHeight + this.stemHeight  + flameHeight / 2;
        this.add(flame);
    }

}

Candle.prototype.isGroup = true;

export { Candle };
