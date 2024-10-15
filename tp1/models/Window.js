import * as THREE from 'three';

/**
 * This class contains a 3D Window
 */

class Window extends THREE.Object3D {

    /**
      * 
      */
    constructor() {
        super();
        this.type = 'Group';

        this.rimColor = 0x8B4513;
        this.glassColor = 0xFFFFFF;

        this.width = 3;
        this.heigth = 3;
        this.thickness = 0.2;
        this.depth = 0.05;


        this.createFrame();
        this.createGlass();
        this.createOutside();
    }

    createFrame() {
      const horizontalRimGeometry = new THREE.BoxGeometry(this.width, this.thickness, this.depth + 0.1);
      const verticalRimGeometry = new THREE.BoxGeometry(this.thickness, this.heigth, this.depth + 0.1);
      const horizontalRimMaterial = new THREE.MeshPhongMaterial({ color: this.rimColor });
      const verticalRimMaterial = new THREE.MeshPhongMaterial({ color: this.rimColor });

      const horizontalRim1 = new THREE.Mesh(horizontalRimGeometry, horizontalRimMaterial);
      const horizontalRim2 = new THREE.Mesh(horizontalRimGeometry, horizontalRimMaterial);
      const middleHorizontalRim = new THREE.Mesh(horizontalRimGeometry, horizontalRimMaterial);
      horizontalRim1.position.set(0, this.heigth/2, 0); 
      horizontalRim2.position.set(0, 0, 0); 
      middleHorizontalRim.position.set(0, -this.heigth/2, 0);
      this.add(horizontalRim1); this.add(horizontalRim2); this.add(middleHorizontalRim);

      const verticalRim1 = new THREE.Mesh(verticalRimGeometry, verticalRimMaterial);
      const verticalRim2 = new THREE.Mesh(verticalRimGeometry, verticalRimMaterial);
      const middleVerticalRim = new THREE.Mesh(verticalRimGeometry, verticalRimMaterial);
      verticalRim1.position.set(0, 0, 0); 
      verticalRim2.position.set(this.width/2 - 0.1, 0, 0);
      middleVerticalRim.position.set(-this.width/2 + 0.1, 0, 0);
      this.add(verticalRim1); this.add(verticalRim2); this.add(middleVerticalRim);
    }


    createGlass() {
      const glassShininess = 500;
      const glassGeometry = new THREE.BoxGeometry(this.width - 0.2, this.heigth - 0.2, this.depth);
      const glassMaterial = new THREE.MeshPhongMaterial({ color: this.glassColor, transparent: true, opacity: 0.3, shininess: glassShininess, specular: this.glassColor, emissive: this.glassColor });
      const glass = new THREE.Mesh(glassGeometry, glassMaterial);
      this.add(glass);
    }

    createOutside() {
      const landscapeTexture = new THREE.TextureLoader().load( "textures/paris.jpg" )
      landscapeTexture.wrapS = THREE.RepeatWrapping;
      landscapeTexture.wrapT = THREE.RepeatWrapping;
      const landscapeGeometry = new THREE.BoxGeometry(this.width - 0.2, this.heigth - 0.2, this.depth);
      const landscapeMaterial = new THREE.MeshLambertMaterial({ map: landscapeTexture});
      const landscape = new THREE.Mesh(landscapeGeometry, landscapeMaterial);
      landscape.position.z = -0.1;
      this.add(landscape);
    }
}

Window.prototype.isGroup = true;


export { Window };

