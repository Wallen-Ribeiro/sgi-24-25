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
        this.baseLength = 8;
        this.color = 0x8B4513;
        this.color = 0x8a5e3e;
        this.height = this.legSize + this.baseHeight;
        this.tableTopTexture = new THREE.TextureLoader().load('textures/table_top.jpg');

        this.createBase();
        this.createLegs();
    }

    /**
     * Create a box geometry for the base
     */
    createBase() {
        const box = new THREE.BoxGeometry(this.baseWidth, this.baseHeight, this.baseLength);
        const material = new THREE.MeshPhongMaterial({ specular: "#0x000000", emissive: "#0x8B4513", shininess: 100, map: this.tableTopTexture });
        const base = new THREE.Mesh(box, material);
        base.castShadow = true;
        base.receiveShadow = true;
        
        base.position.y = this.legSize + this.baseHeight / 2;
        this.add(base);
    }

    /**
     * Create legs for the table legs
     */
    createLegs() {
        const halfWidth = this.baseWidth / 2;
        const halfLength = this.baseLength / 2;
        const legOffsetW = halfWidth - this.legRadius;
        const legOffsetL = halfLength - this.legRadius;
        const legHeightOffset = this.legSize / 2;

        const legPositions = [
            [legOffsetW, legHeightOffset, legOffsetL],  // Front right leg
            [-legOffsetW, legHeightOffset, legOffsetL], // Front left leg
            [legOffsetW, legHeightOffset, -legOffsetL], // Back right leg
            [-legOffsetW, legHeightOffset, -legOffsetL] // Back left leg
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
        const legMaterial = new THREE.MeshPhongMaterial({
            color: this.color,
            specular: 0xFFFFFF, 
            emissive: 0x5C4033, 
            shininess: 200 
        });
        const leg = new THREE.Mesh(cylinder, legMaterial);
        leg.position.set(...position);
        leg.castShadow = true;
        leg.receiveShadow = true;
        this.add(leg);
    }
}

Table.prototype.isGroup = true;

export { Table };
