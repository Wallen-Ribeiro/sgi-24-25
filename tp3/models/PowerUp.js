import * as THREE from 'three';

/**
* This class contains a 3D PowerUp
 */

class PowerUp extends THREE.Object3D {

    /**
     * 
     */
    constructor() {
        super();

        // animation 
        this.clock = new THREE.Clock();

        this.type = "POWERUP";
        this.radius = 2.5; // collision radius

        this.buildModel();
    }

    buildModel() {
        const teleSize = 3;
        const screenSize = 2.5;
        const supportHeight = 0.5;
        const supportRadius = 0.5;
        const baseRadius = teleSize / 2;
        const baseHeight = 0.1;

        const cube = new THREE.BoxGeometry(teleSize, teleSize, teleSize);
        const cylinder = new THREE.CylinderGeometry(supportRadius, supportRadius, supportHeight);
        const base = new THREE.CylinderGeometry(baseRadius, baseRadius, baseHeight);
        const plane = new THREE.PlaneGeometry(screenSize, screenSize);

        const metalMaterial = new THREE.MeshToonMaterial({
                color: "#aaafb5",
                emissive: "#000000",
                transparent: false,
        });

        const screenTexture = new THREE.TextureLoader().load('scene/textures/shield_pu.png')
        const screenMaterial = new THREE.MeshToonMaterial({
            map: screenTexture,
        });

        const tele = new THREE.Mesh(cube, metalMaterial);
        const screen = new THREE.Mesh(plane, screenMaterial);
        const teleSupport = new THREE.Mesh(cylinder, metalMaterial);
        const teleBase = new THREE.Mesh(base, metalMaterial);

        tele.add(screen);
        screen.translateZ(teleSize / 2 + 0.001)

        // const sphere = new THREE.SphereGeometry(this.radius);
        // const collisionMaterial = new THREE.MeshBasicMaterial({
        //     wireframe: true
        // });
        // const collisionSphere = new THREE.Mesh(sphere, collisionMaterial);
        // this.add(collisionSphere);

        const baseY = baseHeight / 2;
        const supportY = baseHeight + supportHeight / 2;
        const teleY = baseHeight + supportHeight + teleSize / 2;
        teleBase.translateY(baseY);
        teleSupport.translateY(supportY);
        tele.translateY(teleY)

        const teleGroup = new THREE.Group();
        const groupY = baseHeight + supportHeight + teleSize;
        teleGroup.translateY(- groupY / 2);

        teleGroup.add(tele);
        teleGroup.add(teleSupport);
        teleGroup.add(teleBase);
        this.add(teleGroup);
        
    }


    update() {
    }
}

export { PowerUp };
