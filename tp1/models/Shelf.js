import * as THREE from 'three';

/**
 * This class contains a 3D shelf representation
 */
class Shelf extends THREE.Object3D {
    constructor(height = 3, width = 4, depth = 2, thickness = 0.1, shelves = 1, color = 0xf0f0f0) {
        super();

        this.height = height;
        this.width = width;
        this.depth = depth;
        this.thickness = thickness;
        this.shelves = shelves;
        this.color = color;

        this.texture = new THREE.TextureLoader().load('textures/shelf_wood.jpg');

        this.createShelfBox();
        this.createShelves();
    }

    createShelfBox() {
        const shelfTopBottomGeometry = new THREE.BoxGeometry(this.width, this.thickness, this.depth);
        const shelfTopBottomMaterial = new THREE.MeshPhongMaterial({ map: this.texture });
        const shelfTop = new THREE.Mesh(shelfTopBottomGeometry, shelfTopBottomMaterial);
        const shelfBottom = new THREE.Mesh(shelfTopBottomGeometry, shelfTopBottomMaterial);

        shelfTop.position.set(0, this.height - this.thickness, 0);
        shelfBottom.position.set(0, this.thickness, 0);

        shelfTop.receiveShadow = true;
        shelfTop.castShadow = true;
        shelfBottom.receiveShadow = true;
        shelfBottom.castShadow = true;

        this.add(shelfTop);
        this.add(shelfBottom);

        const shelfSidesGeometry = new THREE.BoxGeometry(this.thickness, this.height - this.thickness, this.depth);
        const shelfSidesMaterial = new THREE.MeshPhongMaterial({ map: this.texture });
        const shelfLeft = new THREE.Mesh(shelfSidesGeometry, shelfSidesMaterial);
        const shelfRight = new THREE.Mesh(shelfSidesGeometry, shelfSidesMaterial);

        shelfLeft.position.set(-this.width / 2 + this.thickness / 2, this.height / 2, 0);
        shelfRight.position.set(this.width / 2 - this.thickness / 2, this.height / 2, 0);

        shelfLeft.receiveShadow = true;
        shelfLeft.castShadow = true;
        shelfRight.receiveShadow = true;
        shelfRight.castShadow = true;

        this.add(shelfLeft);
        this.add(shelfRight);

        const shelfBackGeometry = new THREE.BoxGeometry(this.width, this.height - this.thickness, this.thickness);
        const shelfBackMaterial = new THREE.MeshPhongMaterial({ map: this.texture });
        const shelfBack = new THREE.Mesh(shelfBackGeometry, shelfBackMaterial);

        shelfBack.position.set(0, this.height / 2, -this.depth / 2 + this.thickness / 2);

        this.add(shelfBack);
    }

    createShelves() {
        const shelfGeometry = new THREE.BoxGeometry(this.width - 2 * this.thickness, this.thickness, this.depth - 2 * this.thickness);
        const shelfMaterial = new THREE.MeshPhongMaterial({ map: this.texture });

        for (let i = 0; i < this.shelves; i++) {
            const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
            shelf.position.set(0, this.height - this.thickness - (i + 1) * this.height / (this.shelves + 1), 0);
            shelf.receiveShadow = true; 
            shelf.castShadow = true;
            this.add(shelf);
        }
    }
}

export { Shelf };
