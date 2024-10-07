import * as THREE from 'three';

/**
 * This class contains a 3D table representation
 */
class Table extends THREE.Object3D {
    /**
     * 
     * @param {legSize} legSize the size of each leg
     * @param {legRadius} legRadius the radius of each leg
     * @param {baseWidth} baseWidth the width of the base
     * @param {baseHeight} baseHeight the height of the base
     * @param {color} color the color of the table
     */
    constructor() {
        super();
        this.type = 'Group';
        this.legSize = 2;
        this.legRadius = 0.2;
        this.baseWidth = 4;
        this.baseHeight = 0.5;
        this.color = 0x8B4513;

        this.createBase();
        this.createLegs();
    }

    /**
     * Create a box geometry for the base
     */
    createBase() {
        const box = new THREE.BoxGeometry(this.baseWidth, this.baseHeight, this.baseWidth);
        const material = new THREE.MeshPhongMaterial({ color: this.color,  specular: "#0x000000", emissive: "#0x8B4513", shininess: 100});
        const base = new THREE.Mesh(box, material);
        this.add(base);
    }

    /**
     * Create legs for the table legs
     */
    createLegs() {
        const halfWidth = this.baseWidth / 2;
        const legOffset = halfWidth - this.legRadius; 
        const legHeightOffset = -(this.baseHeight / 2 + this.legSize / 2); 
        
        const legPositions = [
            [legOffset, legHeightOffset, legOffset],  // Front right leg
            [-legOffset, legHeightOffset, legOffset], // Front left leg
            [legOffset, legHeightOffset, -legOffset], // Back right leg
            [-legOffset, legHeightOffset, -legOffset] // Back left leg
        ];
    
        legPositions.forEach(position => {
            this.createLeg(position);
        });
    }
    

    /**
     * Create a leg with the given position
     * @param {Array} position - The x, y, z position for the leg
     */
    createLeg(position) {
        const cylinder = new THREE.CylinderGeometry(this.legRadius, this.legRadius, this.legSize, 32);
        const legMaterial = new THREE.MeshPhongMaterial({ color: this.color, specular: "#0x000000", emissive: "#0x8B4513", shininess: 100});
        const leg = new THREE.Mesh(cylinder, legMaterial);
        leg.position.set(...position);
        this.add(leg);
    }
}

Table.prototype.isGroup = true;

export { Table };
