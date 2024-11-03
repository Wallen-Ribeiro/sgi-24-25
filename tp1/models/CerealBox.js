import * as THREE from 'three';

/**
 * This class contains a 3D CerealBox
 */
class CerealBox extends THREE.Object3D {
        
    /**
    * Constructor for the CerealBox class
    * Initializes the cereal box with default properties.
    * 
    * @property {number} width - The width of the cereal box.
    * @property {number} length - The length of the cereal box.
    * @property {number} height - The height of the cereal box.
    */
    constructor( width, length, height) {
        super();

        this.width = width;
        this.length = length;
        this.height = height;
        this.lipHeight = height/10;

        this.frontBackGeometry = new THREE.PlaneGeometry(this.width, this.height);
        this.sideGeometry = new THREE.PlaneGeometry(this.length, this.height);
        this.bottomGeometry = new THREE.PlaneGeometry(this.width, this.length);
        this.longLipGeometry = new THREE.PlaneGeometry(this.width, this.lipHeight);
        this.shortLipGeometry = new THREE.PlaneGeometry(this.length, this.lipHeight);

        this.buildOutside()
        this.buildInside()
    }

    buildOutside() {
        const frontTexture = new THREE.TextureLoader().load('textures/cerealBox/front.png');
        const backTexture = new THREE.TextureLoader().load('textures/cerealBox/back.png');
        const sideTexture = new THREE.TextureLoader().load('textures/cerealBox/side.png');
        const bottomTexture = new THREE.TextureLoader().load('textures/cerealBox/bottom.png');
        const largeLipTexture = new THREE.TextureLoader().load('textures/cerealBox/largeLip.png');
        const smallLipTexture = new THREE.TextureLoader().load('textures/cerealBox/smallLip.png');

        const front = new THREE.Mesh(this.frontBackGeometry, new THREE.MeshPhongMaterial({ map: frontTexture }));
        front.castShadow = true; front.receiveShadow = true;
        const back = new THREE.Mesh(this.frontBackGeometry, new THREE.MeshPhongMaterial({ map: backTexture }));
        back.castShadow = true; back.receiveShadow = true;
        const side1 = new THREE.Mesh(this.sideGeometry, new THREE.MeshPhongMaterial({ map: sideTexture }));
        side1.castShadow = true; side1.receiveShadow = true;
        const side2 = new THREE.Mesh(this.sideGeometry, new THREE.MeshPhongMaterial({ map: sideTexture }));
        side2.castShadow = true; side2.receiveShadow = true;
        const bottom = new THREE.Mesh(this.bottomGeometry, new THREE.MeshPhongMaterial({ map: bottomTexture }));
        bottom.castShadow = true; bottom.receiveShadow = true;
        const longLip1 = new THREE.Mesh(this.longLipGeometry, new THREE.MeshPhongMaterial({ map: largeLipTexture }));
        longLip1.castShadow = true; longLip1.receiveShadow = true;
        const longLip2 = new THREE.Mesh(this.longLipGeometry, new THREE.MeshPhongMaterial({ map: largeLipTexture }));
        longLip2.castShadow = true; longLip2.receiveShadow = true;
        const shortLip1 = new THREE.Mesh(this.shortLipGeometry, new THREE.MeshPhongMaterial({ map: smallLipTexture }));
        shortLip1.castShadow = true; shortLip1.receiveShadow = true;
        const shortLip2 = new THREE.Mesh(this.shortLipGeometry, new THREE.MeshPhongMaterial({ map: smallLipTexture }));
        shortLip2.castShadow = true; shortLip2.receiveShadow = true;

        const halfHeight = this.height/2;
        const halfWidth = this.width/2;
        const halfLength = this.length/2;
        const halfLipHeight = this.lipHeight/2;
        const lipOffsetHeight = Math.cos(Math.PI/4) * halfLipHeight;
        const lipOffsetLength = Math.sin(Math.PI/4) * halfLipHeight;

        front.position.set(0, halfHeight, halfLength);
        back.position.set(0, halfHeight, -halfLength);
        back.rotateY(Math.PI);
        side1.position.set(halfWidth, halfHeight, 0);
        side1.rotateY(Math.PI/2);
        side2.position.set(-halfWidth, halfHeight, 0);
        side2.rotateY(-Math.PI/2);
        bottom.position.set(0, 0, 0);
        bottom.rotateX(Math.PI/2);
        longLip1.position.set(0, this.height + lipOffsetHeight, halfLength + lipOffsetLength);
        longLip1.rotateX(Math.PI/ 4);
        longLip2.position.set(0, this.height + lipOffsetHeight, -halfLength - lipOffsetLength);
        longLip2.rotateY(Math.PI);
        longLip2.rotateX(Math.PI/4);
        shortLip1.position.set(halfWidth + lipOffsetLength, this.height + lipOffsetHeight, 0);
        shortLip1.rotateY(Math.PI/2);
        shortLip1.rotateX(Math.PI/4);
        shortLip2.position.set(-halfWidth - lipOffsetLength, this.height + lipOffsetHeight, 0);
        shortLip2.rotateY(-Math.PI/2);
        shortLip2.rotateX(Math.PI/4);

        this.add(front);
        this.add(back);
        this.add(side1);
        this.add(side2);
        this.add(bottom);
        this.add(longLip1);
        this.add(longLip2);
        this.add(shortLip1);
        this.add(shortLip2);
    }

