import * as THREE from 'three';
import { build } from './curves/NURBSBuilder.js';

class Flower extends THREE.Object3D {
    /**
     *  Constructor for the Flower class
     *  Initializes the flower with default properties.
     * 
     * @property {number} stemColor - The color of the stem.
     * @property {number} stemRadius - The radius of the stem.
     * @property {number} stemHeight - The height of the stem.
     * @property {number} petalColor - The color of the petals.
     * @property {number} headRadius - The radius of the head.
     * @property {number} receptacleColor - The color of the receptacle.
     * @property {number} petalRadius - The radius of the petals.
     * @property {number} numPetals - The number of petals.
     * @property {number} curveIntensity - The intensity of the curve.
     * 
     */
    constructor(numPetals, curveIntensity, petalColor, height) {
        super();
        this.type = 'Group';
        this.stemColor = 0x00FF22;
        this.stemRadius = 0.05; 
        this.stemHeight = height || 1; // Default stem height if not provided
        this.petalColor = petalColor || 0xFF4500; // Default petal color if not provided
        this.headRadius = 0.35;
        this.receptacleColor = 0x8B4513;
        this.petalRadius = 0.15;
        this.numPetals = numPetals || 6; // Default number of petals if not provided
        this.curveIntensity = curveIntensity || 0.35; // Default curve intensity if not provided

        this.createStem();
        this.createHead();
        this.createPetals();
    }

    /**
     * Create a tube geometry for the stem following a curved path
     */
    createStem() {
        const stemPath = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),  
            new THREE.Vector3(this.curveIntensity, this.stemHeight / 3, 0), 
            new THREE.Vector3(-this.curveIntensity, (2 * this.stemHeight) / 3, 0), 
            new THREE.Vector3(0, this.stemHeight, 0) 
        ]);

        const tubeGeometry = new THREE.TubeGeometry(stemPath, 64, this.stemRadius, 16, false);
        const material = new THREE.MeshPhongMaterial({ color: this.stemColor });
        const stem = new THREE.Mesh(tubeGeometry, material);

        stem.castShadow = true;
        stem.receiveShadow = true;

        this.add(stem);
    }

    /**
     * Create Flower head
     */
    createHead() {
        const sphere = new THREE.SphereGeometry(this.headRadius, 32, 32);
        sphere.scale(1, 0.3, 1);
        const material = new THREE.MeshToonMaterial({ color: this.receptacleColor });
        const head = new THREE.Mesh(sphere, material);
        head.position.y = this.stemHeight;

        head.castShadow = true;
        head.receiveShadow = true;

        this.add(head);
    }

    createPetal() {  
        let controlPoints = [
            [
                [ 0, 0, 0, 1],  
                [ -2, 1, 1, 1],
                [ 0, 3, -0.5, 1]
            ],
            [
                [ 0, 0,  0, 1], 
                [ 2, 1,  1, 1], 
                [ 0, 3, -0.5, 1]
            ]
        ];

        const orderU = 1;
        const orderV = 2;

        const material = new THREE.MeshPhongMaterial({ color: this.petalColor, side: THREE.DoubleSide });

        const surfaceData = build(
            controlPoints, orderU, orderV, this.samplesU, this.samplesV, material
        );

        const mesh = new THREE.Mesh(surfaceData, material);

        mesh.rotation.set(0, 0, 0);
        mesh.scale.set(1, 1, 1);
        mesh.position.set(0, 0, 0);

        mesh.rotateX(-Math.PI / 2);
        return mesh;
    }

    /**
     * Create petals around the head
     */
    createPetals() {
        const offsetDistance = this.headRadius * 0.8;

        for (let i = 0; i < this.numPetals; i++) {
            const petal = this.createPetal();
            petal.scale.set(0.3, 0.3, 0.3);

            const angle = (i / this.numPetals) * Math.PI * 2;

            petal.position.setY(this.stemHeight);
            petal.position.z = -Math.cos(angle) * offsetDistance;
            petal.position.x = -Math.sin(angle) * offsetDistance;

            petal.rotateZ(angle);

            petal.castShadow = true; 
            petal.receiveShadow = true;

            this.add(petal);
        }
    }
}

Flower.prototype.isGroup = true;

export { Flower };
