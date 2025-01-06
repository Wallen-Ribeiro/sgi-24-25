import * as THREE from 'three';

/**
 * This class contains a 3D ballon
 */

const STUN_TIMOUT = 3.00;
const INVENCIBLE_TIMOUT = 1.50;

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
        // vouchers
        this.vouchers = 0;
        this.invencible = false;
        this.invencibleTimout = 0.00;
        this.stunned = false;
        this.stunnedTimout = 0.00;

        this.buildModel();
        document.addEventListener('keydown', this.onDocumentKeyDown.bind(this))
    }

    buildModel() {
        const sphere = new THREE.SphereGeometry(10);
        const cube = new THREE.BoxGeometry(2, 2, 2);
        const circle = new THREE.CircleGeometry(5);

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

        const shadowMaterial = new THREE.MeshBasicMaterial({
            color: "#000000",
            transparent: true,
            opacity: 0.8
        })

        const ballon = new THREE.Mesh(sphere, ballonMaterial);
        const casket = new THREE.Mesh(cube, casketMaterial);
        this.shadow = new THREE.Mesh(circle, shadowMaterial);
        casket.position.y = -11;
        this.shadow.position.y = -30;
        this.shadow.rotateX(- Math.PI / 2);

        this.add(ballon);
        this.add(casket);
    }

    setFirstPersonCamera(camera) {
        this.firstPersonCamera = camera;
    }

    setThirdPersonCamera(camera) {
        this.thirdPersonCamera = camera;
    }

    updateCameras() {
        if (this.firstPersonCamera) {
            this.firstPersonCamera.position.copy(this.position);
            this.firstPersonCamera.position.y += 2; 
            this.firstPersonCamera.lookAt(this.position.x, this.position.y, this.position.z + 1);
            console.log(this.position.x, this.position.y, this.position.z + 1)
        }

        if (this.thirdPersonCamera) {
            this.thirdPersonCamera.position.copy(this.position);
            this.thirdPersonCamera.position.x += 10; 
            this.thirdPersonCamera.position.y += 20;
            this.thirdPersonCamera.lookAt(this.position);
            console.log(this.position)

        }
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
        console.log(this.clock);
        const delta = this.clock.getDelta();
        this.shadow.position.setX(this.position.x);
        this.shadow.position.setZ(this.position.z);

        if (this.stunned) {
            this.stunnedTimout += delta;
            if(this.stunnedTimout >= STUN_TIMOUT) {
                this.stunned = false;
            } else {
                return;
            }
        }

        if(this.invencible) {
            this.invencibleTimout += delta;
            if(this.invencibleTimout >= INVENCIBLE_TIMOUT) {
                this.invencible = false;
            }
        }

        if (this.moving) {
            this.currentTime += delta;
            if (this.currentTime > this.currentDuration) {
                this.moving = false;
            }
            this.position.y = this.currentEase(this.currentTime);
        }
        this.applyWind();
        this.updateCameras();
    }

    setStunned() {
        this.stunned = true;
        this.stunnedTimout = 0.00;
        this.invencible = true;
        this.invencibleTimout = 0.00;
    }

    setInvencible() {
        this.invencible = true;
        this.invencibleTimout = 0.00;
    }
}

export { Ballon };
