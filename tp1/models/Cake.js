import * as THREE from 'three';

/**
 * This class contains a 3D cake
 */

class Cake extends THREE.Object3D {

    /**
     * 
     */
    constructor() {
        super();

        const radius = 1;
        const height = 1;
        const slices = 6;
        const thetaLength = 2 * Math.PI * (slices - 1) / slices;

        const cylinderGeometry = new THREE.CylinderGeometry(radius, radius, height, 32, 1, false, 0, thetaLength);
        const planeGeometry = new THREE.PlaneGeometry(radius, height);

        const cakeMaterial = new THREE.MeshPhongMaterial({
            color: "#ffff77", specular: "#000000", emissive: "#000000", shininess: 90
        });

        const cake = new THREE.Mesh(cylinderGeometry, cakeMaterial);

        const plane1 = new THREE.Mesh(planeGeometry, cakeMaterial);
        plane1.rotateY(-Math.PI / 2);
        plane1.position.z = radius / 2;

        const plane2 = new THREE.Mesh(planeGeometry, cakeMaterial);
        plane2.rotateY(Math.PI / 2 + thetaLength);
        plane2.position.x = Math.sin(thetaLength) * radius / 2;
        plane2.position.z = Math.cos(thetaLength) * radius / 2;

        this.add(cake);
        this.add(plane1);
        this.add(plane2);
    }
}

export { Cake };