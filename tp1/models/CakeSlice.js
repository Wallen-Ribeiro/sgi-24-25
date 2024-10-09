import * as THREE from 'three';

/**
 * This class contains a 3D cake slice
 */
class CakeSlice extends THREE.Object3D {

    /**
     * 
     * @param {float} radius Radius of cake
     * @param {float} height Height of cake
     * @param {float} slices Size of slice ( 1 / slices)
     */
    constructor(radius, height, slices) {
        super();

        const thetaStart = 2 * Math.PI * (slices - 1) / slices;
        const thetaLength = 2 * Math.PI / slices;

        const cylinderGeometry = new THREE.CylinderGeometry(radius, radius, height, 32, 1, false, thetaStart, thetaLength);
        const planeGeometry = new THREE.PlaneGeometry(radius, height);

        const cakeMaterial = new THREE.MeshPhongMaterial({
            color: "#4a2f2d", specular: "#000000", emissive: "#000000", shininess: 90
        });

        const cake = new THREE.Mesh(cylinderGeometry, cakeMaterial);
        cake.position.y = height / 2;

        const plane1 = new THREE.Mesh(planeGeometry, cakeMaterial);
        plane1.rotateY(Math.PI / 2);
        plane1.position.y = height / 2;
        plane1.position.z = radius / 2;

        const plane2 = new THREE.Mesh(planeGeometry, cakeMaterial);
        plane2.rotateY(-Math.PI / 2 + thetaStart);
        plane2.position.x = Math.sin(thetaStart) * radius / 2;
        plane2.position.y = height / 2;
        plane2.position.z = Math.cos(thetaStart) * radius / 2;

        this.add(cake);
        this.add(plane1);
        this.add(plane2);
    }
}

export { CakeSlice };