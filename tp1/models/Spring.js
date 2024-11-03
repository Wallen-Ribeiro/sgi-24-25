import * as THREE from 'three';
import { SpringCurve } from './curves/SpringCurve.js';

/**
 * This class contains a 3D spriral spring
 */

class Spring extends THREE.Object3D {

    /**
     *  Constructor for the Spring class
     * Initializes the spring with default properties.
     * 
     * @property {number} radius - The radius of the spring.
     * @property {number} height - The height of the spring.
     * @property {number} spins - The number of spins in the spring.
     * @property {number} tubeRadius - The radius of the tube.
     * @property {number} outerRadius - The outer radius of the spring.
     */

    constructor() {
        super();

        this.radius = 0.1;
        this.height = 0.3;
        this.spins = 5;
        this.tubeRadius = 0.02;
        this.outerRadius = this.radius + this.tubeRadius;

        const tubeMaterial = new THREE.MeshPhongMaterial({
            color: "#bababa", specular: "#e6e6e6", emissive: "#000000", shininess: 10
        });

        const path = new SpringCurve(this.radius, this.height, this.spins);
        const tubeGeometry = new THREE.TubeGeometry(path, 60, this.tubeRadius, 16);

        const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);

        this.add(tube);
    }

}

export { Spring };
