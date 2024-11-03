import * as THREE from 'three';
import { build } from './curves/NURBSBuilder.js';

class Jar extends THREE.Group {

    /**
     *  Constructor for the Jar class
     * Initializes the jar with default properties.
     * 
     * @property {number} samplesU - The number of samples in the U direction.
     * @property {number} samplesV - The number of samples in the V direction.
     * @property {THREE.Material} material - The material of the jar.
     * @property {Array} meshes - The meshes of the jar.
     * @property {string} type - The type of the object.
     * 
     */
    
    constructor() {
        super();
        this.type = 'Group';
        this.jarColor = 0x0000FF;
        this.meshes = [];
        this.samplesU = 8;
        this.samplesV = 8;

        const texture = new THREE.TextureLoader().load('textures/vase.jpg');
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.anisotropy = 16;
        texture.colorSpace = THREE.SRGBColorSpace;

        this.material = new THREE.MeshLambertMaterial({
            map: texture,
            side: THREE.DoubleSide
        });

        this.createJarHalves();
        this.createBase();
    }

    createJarHalves() {
        const halfJarsControlPoints = [
            [
                [[0, 0, -2, 1], [0, 2, -3, 1], [0, 4, -0.25, 1], [0, 5, -1.5, 1]],
                [[4, 0, 0, 1], [6, 2, 0, 1], [0.5, 4, 0, 1], [2.5, 5, 0, 1]],
                [[0, 0, 2, 1], [0, 2, 3, 1], [0, 4, 0.25, 1], [0, 5, 1.5, 1]]
            ],
            [
                [[0, 0, 2, 1], [0, 2, 3, 1], [0, 4, 0.25, 1], [0, 5, 1.5, 1]],
                [[-4, 0, 0, 1], [-6, 2, 0, 1], [-0.4, 4, 0, 1], [-2.5, 5, 0, 1]],
                [[0, 0, -2, 1], [0, 2, -3, 1], [0, 4, -0.25, 1], [0, 5, -1.5, 1]]
            ]
        ];

        halfJarsControlPoints.forEach(controlPoints => {
            const surfaceData = build(controlPoints, 2, 3, this.samplesU, this.samplesV, this.material);
            const mesh = new THREE.Mesh(surfaceData, this.material);
            this.add(mesh);
            this.meshes.push(mesh);
        });
    }

    createBase() {
        const shape = new THREE.Shape();
        shape.moveTo(0, -2);
        shape.bezierCurveTo(4.5, 0, 0, 2, 0, 2);
        shape.bezierCurveTo(-4.5, 0, 0, -2, 0, -2);

        const geometry = new THREE.ShapeGeometry(shape);
        const baseMesh = new THREE.Mesh(geometry, this.material);
        baseMesh.rotateX(Math.PI / 2);
        this.add(baseMesh);
    }
}

export { Jar };
