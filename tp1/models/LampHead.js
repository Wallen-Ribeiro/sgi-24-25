import * as THREE from 'three';

/**
 * This class contains a 3D Lamp representation
 */
class LampHead extends THREE.Object3D {
    /**
     * 
     * @param {legSize} legSize the size of each leg
     * @param {legRadius} legRadius the radius of each leg
     * @param {baseWidth} baseWidth the width of the base
     * @param {baseHeight} baseHeight the height of the base
     * @param {color} color the color of the Lamp
     */
    constructor() {
        super();
        this.type = 'Group';

        this.baseRadius = 2;
        this.baseHeight = 0.4;

        this.lampColor = 0xFFFFFF;
        this.createTopLamp();
    }


    createTopLamp(){
        const points = []; 
        for ( let i = 0; i < 10; i ++ ) { 
            points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 10 + 5, ( i - 5 ) * 2 ) ); 
        } const geometry = new THREE.LatheGeometry( points ); 
        const material = new THREE.MeshPhongMaterial( { color: this.lampColor, side: THREE.DoubleSide } ); 
        const lathe = new THREE.Mesh( geometry, material ); 

        lathe.scale.set(0.15, 0.15, 0.15);

        lathe.position.y = 1.5;

        this.add( lathe );


        const cilinder = new THREE.CylinderGeometry(0.8, 0.8, 1, 32);
        const cilinderMaterial = new THREE.MeshPhongMaterial({
            color: "#bababa", specular: "#e6e6e6", emissive: "#000000", shininess: 10
        });
        const cilinderMesh = new THREE.Mesh( cilinder, cilinderMaterial );
        cilinderMesh.position.setY(-0.45);
        this.add(cilinderMesh);

        const lamp = new THREE.SphereGeometry(0.8, 32, 32);
        const lampMaterial = new THREE.MeshPhongMaterial( { color: 0xFFFF00, side: THREE.DoubleSide } );
        const lampMesh = new THREE.Mesh( lamp, lampMaterial );
        lampMesh.position.setY(1);
        this.add(lampMesh);

    }

}

LampHead.prototype.isGroup = true;

export { LampHead };
