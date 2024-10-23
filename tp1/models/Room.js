import * as THREE from 'three';

/**
 * This class contains a 3D room
 */

class Room extends THREE.Object3D {

    /**
     * 
     */
    constructor(width, length, heigth) {
        super();

        this.width = width;
        this.length = length;
        this.heigth = heigth;

        const floorGeometry = new THREE.PlaneGeometry(this.width, this.length);
        const wallGeometry1 = new THREE.PlaneGeometry(this.width, this.heigth);
        const wallGeometry2 = new THREE.PlaneGeometry(this.length, this.heigth);

        const floorTexture = new THREE.TextureLoader().load('textures/wood_tiles.jpg');
        floorTexture.wrapS = THREE.RepeatWrapping;
        floorTexture.wrapT = THREE.RepeatWrapping;
        floorTexture.repeat.set(2.5, 2.5);
        const floorMaterial = new THREE.MeshPhongMaterial({
            map: floorTexture, specular: "#777777", emissive: "#000000", shininess: 0
        });
        const wallMaterial = new THREE.MeshPhongMaterial({
            color: "#00ffff", specular: "#777777", emissive: "#000000", shininess: 0
        });
        const ceilingMaterial = new THREE.MeshLambertMaterial({
            color: "#ffffff", shininess: 0
        });

        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        const ceiling = new THREE.Mesh(floorGeometry, ceilingMaterial);
        const wall1 = new THREE.Mesh(wallGeometry1, wallMaterial);
        const wall2 = new THREE.Mesh(wallGeometry2, wallMaterial);
        const wall3 = new THREE.Mesh(wallGeometry1, wallMaterial);
        const wall4 = new THREE.Mesh(wallGeometry2, wallMaterial);

        floor.rotateX(-Math.PI / 2);

        ceiling.rotateX(Math.PI / 2);
        ceiling.position.set(0, this.heigth, 0);

        wall1.position.set(0, this.heigth / 2, -this.length / 2);
        wall2.rotateY(Math.PI / 2);
        wall2.position.set(-this.width / 2, this.heigth / 2, 0);
        wall3.rotateY(Math.PI);
        wall3.position.set(0, this.heigth / 2, this.length / 2);
        wall4.rotateY(3 * Math.PI / 2);
        wall4.position.set(this.width / 2, this.heigth / 2, 0);

        this.add(floor);
        this.add(ceiling);
        this.add(wall1);
        this.add(wall2);
        this.add(wall3);
        this.add(wall4);
    }
}

export { Room };
