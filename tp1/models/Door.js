import * as THREE from 'three';
import { build } from './curves/NURBSBuilder.js';
import { CurtainFabric } from './CurtainFabric.js';

/**
 * This class contains a 3D Door
 */

class Door extends THREE.Object3D {

    /**
      *  Constructor for the Door class
      * Initializes the door with default properties.
      *     
      * @property {number} width - The width of the door.
      * @property {number} height - The height of the door.
      * @property {number} thickness - The thickness of the door.
      * @property {number} depth - The depth of the door.
      * @property {string} type - The type of the object.
      */
    constructor() {
        super();
        this.type = 'Group';

        this.width = 4;
        this.heigth = 8;
        this.thickness = 0.5;
        this.depth = 0.05;


        this.createDoor();
    }



    createDoor() {
        const texture = new THREE.TextureLoader().load( "textures/wood.jpg" )
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        const geometry = new THREE.BoxGeometry(this.width - 0.2, this.heigth - 0.2, this.depth);
        const material = new THREE.MeshLambertMaterial({ map: texture});

        const bumpTexture = new THREE.TextureLoader().load('textures/door_bump.png')
        material.bumpMap = bumpTexture
        material.bumpScale = 0.6

        const cilinder = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 32);
        const cilinderMaterial = new THREE.MeshPhongMaterial({
            color: "#bababa", specular: "#e6e6e6", emissive: "#000000", shininess: 10
        });
        const knobBase = new THREE.Mesh( cilinder, cilinderMaterial );
        knobBase.position.setX(this.width / 2 - 0.8);
        knobBase.position.z -= 0.1
        knobBase.position.y = -0.5;
        knobBase.rotateX(Math.PI / 2);

        const cilinder2 = new THREE.CylinderGeometry(0.1, 0.1, 0.3, 32);

        const knobMiddle = new THREE.Mesh( cilinder2, cilinderMaterial );

        const knobTopGeometry = new THREE.SphereGeometry(0.15, 32, 32);
        const knobTop = new THREE.Mesh(knobTopGeometry, cilinderMaterial);
        knobTop.position.y -= 0.2;


        const door = new THREE.Mesh(geometry, material);

        door.add(knobBase);
        knobBase.add(knobMiddle);
        knobMiddle.add(knobTop);


        this.add(door);
    }
}

Door.prototype.isGroup = true;


export { Door };

