import * as THREE from 'three';

/**
 * This class contains a 3D painting
 */

class Painting extends THREE.Object3D {

    /**
     *
    */
    constructor(texture) {
        super();

        const rimColor = 0x8B4513;

        this.width = 3;
        this.heigth = 3;
        this.thickness = 0.2;
        this.depth = 0.05;

        const planeTexture = texture;
        const rim1Geometry = new THREE.BoxGeometry(this.width, this.thickness, this.depth);
        const rim2Geometry = new THREE.BoxGeometry(this.thickness, this.heigth, this.depth);
        const planeGeometry = new THREE.PlaneGeometry(this.width - 2 * this.thickness, this.heigth - 2 * this.thickness);

        const rimMaterial = new THREE.MeshPhongMaterial({
            color: rimColor, specular: "#777777", emissive: "#000000", shininess: 0
        });
        const planeMaterial = new THREE.MeshLambertMaterial({
            map: planeTexture
        });

        const rim1 = new THREE.Mesh(rim1Geometry, rimMaterial);
        const rim2 = new THREE.Mesh(rim2Geometry, rimMaterial);
        const rim3 = new THREE.Mesh(rim2Geometry, rimMaterial);
        const rim4 = new THREE.Mesh(rim1Geometry, rimMaterial);
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);

        rim1.position.set(0, this.heigth / 2 - this.thickness / 2, this.depth / 2);
        rim2.position.set(this.width / 2 - this.thickness / 2, 0, this.depth / 2);
        rim3.position.set(-this.width / 2 + this.thickness / 2, 0, this.depth / 2);
        rim4.position.set(0, -this.heigth / 2 + this.thickness / 2, this.depth / 2);
        plane.position.set(0, 0, this.depth / 2);


        this.add(rim1);
        this.add(rim2);
        this.add(rim3);
        this.add(rim4);
        this.add(plane);
    }
}

export { Painting };
