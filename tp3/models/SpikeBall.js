import * as THREE from 'three';

/**
* This class contains a 3D spiked ball
 */

class SpikeBall extends THREE.Object3D {

    /**
     * 
     */
    constructor() {
        super();

        this.type = "OBSTACLE";
        this.radius = 2; // collision radius

        this.buildModel();
    }

    buildModel() {
        const ballRadius = this.radius * 0.6;
        const spikeRadius = 0.5;
        const spikeHeight = this.radius * 0.8; // half of spike is inside ball

        const sphere = new THREE.SphereGeometry(ballRadius);
        const cone = new THREE.ConeGeometry(spikeRadius, spikeHeight);

        const metalMaterial = new THREE.MeshPhongMaterial({
                color: "#aaafb5",
                specular: "#000000",
                emissive: "#000000",
        });
        const ballMaterial = new THREE.MeshToonMaterial({
                color: "#373837",
        });

        const ball = new THREE.Mesh(sphere, ballMaterial);
        this.ball = ball;
        const spikes = [];

        for(let i = 0; i < 6; i++) {
            spikes.push(new THREE.Mesh(cone, metalMaterial));
        }

        // const sphere1 = new THREE.SphereGeometry(this.radius);
        // const collisionMaterial = new THREE.MeshBasicMaterial({
        //     wireframe: true
        // });
        // const collisionSphere = new THREE.Mesh(sphere1, collisionMaterial);
        // this.add(collisionSphere);

        spikes[0].translateY(ballRadius);
        spikes[1].translateY(-ballRadius);
        spikes[1].rotateX(Math.PI);
        spikes[2].translateZ(-ballRadius);
        spikes[2].rotateX(-Math.PI / 2);
        spikes[3].translateZ(ballRadius);
        spikes[3].rotateX(Math.PI / 2);
        spikes[4].translateX(-ballRadius);
        spikes[4].rotateZ(Math.PI / 2);
        spikes[5].translateX(ballRadius);
        spikes[5].rotateZ(-Math.PI / 2);



        this.add(ball);
        for(let i = 0; i < 6; i++) {
            this.add(spikes[i]);
        }
    }


    update() {
    }
}

export { SpikeBall };