   buildInside() {
        const texture = new THREE.TextureLoader().load('textures/cerealBox/cardboard.jpg');
        const material = new THREE.MeshPhongMaterial({ map: texture });
        const front = new THREE.Mesh(this.frontBackGeometry, material);
        front.castShadow = true; front.receiveShadow = true;
        const back = new THREE.Mesh(this.frontBackGeometry, material);
        back.castShadow = true; back.receiveShadow = true; 
        const side1 = new THREE.Mesh(this.sideGeometry, material);
        side1.castShadow = true; side1.receiveShadow = true;
        const side2 = new THREE.Mesh(this.sideGeometry, material);
        side2.castShadow = true; side2.receiveShadow = true;
        const bottom = new THREE.Mesh(this.bottomGeometry, material);
        bottom.castShadow = true; bottom.receiveShadow = true;
        const longLip1 = new THREE.Mesh(this.longLipGeometry, material);
        longLip1.castShadow = true; longLip1.receiveShadow = true;
        const longLip2 = new THREE.Mesh(this.longLipGeometry, material);
        longLip2.castShadow = true; longLip2.receiveShadow = true;
        const shortLip1 = new THREE.Mesh(this.shortLipGeometry, material);
        shortLip1.castShadow = true; shortLip1.receiveShadow = true;
        const shortLip2 = new THREE.Mesh(this.shortLipGeometry, material);
        shortLip2.castShadow = true; shortLip2.receiveShadow = true;
        
        const halfHeight = this.height/2;
        const halfWidth = this.width/2;
        const halfLength = this.length/2;
        const halfLipHeight = this.lipHeight/2;
        const lipOffsetHeight = Math.cos(Math.PI/4) * halfLipHeight;
        const lipOffsetLength = Math.sin(Math.PI/4) * halfLipHeight;


        front.position.set(0, halfHeight, halfLength);
        front.rotateY(Math.PI);
        back.position.set(0, halfHeight, -halfLength);
        side1.position.set(halfWidth, halfHeight, 0);
        side1.rotateY(-Math.PI/2);
        side2.position.set(-halfWidth, halfHeight, 0);
        side2.rotateY(Math.PI/2);
        bottom.position.set(0, 0, 0);
        bottom.rotateX(-Math.PI/2);
        longLip1.position.set(0, this.height + lipOffsetHeight, halfLength + lipOffsetLength);
        longLip1.rotateY(Math.PI);
        longLip1.rotateX(-Math.PI/4);
        longLip2.position.set(0, this.height + lipOffsetHeight, -halfLength - lipOffsetLength);
        longLip2.rotateX(-Math.PI/4);
        shortLip1.position.set(halfWidth + lipOffsetLength, this.height + lipOffsetHeight, 0);
        shortLip1.rotateY(-Math.PI/2);
        shortLip1.rotateX(-Math.PI/4);
        shortLip2.position.set(-halfWidth - lipOffsetLength, this.height + lipOffsetHeight, 0);
        shortLip2.rotateY(Math.PI/2);
        shortLip2.rotateX(-Math.PI/4);

        this.add(front);
        this.add(back);
        this.add(side1);
        this.add(side2);
        this.add(bottom);
        this.add(longLip1);
        this.add(longLip2);
        this.add(shortLip1);
        this.add(shortLip2);
   }
}

export { CerealBox };
