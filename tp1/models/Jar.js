import * as THREE from 'three';
import { NURBSSurface } from 'three/addons/curves/NURBSSurface.js';
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js'
/**
 * This class contains a 3D Jar representation
 */
class Jar extends THREE.Object3D {

    constructor() {
        super();
        this.type = 'Group';
        this.jarColor = 0x0000FF;
        const map = new THREE.TextureLoader().load( 'textures/feup_entry.jpg' );
        map.wrapS = map.wrapT = THREE.RepeatWrapping; 
        map.anisotropy = 16; 
        map.colorSpace = THREE.SRGBColorSpace; 
        this.material = new THREE.MeshLambertMaterial( { map: map,
                        side: THREE.DoubleSide,
                        transparent: true, opacity: 0.90 } );
        this.meshes = []
        this.samplesU = 8         
        this.samplesV = 8       

        this.createHalfJar1();
        this.createHalfJar2();
        this.createBase();


    }

    createHalfJar1() {  
        
        // Define control points for a jar-like shape
        let controlPoints = [
            // U = 0
            [
                [ 0, 0, -2, 1],  
                [ 0, 2, -3, 1],
                [ 0, 4, -0.25, 1],
                [ 0, 5, -1.5, 1] // V = 3
            ],
            // U = 1
              [
                [ 4, 0,  0, 1],
                [ 6, 2,  0, 1], 
                [ 0.5, 4,  0, 1],
                [ 2.5, 5,  0,  1] // V = 3
            ],
            // U = 2
            [
                [ 0, 0,  2, 1], 
                [ 0, 2,  3, 1], 
                [ 0, 4,  0.25, 1],
                [ 0, 5, 1.5, 1] // V = 3
            ]
        ]
        
    
        const orderU = 2;
        const orderV = 3;
    
        const surfaceData = this.build(
            controlPoints, orderU, orderV, this.samplesU, this.samplesV, this.material
        );
    
        const mesh = new THREE.Mesh(surfaceData, this.material);
    
        mesh.rotation.set(0, 0, 0);
        mesh.scale.set(1, 1, 1);
        mesh.position.set(0, 0, 0);
        this.add(mesh);
        this.meshes.push(mesh);
    }

    createHalfJar2() {    
        let controlPoints = [
            // U = 0
            [
                [ 0, 0, 2, 1],  
                [ 0, 2, 3, 1],
                [ 0, 4, 0.25, 1],
                [ 0, 5, 1.5, 1] // V = 3
            ],
            // U = 1
            [
                [ -4, 0, 0, 1],
                [ -6, 2, 0, 1], 
                [ -0.4, 4, 0, 1],
                [ -2.5, 5, 0, 1] // V = 3
            ],
            // U = 2
            [
                [ 0, 0, -2, 1], 
                [ 0, 2, -3, 1], 
                [ 0, 4, -0.25, 1],
                [ 0, 5, -1.5, 1] // V = 3
            ]
        ]
        
        const orderU = 2;
        const orderV = 3;
    
        const surfaceData = this.build(
            controlPoints, orderU, orderV, this.samplesU, this.samplesV, this.material
        );
    
        const mesh = new THREE.Mesh(surfaceData, this.material);
    
        mesh.rotation.set(0, 0, 0);
        mesh.scale.set(1, 1, 1);
        mesh.position.set(0, 0, 0);
        
        this.add(mesh);
        this.meshes.push(mesh);
    }
    
    


    build(controlPoints, degree1, degree2, samples1, samples2) {
        const knots1 = []
        const knots2 = []

        // build knots1 = [ 0, 0, 0, 1, 1, 1 ];
        for (var i = 0; i <= degree1; i++) {
            knots1.push(0)
        }
        for (var i = 0; i <= degree1; i++) {
            knots1.push(1)
        }

        // build knots2 = [ 0, 0, 0, 0, 1, 1, 1, 1 ];
        for (var i = 0; i <= degree2; i++) {
            knots2.push(0)
        }
        for (var i = 0; i <= degree2; i++) {
            knots2.push(1)
        }

        let stackedPoints = []

        for (var i = 0; i < controlPoints.length; i++) {
            let row = controlPoints[i]
            let newRow = []
            for (var j = 0; j < row.length; j++) {
                let item = row[j]
                newRow.push(new THREE.Vector4(item[0],
                item[1], item[2], item[3]));
            }
            stackedPoints[i] = newRow;
        }

        const nurbsSurface = new NURBSSurface( degree1, degree2,
                                     knots1, knots2, stackedPoints );

        const geometry = new ParametricGeometry( getSurfacePoint,
                                                 samples1, samples2 );
        return geometry;

        function getSurfacePoint( u, v, target ) {
            return nurbsSurface.getPoint( u, v, target );
        }
    }

    createBase() {
        const shape = new THREE.Shape();
        shape.moveTo(0, -2);  // Start point at the bottom center
        shape.bezierCurveTo(4.5, 0, 0, 2, 0, 2);  // Right side curve
        shape.bezierCurveTo(-4.5, 0, 0, -2, 0, -2);

        const geometry = new THREE.ShapeGeometry( shape ); 
        const mesh1 = new THREE.Mesh( geometry, this.material ) ; 
        mesh1.rotateX(Math.PI/2);
        this.add( mesh1 );
    }
}

Jar.prototype.isGroup = true;

export { Jar };
