import * as THREE from 'three';
import { NURBSSurface } from 'three/addons/curves/NURBSSurface';
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';

/**
 * This class contains a 3D spriral spring
 */
class Newspaper extends THREE.Object3D {

    /**
     *
    */
    constructor() {
        super();

        this.radius = 0.1;
        this.height = 0.3;
        this.spins = 5;
        this.tubeRadius = 0.02;
        this.outerRadius = this.radius + this.tubeRadius;

        const nsControlPoints = [
            [
                new THREE.Vector4(0, 0, 0, 1),
                new THREE.Vector4(0.3, 1, 0, 1),
                new THREE.Vector4(0, 2, 0, 1)
            ],
            [
                new THREE.Vector4(1, 0, 1, 1),
                new THREE.Vector4(0.7, 1, 0.7, 1),
                new THREE.Vector4(1, 2, 1, 1),
            ],
            [
                new THREE.Vector4(1, 0, -1, 1),
                new THREE.Vector4(0.7, 1, -0.7, 1),
                new THREE.Vector4(1, 2, -1, 1)
            ],
            [
                new THREE.Vector4(0, 0, 0, 1),
                new THREE.Vector4(0.3, 1, 0, 1),
                new THREE.Vector4(0, 2, 0, 1)
            ]
        ];
        const degree1 = 3;
        const degree2 = 2;
        const knots1 = [0, 0, 0, 0, 1, 1, 1, 1];
        const knots2 = [0, 0, 0, 1, 1, 1];
        const nurbsSurface = new NURBSSurface(degree1, degree2, knots1, knots2, nsControlPoints);

        const map = new THREE.TextureLoader().load('textures/newspaper.webp');
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 16;
        map.colorSpace = THREE.SRGBColorSpace;

        function getSurfacePoint(u, v, target) {
            return nurbsSurface.getPoint(u, v, target);
        }

        const samples1 = 20;
        const samples2 = 20;
        const geometry = new ParametricGeometry(getSurfacePoint, samples1, samples2);
        const material = new THREE.MeshLambertMaterial({ map: map, side: THREE.DoubleSide });
        const object = new THREE.Mesh(geometry, material);
        const object2 = new THREE.Mesh(geometry, material);
        const object3 = new THREE.Mesh(geometry, material);
        const object4 = new THREE.Mesh(geometry, material);
        object2.position.set(0.05, 0, 0);
        object2.scale.set(0.95, 1, 0.95);
        object3.position.set(0.1, 0, 0);
        object3.scale.set(0.9, 1, 0.9);
        object4.position.set(0.15, 0, 0);
        object4.scale.set(0.85, 1, 0.85);

        this.add(object);
        this.add(object2);
        this.add(object3);
        this.add(object4);

        this.rotateY(Math.PI / 6);
        this.rotateX(Math.PI / 2);
        this.rotateY(Math.PI / 6);
    }

}

export { Newspaper };
