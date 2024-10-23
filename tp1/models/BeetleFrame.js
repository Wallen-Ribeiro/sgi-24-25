import * as THREE from 'three';

/**
 * This class contains a 3D beetle frame
 */

class BeetleFrame extends THREE.Object3D {

    /**
     *
    */
    constructor() {
        super();


        this.rimColor = "#8B4513";
        this.width = 4;
        this.heigth = 3;
        this.thickness = 0.2;
        this.depth = 0.05;

        this.buildFrame();
        this.buildBeetle();
    }

    buildFrame() {

        const rim1Geometry = new THREE.BoxGeometry(this.width, this.thickness, this.depth);
        const rim2Geometry = new THREE.BoxGeometry(this.thickness, this.heigth, this.depth);
        const planeGeometry = new THREE.PlaneGeometry(this.width - 2 * this.thickness, this.heigth - 2 * this.thickness);

        const rimMaterial = new THREE.MeshPhongMaterial({
            color: this.rimColor, specular: "#777777", emissive: "#000000", shininess: 0
        });
        const planeMaterial = new THREE.MeshLambertMaterial({
            color: "#ffffff"
        });

        const rim1 = new THREE.Mesh(rim1Geometry, rimMaterial);
        const rim2 = new THREE.Mesh(rim2Geometry, rimMaterial);
        const rim3 = new THREE.Mesh(rim2Geometry, rimMaterial);
        const rim4 = new THREE.Mesh(rim1Geometry, rimMaterial);
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);

        rim1.position.set(0, this.heigth / 2 - this.thickness / 2, this.depth / 2);
        rim2.position.set(this.width / 2 - this.thickness / 2, 0, this.depth / 2);
        rim3.position.set(-this.width / 2 + this.thickness / 2, 0, this.depth / 2);
        rim4.position.set(0, -this.heigth / 2 + this.thickness / 2, this.depth / 2);
        plane.position.set(0, 0, this.depth / 2);


        this.add(rim1);
        this.add(rim2);
        this.add(rim3);
        this.add(rim4);
        this.add(plane);
    }

    buildBeetle() {
        const halfCircleRatio = 4 / 3;
        const quarterCircleRatio = 4 / 3 * (Math.sqrt(2) - 1);
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

        // wheels half circles
        const radius1 = 0.50;
        const points1 = [
            new THREE.Vector2(-radius1, 0),
            new THREE.Vector2(-radius1, radius1 * halfCircleRatio),
            new THREE.Vector2(radius1, radius1 * halfCircleRatio),
            new THREE.Vector2(radius1, 0),
        ];
        const curve1 = new THREE.CubicBezierCurve(points1[0], points1[1], points1[2], points1[3]);
        const curve1Geometry = new THREE.BufferGeometry().setFromPoints(curve1.getPoints(16));

        // beetle back quarter circle
        const radius2 = 1.5;
        const points2 = [
            new THREE.Vector2(0, radius2),
            new THREE.Vector2(-radius2 * quarterCircleRatio, radius2),
            new THREE.Vector2(-radius2, radius2 * quarterCircleRatio),
            new THREE.Vector2(-radius2, 0),
        ];
        const curve2 = new THREE.CubicBezierCurve(points2[0], points2[1], points2[2], points2[3]);
        const curve2Geometry = new THREE.BufferGeometry().setFromPoints(curve2.getPoints(16));

        // beetle front quarter circles
        const radius3 = 1.5 / 2;
        const points3 = [
            new THREE.Vector2(0, radius3),
            new THREE.Vector2(radius3 * quarterCircleRatio, radius3),
            new THREE.Vector2(radius3, radius3 * quarterCircleRatio),
            new THREE.Vector2(radius3, 0),
        ];
        const curve3 = new THREE.CubicBezierCurve(points3[0], points3[1], points3[2], points3[3]);
        const curve3Geometry = new THREE.BufferGeometry().setFromPoints(curve3.getPoints(16));

        const line1 = new THREE.Line(curve1Geometry, lineMaterial);
        const line2 = new THREE.Line(curve1Geometry, lineMaterial);
        const line3 = new THREE.Line(curve2Geometry, lineMaterial);
        const line4 = new THREE.Line(curve3Geometry, lineMaterial);
        const line5 = new THREE.Line(curve3Geometry, lineMaterial);

        line1.position.set(-radius2 / 2 - radius1 / 2, -radius2 / 2, this.depth / 2 + 0.01);
        line2.position.set(+radius2 / 2 + radius1 / 2, -radius2 / 2, this.depth / 2 + 0.01);
        line3.position.set(0, -radius2 / 2, this.depth / 2 + 0.01);
        line4.position.set(0, 0, this.depth / 2 + 0.01);
        line5.position.set(radius3, -radius2 / 2, this.depth / 2 + 0.01);

        this.add(line1);
        this.add(line2);
        this.add(line3);
        this.add(line4);
        this.add(line5);
    }
}

export { BeetleFrame };
