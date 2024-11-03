import * as THREE from 'three';

/**
 * This class contains a 3D Lamp representation
 */
class LampHead extends THREE.Object3D {
    /**
     * 
     * @param {number} baseRadius the radius of the base
     * @param {number} baseHeight the height of the base
     * @param {number} lampColor the color of the Lamp
     */
    constructor(baseRadius = 2, baseHeight = 0.4, lampColor = 0xFFFFFF) {
        super();
        this.type = 'Group';

        this.baseRadius = baseRadius;
        this.baseHeight = baseHeight;
        this.lampColor = lampColor;

        this.createTopLamp();
    }

    createTopLamp() {
        const points = []; 
        for (let i = 0; i < 10; i++) { 
            points.push(new THREE.Vector2(Math.sin(i * 0.2) * 10 + 5, (i - 5) * 2)); 
        } 
        const geometry = new THREE.LatheGeometry(points); 
        const material = new THREE.MeshPhongMaterial({ color: this.lampColor, side: THREE.DoubleSide }); 
        const lathe = new THREE.Mesh(geometry, material); 

        lathe.scale.set(0.15, 0.15, 0.15);
        lathe.position.y = 1.5;
        this.add(lathe);

        const cylinder = new THREE.CylinderGeometry(0.8, 0.8, 1, 32);
        const cylinderMaterial = new THREE.MeshPhongMaterial({
            color: "#bababa", specular: "#e6e6e6", emissive: "#000000", shininess: 10
        });
        const cylinderMesh = new THREE.Mesh(cylinder, cylinderMaterial);
        cylinderMesh.position.setY(-0.45);
        this.add(cylinderMesh);

        const lamp = new THREE.SphereGeometry(0.8, 32, 32);
        const lampMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFF00, specular: "#ffffff", emissive: "#FFFF00", shininess: 10 });
        const lampMesh = new THREE.Mesh(lamp, lampMaterial);
        lampMesh.position.setY(1);
        this.add(lampMesh);
    }
}

LampHead.prototype.isGroup = true;

export { LampHead };
