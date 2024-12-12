import * as THREE from 'three';

/**
 * This class contains a 3D ballon
 */

class Ballon extends THREE.Object3D {

    /**
     * 
     */
    constructor() {
        super();

        this.layer = 0;
        this.moving = false;
        this.currentDuration = 0;
        this.currentTime = 0;
        this.currentEase = null;
        this.xAccel = 0;
        this.radius = 10; // collision radius

        // animation 
        this.clock = new THREE.Clock();

        const sphere = new THREE.SphereGeometry(10);
        const cube = new THREE.BoxGeometry(2, 2, 2);

        const ballonMaterial = new THREE.MeshToonMaterial(
            {
                color: "#ff0000",
                emissive: "#000000",
            });

        const casketMaterial = new THREE.MeshLambertMaterial(
            {
                color: "#553300",
                emissive: "#000000"
            });

        const ballon = new THREE.Mesh(sphere, ballonMaterial);
        const casket = new THREE.Mesh(cube, casketMaterial);
        casket.position.y = -11;

        this.add(ballon);
        this.add(casket);

        document.addEventListener('keydown', this.onDocumentKeyDown.bind(this))
    }

    onDocumentKeyDown(event) {
        if (!this.moving) {
            if (event.key === 'w' && this.layer < 4) {
                this.moving = true;
                this.currentDuration = 1.0;
                this.currentTime = 0.0;
                this.currentEase = this.easeInOutCubic(this.position.y, this.position.y + 10.0, 1.0);
                this.layer++;
            } else if (event.key === 's' && this.layer > 0) {
                this.moving = true;
                this.currentDuration = 1.0;
                this.currentTime = 0.0;
                this.currentEase = this.easeInOutCubic(this.position.y, this.position.y - 10.0, 1.0);
                this.layer--;
            }
        }
    }

    easeInOutCubic(start, end, duration) {
        return function (t) {
            if (t < duration / 2)
                return start + (end - start) * 4 * t * t * t;
            return start + (end - start) * (1 - Math.pow(-2 * t + 2, 3) / 2);
        };
    }

    applyWind() {
        switch (this.layer) {
            case 0:
                break;
            case 1:
                this.position.x += 0.1;
                break;
            case 2:
                this.position.x -= 0.1;
                break;
            case 3:
                this.position.z += 0.1;
                break;
            case 4:
                this.position.z -= 0.1;
                break;
        }
    }

    update() {
        const delta = this.clock.getDelta();
        if (this.moving) {
            this.currentTime += delta;
            if (this.currentTime > this.currentDuration) {
                this.moving = false;
            }
            this.position.y = this.currentEase(this.currentTime);
        }
        this.applyWind();
    }
}

export { Ballon };
