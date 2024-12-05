import * as THREE from 'three';

/**
 * This class contains a 3D ballon
 */

class Ballon extends THREE.Object3D {

    /**
     * 
     */
    constructor() {
        super();


        const sphere = new THREE.SphereGeometry(10);
        const cube = new THREE.BoxGeometry(2, 2, 2);

        const ballonMaterial = new THREE.MeshToonMaterial(
            {
                color: "#ff0000",
                specular: "#000000",
                emissive: "#000000",
                shininess: 90
            });

        const casketMaterial = new THREE.MeshLambertMaterial(
            {
                color: "#553300",
                specular: "#000000",
                emissive: "#000000",
                shininess: 90
            });

        const ballon = new THREE.Mesh(sphere, ballonMaterial);
        const casket = new THREE.Mesh(cube, casketMaterial);
        casket.position.y = -11;

        this.add(ballon);
        this.add(casket);
    }
}

export { Ballon };
