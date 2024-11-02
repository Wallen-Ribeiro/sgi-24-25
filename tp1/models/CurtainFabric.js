import * as THREE from 'three';
import { build } from './curves/NURBSBuilder.js';
/**
 * This class contains a 3D CurtainFabric representation
 */
class CurtainFabric extends THREE.Object3D {

    constructor() {
        super();
        this.type = 'Group';
        const map = new THREE.TextureLoader().load( 'textures/curtain.jpg' );
        map.wrapS = map.wrapT = THREE.RepeatWrapping; 
        map.anisotropy = 16; 
        map.colorSpace = THREE.SRGBColorSpace; 
        this.material = new THREE.MeshLambertMaterial( { map: map,
                        side: THREE.DoubleSide,
                        transparent: true, opacity: 0.90 } );
        this.meshes = []
        this.samplesU = 8         
        this.samplesV = 8       

        this.createCurvedCurtain();

    }

    createCurvedCurtain() {
        
        // Define control points for a jar-like shape
        let controlPoints = [
            // U = 0
            [
                [-0.5, 0,  0, 1],
                [-0.25, 0, 1, 1],
                [ 0,    0,  0, 1],  
                [ 0.25, 0, -1, 1],
                [ 0.5,  0,  0, 1],
                [ 0.75, 0,  1, 1],
                [ 1,    0,  0, 1],
                [ 1.25, 0, -1, 1],
                [ 1.5,  0,  0, 1],
                [ 1.75, 0,  1, 1],
                [ 2,    0,  0, 1],
            ],
            // U = 1
              [
                [-0.5,  3,  0, 1],
                [-0.25, 3, 1, 1],
                [ 0   , 3,   0, 1],
                [ 0.25, 3,  -1, 1], 
                [ 0.5 , 3,   0, 1],
                [ 0.75, 3,   1, 1],
                [ 1   , 3,   0, 1],
                [ 1.25, 3,  -1, 1],
                [ 1.5 , 3,   0, 1],
                [ 1.75, 3,   1, 1],
                [ 2   , 3,   0, 1],
            ]
        ]
        
    
        const orderU = 1;
        const orderV = 10;
    
        const surfaceData = build(
            controlPoints, orderU, orderV, this.samplesU, this.samplesV, this.material
        );
    
        const mesh = new THREE.Mesh(surfaceData, this.material);
    
        mesh.rotation.set(0, 0, 0);
        mesh.scale.set(1, 1, 1);
        mesh.position.set(0, 0, 0);
        this.add(mesh);
        this.meshes.push(mesh);
    }

}

CurtainFabric.prototype.isGroup = true;

export { CurtainFabric };
