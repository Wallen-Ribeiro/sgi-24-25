import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


/**
 * This class contains a 3D Opponent representation
 */
class Opponent extends THREE.Object3D {

    constructor() {
        super();        
        this.boxMesh = null
        this.model = null
        this.boxMeshSize = 5.0
        this.boxEnabled = false
        this.boxDisplacement = new THREE.Vector3(0, 5, 0)

        this.diffusePlaneColor = "#00ffff"
        this.specularPlaneColor = "#777777"
        this.planeShininess = 30
        this.planeMaterial = new THREE.MeshPhongMaterial({
            color: this.diffusePlaneColor,
            specular: this.specularPlaneColor,
            emissive: "#000000",
            shininess: this.planeShininess
        })


        this.keyPoints = [

            new THREE.Vector3(90, 10, 0),
            new THREE.Vector3(-80, 10, 0),
            new THREE.Vector3(-80, 10, -100),
            new THREE.Vector3(-20, 10, -100),
            new THREE.Vector3(-20, 10 , -30),
            new THREE.Vector3(20, 10 , -30),
            new THREE.Vector3(20, 10, -150),
            new THREE.Vector3(90, 10, -150),
            new THREE.Vector3(90, 10, 0)
        ];

        this.clock = new THREE.Clock()

        this.mixerTime = 0
        this.mixerPause = false

        this.enableAnimationRotation = false
        this.enableAnimationPosition = true

        let boxMaterial = new THREE.MeshPhongMaterial({
            color: "#ffff77",
            specular: "#000000",
            emissive: "#000000",
            shininess: 90
        })

        let box = new THREE.BoxGeometry(this.boxMeshSize, this.boxMeshSize, this.boxMeshSize);
        this.boxMesh = new THREE.Mesh(box, boxMaterial);
        this.boxMesh.rotation.x = -Math.PI / 2;
        this.boxMesh.position.y = this.boxDisplacement.y;

        this.add(this.boxMesh)

        this.initModel().then(() => {
            this.init(); 
        });
    }

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

    async initModel() {
        try {
            this.model = await this.loadModel('./assets/air6.glb');
    
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
     * initializes the contents
     */
    init() {

        // Visual debugging the path and the control points
        this.debugKeyFrames();

        const positionKF = new THREE.VectorKeyframeTrack('.position', [0, 2, 4, 6, 8, 10, 12, 14, 16],
            [
                ...this.keyPoints[0].toArray(),
                ...this.keyPoints[1].toArray(),
                ...this.keyPoints[2].toArray(),
                ...this.keyPoints[3].toArray(),
                ...this.keyPoints[4].toArray(),
                ...this.keyPoints[5].toArray(),
                ...this.keyPoints[6].toArray(),
                ...this.keyPoints[7].toArray(),
                ...this.keyPoints[8].toArray()
            ],
            THREE.InterpolateSmooth
        );

        const yAxis = new THREE.Vector3(0, 1, 0);
        const q1 = new THREE.Quaternion().setFromAxisAngle(yAxis, 0);
        const q2 = new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI);
        const q3 = new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI * 2);

        const quaternionKF = new THREE.QuaternionKeyframeTrack('.quaternion', [0, 1, 2],
            [q1.x, q1.y, q1.z, q1.w,
            q2.x, q2.y, q2.z, q2.w,
            q3.x, q3.y, q3.z, q3.w]
        );

        const positionClip = new THREE.AnimationClip('positionAnimation', 16, [positionKF]);
        const rotationClip = new THREE.AnimationClip('rotationAnimation', 3, [quaternionKF]);


        const positionAction = this.mixer.clipAction(positionClip);
        const rotationAction = this.mixer.clipAction(rotationClip);

        positionAction.play();
        rotationAction.play();
    }

    /**
     * Set a specific point in the animation clip
     */
    setMixerTime() {
        this.mixer.setTime(this.mixerTime)
    }


    /**
     * Build control points and a visual path for debug
     */
    debugKeyFrames() {

        let spline = new THREE.CatmullRomCurve3([...this.keyPoints])

        // Setup visual control points

        for (let i = 0; i < this.keyPoints.length; i++) {
            const geometry = new THREE.SphereGeometry(1, 32, 32)
            const material = new THREE.MeshBasicMaterial({ color: 0x0000ff })
            const sphere = new THREE.Mesh(geometry, material)
            sphere.scale.set(0.2, 0.2, 0.2)
            sphere.position.set(...this.keyPoints[i].toArray())

            this.add(sphere)
        }

        const tubeGeometry = new THREE.TubeGeometry(spline, 100, 0.05, 10, false)
        const tubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
        const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial)

        this.add(tubeMesh)

    }

    /**
     * builds the box mesh with material assigned
     */
    buildBox() {
        let boxMaterial = new THREE.MeshPhongMaterial({
            color: "#ffff77",
            specular: "#000000",
            emissive: "#000000",
            shininess: 90
        })

        // Create a Cube Mesh with basic material
        let box = new THREE.BoxGeometry(this.boxMeshSize, this.boxMeshSize, this.boxMeshSize);
        this.boxMesh = new THREE.Mesh(box, boxMaterial);
        this.boxMesh.rotation.x = -Math.PI / 2;
        this.boxMesh.position.y = this.boxDisplacement.y;

        this.add(this.boxMesh)
    }

    /**
     * updates the diffuse plane color and the material
     * @param {THREE.Color} value 
     */
    updateDiffusePlaneColor(value) {
        this.diffusePlaneColor = value
        this.planeMaterial.color.set(this.diffusePlaneColor)
    }
    /**
     * updates the specular plane color and the material
     * @param {THREE.Color} value 
     */
    updateSpecularPlaneColor(value) {
        this.specularPlaneColor = value
        this.planeMaterial.specular.set(this.specularPlaneColor)
    }
    /**
     * updates the plane shininess and the material
     * @param {number} value 
     */
    updatePlaneShininess(value) {
        this.planeShininess = value
        this.planeMaterial.shininess = this.planeShininess
    }


    /**
     * Start/Stop all animations
     */
    checkAnimationStateIsPause() {
        if (this.mixerPause)
            this.mixer.timeScale = 0
        else
            this.mixer.timeScale = 1
    }


    /**
     * Start/Stop if position or rotation animation track is running
     */
    checkTracksEnabled() {

        const actions = this.mixer._actions
        for (let i = 0; i < actions.length; i++) {
            const track = actions[i]._clip.tracks[0]

            if (track.name === '.quaternion' && this.enableAnimationRotation === false) {
                actions[i].stop()
            }
            else if (track.name === '.position' && this.enableAnimationPosition === false) {
                actions[i].stop()
            }
            else {
                if (!actions[i].isRunning())
                    actions[i].play()
            }
        }
    }


    /**
     * updates the contents
     * this method is called from the render method of the app
     * 
     */
    update() {
        const delta = this.clock.getDelta();
        if (this.mixer){
            this.mixer.update(delta);
            this.checkAnimationStateIsPause();
            this.checkTracksEnabled();
        }
    }

}

export { Opponent };