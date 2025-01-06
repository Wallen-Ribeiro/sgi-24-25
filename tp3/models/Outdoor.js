import * as THREE from 'three';

/**
 * This class contains a 3D outdoor
 */

class Outdoor extends THREE.Object3D {

    /**
     * 
     */
    constructor() {
        super();

        this.layer = 0;

        // animation 
        this.clock = new THREE.Clock();

        this.buildModel();
    }

    buildModel() {
        const leg = new THREE.BoxGeometry(1, 30, 1);
        const bar = new THREE.BoxGeometry(40, 1, 1);
        const plane = new THREE.PlaneGeometry(40, 20);

        const metalMaterial = new THREE.MeshPhongMaterial({
                color: "#aaafb5",
                specular: "#000000",
                emissive: "#000000",
        });
        const backgroundMaterial = new THREE.MeshLambertMaterial({
                color: "#ffffff",
                emissive: "#ffffff",
                side: THREE.DoubleSide
        });

        const leg1 = new THREE.Mesh(leg, metalMaterial);
        const leg2 = new THREE.Mesh(leg, metalMaterial);
        const bar1 = new THREE.Mesh(bar, metalMaterial);
        const bar2 = new THREE.Mesh(bar, metalMaterial);
        const bg = new THREE.Mesh(plane, backgroundMaterial);
        
        leg1.translateX(-20);
        leg2.translateX(20);
        bg.translateY(5);
        bar1.translateY(14.5);
        bar2.translateY(-4.5);


        this.add(leg1);
        this.add(leg2);
        this.add(bar1);
        this.add(bar2);
        this.add(bg);
    }

    update() {
        const delta = this.clock.getDelta();
    }

}

export { Outdoor };
