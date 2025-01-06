import * as THREE from 'three';

/**
 * This class contains a 3D ballon
 */

const STUN_TIMOUT = 3.00;
const INVENCIBLE_TIMOUT = 1.50;

class Ballon extends THREE.Object3D {

    /**
     * builds the ballon object
     * @param {string} modelpath The path to the model
     * @returns {void}
     */
    constructor(modelpath) {
        super();

        this.modelpath = modelpath;
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
        this.shadowRadius = 5;

        this.buildModel();
        document.addEventListener('keydown', this.onDocumentKeyDown.bind(this))
    }

    /**
     * Builds the ballon model
     * @returns {THREE.Object3D} The ballon model
     */
    buildModel() {
        const sphere = new THREE.SphereGeometry(10);
        const cube = new THREE.BoxGeometry(2, 2, 2);
        const circle = new THREE.CircleGeometry(this.shadowRadius);

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
        this.shadow.position.y = 4.1;
        this.shadow.rotateX(- Math.PI / 2);

        this.add(ballon);
        this.add(casket);
    }

    /**
     * Loads a model
     * @param {string} path The path to the 3d model
     * @returns {Promise} The promise of the .glb model
     */
    async loadModel(path) {
        return new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            loader.load(
                path,
                (gltf) => {
                    resolve(gltf.scene);
                },
                undefined,
                (error) => {
                    reject(error);
                }
            );
        });
    }

    /**
     * Initializes the model
     * @returns {Promise} The promise of the model
     */
    async initModel() {
        try {
            this.model = await this.loadModel(this.modelpath);
    
            this.model.position.set(4, 0, 0);
            this.model.scale.set(1, 1, 1);
            this.model.rotateY(-Math.PI / 2);
    
            this.add(this.model);

            this.mixer = new THREE.AnimationMixer(this.model);

            console.log("Model loaded successfully", this.model);

    
        } catch (error) {
            console.error("Failed to load model:", error);
        }
    }

    /**
     * Initializes the ballon first person camera
     * @param {THREE.Camera} camera The camera to set
     */
    setFirstPersonCamera(camera) {
        this.firstPersonCamera = camera;
    }

    /**
     * initializes the ballon third person camera
     * @param {THREE.Camera} camera The camera to set
     */
    setThirdPersonCamera(camera) {
        this.thirdPersonCamera = camera;
    }

    /**
     * Updates the cameras
     */
    updateCameras() {
        if (this.firstPersonCamera) {
            this.firstPersonCamera.position.copy(this.position);
            this.firstPersonCamera.position.y += 2; 
            this.firstPersonCamera.lookAt(this.position.x, this.position.y, this.position.z + 1);
        }

        if (this.thirdPersonCamera) {
            this.thirdPersonCamera.position.copy(this.position);
            this.thirdPersonCamera.position.x += 10; 
            this.thirdPersonCamera.position.y += 20;
            this.thirdPersonCamera.lookAt(this.position);
        }
    }

    /**
     * Handles the key down event
     * @param {KeyboardEvent} event The event object
     */
    onDocumentKeyDown(event) {
        if (!this.moving) {
            if (event.key === 'w' && this.layer < 4) {
                this.moving = true;
                this.currentDuration = 1.0;
                this.currentTime = 0.0;
                this.currentEase = this.easeInOutCubic(this.position.y, this.position.y + 10.0, this.currentDuration);
                this.layer++;
            } else if (event.key === 's' && this.layer > 0) {
                this.moving = true;
                this.currentDuration = 1.0;
                this.currentTime = 0.0;
                this.currentEase = this.easeInOutCubic(this.position.y, this.position.y - 10.0, this.currentDuration);
                this.layer--;
            }
        }
    }

    /**
     * Eases the movement of balloon
     * @param {number} start The start position
     * @param {number} end The end position
     * @param {number} duration The duration of the movement
     * @returns {function} The easing function
     */
    easeInOutCubic(start, end, duration) {
        return function (t) {
            if (t < duration / 2)
                return start + (end - start) * 4 * t * t * t;
            return start + (end - start) * (1 - Math.pow(-2 * t + 2, 3) / 2);
        };
    }

    /**
     * Applies wind
     * @returns {void}
     */
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

    /**
     * Updates the ballon object
     */
    update() {
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
    /**
     * Sets the ballon as stunned, when it collides with a spike ball
     * @returns {void}
     */
    setStunned() {
        this.stunned = true;
        this.stunnedTimout = 0.00;
        this.invencible = true;
        this.invencibleTimout = 0.00;
    }

    /**
     * Sets the ballon as invencible, when it collides with a powerup
     * @returns {void}
     */
    setInvencible() {
        this.invencible = true;
        this.invencibleTimout = 0.00;
    }
}

export { Ballon };
