import * as THREE from 'three';

/**
 * This class contains a 3D room
 */

class Room extends THREE.Object3D {

    /**
     * 
     */
    constructor() {
        super();

        const width = 10;
        const height = 10;
        
        const planeGeometry = new THREE.PlaneGeometry(width, height);
        const floorMaterial = new THREE.MeshPhongMaterial({
            color: "#2b1808", specular: "#777777", emissive: "#000000", shininess: 0 
        });
        const wallMaterial = new THREE.MeshPhongMaterial({
            color: "#00ffff", specular: "#777777", emissive: "#000000", shininess: 0
        });
        const ceilingMaterial = new THREE.MeshPhongMaterial({
            color: "#00ffff", specular: "#777777", emissive: "#000000", shininess: 30 
        });

        const floor = new THREE.Mesh(planeGeometry, floorMaterial);
        const ceiling = new THREE.Mesh(planeGeometry, ceilingMaterial);
        const wall1 = new THREE.Mesh(planeGeometry, wallMaterial);
        const wall2 = new THREE.Mesh(planeGeometry, wallMaterial);
        const wall3 = new THREE.Mesh(planeGeometry, wallMaterial);
        const wall4 = new THREE.Mesh(planeGeometry, wallMaterial);

        floor.rotateX(-Math.PI / 2);

        ceiling.rotateX(Math.PI / 2);
        ceiling.position.set(0, height, 0);

        wall1.position.set(0, height/2, -width/2);
        wall2.rotateY(Math.PI / 2);
        wall2.position.set(-width/2, height/2, 0);
        wall3.rotateY(Math.PI);
        wall3.position.set(0, height/2, width/2);
        wall4.rotateY(3 * Math.PI / 2);
        wall4.position.set(width/2, height/2, 0);

        this.add(floor);
        this.add(ceiling);
        this.add(wall1);
        this.add(wall2);
        this.add(wall3);
        this.add(wall4);
    }
}

export { Room };