import * as THREE from 'three';

/**
 * This class contains a 3D room
 */

class Room extends THREE.Object3D {

    /**
     *  Constructor for the Room class
     * Initializes the room with default properties.
     * 
     * @property {number} width - The width of the room.
     * @property {number} length - The length of the room.
     * @property {number} heigth - The height of the room.
     */
    constructor(width, length, heigth, windowWidth = 3, windowHeight = 3) {
        super();

        this.width = width;
        this.length = length;
        this.heigth = heigth;
        this.windowWidth = windowWidth;
        this.windowHeight = windowHeight;

        const floorGeometry = new THREE.PlaneGeometry(this.width, this.length);
        const wallGeometry1 = new THREE.PlaneGeometry(this.width, this.heigth);
        const wallGeometry2 = new THREE.PlaneGeometry(this.length, this.heigth);

        const floorTexture = new THREE.TextureLoader().load('textures/wood_tiles.jpg');
        const wallTexture = new THREE.TextureLoader().load('textures/brick-wall.jpg');
        floorTexture.wrapS = THREE.RepeatWrapping;
        floorTexture.wrapT = THREE.RepeatWrapping;
        floorTexture.repeat.set(2.5, 2.5);
        const floorMaterial = new THREE.MeshPhongMaterial({ map: floorTexture, specular: "#777777" });
        const wallMaterial = new THREE.MeshPhongMaterial({  map: wallTexture, specular: "#777777" });
        const ceilingMaterial = new THREE.MeshLambertMaterial({ color: "#ffffff", shininess: 0});

        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.receiveShadow = true;
        const ceiling = new THREE.Mesh(floorGeometry, ceilingMaterial);
        const wall1 = new THREE.Mesh(wallGeometry1, wallMaterial);
        const wall3 = new THREE.Mesh(wallGeometry1, wallMaterial);
        const wall4 = new THREE.Mesh(wallGeometry2, wallMaterial);
        wall1.receiveShadow = true;
        wall3.receiveShadow = true;
        wall4.receiveShadow = true;

        floor.rotateX(-Math.PI / 2);

        ceiling.rotateX(Math.PI / 2);
        ceiling.position.set(0, this.heigth, 0);

        wall1.position.set(0, this.heigth / 2, -this.length / 2);
        wall3.rotateY(Math.PI);
        wall3.position.set(0, this.heigth / 2, this.length / 2);
        wall4.rotateY(3 * Math.PI / 2);
        wall4.position.set(this.width / 2, this.heigth / 2, 0);

        this.add(floor);
        this.add(ceiling);
        this.add(wall1);
        this.buildWall2Group();
        this.add(wall3);
        this.add(wall4);
    }

    buildWall2Group() {
        const wall2Group = new THREE.Group();

        const wall2TopGeometry = new THREE.PlaneGeometry(this.length, (this.heigth - this.windowHeight) / 2);
        const wall2BottomGeometry = new THREE.PlaneGeometry(this.length, (this.heigth - this.windowHeight) / 2);
        const wall2LeftGeometry = new THREE.PlaneGeometry((this.length - this.windowWidth) / 2, this.windowHeight);
        const wall2RightGeometry = new THREE.PlaneGeometry((this.length - this.windowWidth) / 2, this.windowHeight);

        const heightOffset = ((this.heigth - this.windowHeight) / 2) / this.heigth;
        const widthOffset = ((this.length - this.windowWidth) / 2) / this.length;
        const wall2BottomTexture = new THREE.TextureLoader().load('textures/brick-wall.jpg');
        wall2BottomTexture.wrapS = THREE.RepeatWrapping;
        wall2BottomTexture.wrapT = THREE.RepeatWrapping;
        wall2BottomTexture.repeat.set(1, heightOffset);
        wall2BottomTexture.offset.set(0, 0);
        const wall2BottomMaterial = new THREE.MeshPhongMaterial({ map: wall2BottomTexture, specular: "#777777" });

        const wall2TopTexture = new THREE.TextureLoader().load('textures/brick-wall.jpg');
        wall2TopTexture.wrapS = THREE.RepeatWrapping;
        wall2TopTexture.wrapT = THREE.RepeatWrapping;
        wall2TopTexture.repeat.set(1, heightOffset);
        wall2TopTexture.offset.set(0, 1 - heightOffset);
        const wall2TopMaterial = new THREE.MeshPhongMaterial({ map: wall2TopTexture, specular: "#777777" });

        const wall2RightTexture = new THREE.TextureLoader().load('textures/brick-wall.jpg');
        wall2RightTexture.wrapS = THREE.RepeatWrapping;
        wall2RightTexture.wrapT = THREE.RepeatWrapping;
        wall2RightTexture.repeat.set(widthOffset, 1 - (2 * heightOffset));
        wall2RightTexture.offset.set(1 - widthOffset, heightOffset);
        const wall2RightMaterial = new THREE.MeshPhongMaterial({ map: wall2RightTexture, specular: "#777777" });

        const wall2LeftTexture = new THREE.TextureLoader().load('textures/brick-wall.jpg');
        wall2LeftTexture.wrapS = THREE.RepeatWrapping;
        wall2LeftTexture.wrapT = THREE.RepeatWrapping;
        wall2LeftTexture.repeat.set(widthOffset, 1 - (2 * heightOffset));
        wall2LeftTexture.offset.set(0, heightOffset);
        const wall2LeftMaterial = new THREE.MeshPhongMaterial({ map: wall2LeftTexture, specular: "#777777" });

        const wall2Top = new THREE.Mesh(wall2TopGeometry, wall2TopMaterial);
        const wall2Bottom = new THREE.Mesh(wall2BottomGeometry, wall2BottomMaterial);
        const wall2Left = new THREE.Mesh(wall2LeftGeometry, wall2LeftMaterial);
        const wall2Right = new THREE.Mesh(wall2RightGeometry, wall2RightMaterial);

        wall2Top.position.set(0, this.heigth - (this.heigth - this.windowHeight) / 4, 0);
        wall2Bottom.position.set(0, (this.heigth - this.windowHeight) / 4, 0);
        wall2Left.position.set(-(this.windowWidth + (this.length - this.windowWidth) / 2) / 2, this.heigth / 2, 0);
        wall2Right.position.set((this.windowWidth + (this.length - this.windowWidth) / 2) / 2, this.heigth / 2, 0);

        wall2Group.add(wall2Top);
        wall2Group.add(wall2Bottom);
        wall2Group.add(wall2Left);
        wall2Group.add(wall2Right);

        wall2Group.rotateY(Math.PI / 2);
        wall2Group.position.set(-this.width / 2, 0, 0);
        
        this.add(wall2Group);
    }
}

export { Room };
