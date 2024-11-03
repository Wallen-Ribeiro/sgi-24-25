import * as THREE from 'three';

/**
 * This class contains a 3D cake (missing a slice)
 */

class Cake extends THREE.Object3D {

    /**
     * 
     * @param {float} radius Radius of cake
     * @param {float} height Height of cake
     * @param {float} slices Size of slices 
     */
    constructor(radius, height, slices) {
        super();

        this.height = height;
        const thetaLength = 2 * Math.PI * (slices - 1) / slices;

        const cylinderGeometry = new THREE.CylinderGeometry(radius, radius, height, 32, 1, false, 0, thetaLength);
        const planeGeometry = new THREE.PlaneGeometry(radius, height);



        const cakeMaterial = new THREE.MeshPhongMaterial({
            color: "#4a2f2d", specular: "#000000", emissive: "#000000", shininess: 90
        });

        const cake = new THREE.Mesh(cylinderGeometry, cakeMaterial);
        cake.castShadow = true;
        cake.receiveShadow = true;
        cake.position.y = height / 2;

        const plane1 = new THREE.Mesh(planeGeometry, cakeMaterial);
        cake.castShadow = true;
        cake.receiveShadow = true;
        plane1.rotateY(-Math.PI / 2);
        plane1.position.z = radius / 2;
        plane1.position.y = height / 2;

        const plane2 = new THREE.Mesh(planeGeometry, cakeMaterial);
        cake.castShadow = true;
        cake.receiveShadow = true;
        plane2.rotateY(Math.PI / 2 + thetaLength);
        plane2.position.x = Math.sin(thetaLength) * radius / 2;
        plane2.position.y = height / 2;
        plane2.position.z = Math.cos(thetaLength) * radius / 2;

        this.add(cake);
        this.add(plane1);
        this.add(plane2);
    }
}

export { Cake };