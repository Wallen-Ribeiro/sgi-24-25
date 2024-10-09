import * as THREE from 'three';

/**
 * This class contains a 3D plate
 */
class Plate extends THREE.Object3D {

    /**
     * 
     * @param {float} radius Radius of plate
     */
    constructor(radius) {
        super();

        const radiusTop = radius;
        const radiusBottom = radiusTop * 2/3;
        this.height = 0.2;

        const cylinderGeometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, this.height, 32, 1, false);

        const plateMaterial = new THREE.MeshPhongMaterial({
            color: "#bababa", specular: "#e6e6e6", emissive: "#000000", shininess: 10
        });

        const plate = new THREE.Mesh(cylinderGeometry, plateMaterial);
        plate.position.y = this.height / 2;

        this.add(plate);
    }
}

export { Plate };