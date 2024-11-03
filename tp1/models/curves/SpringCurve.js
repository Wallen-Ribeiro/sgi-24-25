import * as THREE from 'three';

class SpringCurve extends THREE.Curve {

    /**
     * Constructor for the SpringCurve class
     * Initializes the spring curve with default properties.
     * 
     * @param {number} radius - The radius of the spring.
     * @param {number} height - The height of the spring.
     * @param {number} spins - The number of spins in the spring.
     * @param {number} scale - The scale of the spring.
     * 
     */

    constructor(radius = 1, height = 0.5, spins = 5, scale = 1) {
        super();
        this.scale = scale;
        this.spins = spins * 2 * Math.PI;
        this.radius = radius;
        this.height = height;
    }

    getPoint(t, optionalTarget = new THREE.Vector3()) {
        const tx = this.radius * Math.cos(t * this.spins);
        const ty = t * this.height;
        const tz = this.radius * Math.sin(t * this.spins);
        return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
    }
}

export { SpringCurve };
