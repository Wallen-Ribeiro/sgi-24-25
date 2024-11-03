import * as THREE from 'three';

/**
 * This class contains a 3D SkyDome
 */
class SkyDome extends THREE.Object3D {
    
        /**
        * Constructor for the SkyDome class
        * Initializes the skydome with default properties.
        * 
        * @property {string} texture - The texture of the skydome.
        * @property {number} radius - The radius of the skydome.
        */
        constructor(texture, radius) {
            super();
    
            this.texture = texture;
            this.radius = radius;
    
            const geometry = new THREE.SphereGeometry(this.radius);
            const material = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(this.texture), side: THREE.BackSide });
            const skyDome = new THREE.Mesh(geometry, material);
    
            this.add(skyDome);
        }
    }

export { SkyDome };