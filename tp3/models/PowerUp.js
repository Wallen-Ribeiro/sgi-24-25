import * as THREE from 'three';

/**
* This class contains a 3D PowerUp
 */

class PowerUp extends THREE.Object3D {

    /**
     * 
     */
    constructor() {
        super();

        // animation 
        this.clock = new THREE.Clock();

        this.radius = 1.5; // collision radius

        const cube = new THREE.BoxGeometry(3, 3, 3);
        const material = new THREE.MeshToonMaterial(
            {
                color: "#0000bb",
                emissive: "#000000",
                transparent: true,
                opacity: 0.8
            });
        const powerUp = new THREE.Mesh(cube, material);
        powerUp.rotation.x = Math.PI / 4;
        powerUp.rotation.y = Math.PI / 4;

        this.add(powerUp);
    }


    update() {
    }
}

export { PowerUp };
