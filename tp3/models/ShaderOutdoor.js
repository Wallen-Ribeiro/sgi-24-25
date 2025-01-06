import * as THREE from 'three';

const reliefVertexShader = `
uniform sampler2D depthMap;
uniform float reliefScale;
varying vec2 vUv;
varying vec3 vNormal;

void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 depth = texture2D(depthMap, uv);
    float displacement = (depth.r + depth.g + depth.b) / 3.0;
    vec3 newPosition = position + normal * displacement * reliefScale;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;

const reliefFragmentShader = `
uniform sampler2D colorMap;
varying vec2 vUv;
varying vec3 vNormal;

void main() {
    vec4 texColor = texture2D(colorMap, vUv);
    
    vec3 light = normalize(vec3(1.0, 1.0, 1.0));
    float intensity = max(dot(vNormal, light), 0.0) * 0.7 + 0.3;
    vec3 finalColor = texColor.rgb * intensity;
    
    gl_FragColor = vec4(finalColor, 1.0);
}
`;

class ShaderOutdoor extends THREE.Object3D {
    constructor() {
        super();
        this.loadTextures();
    }

    async loadTextures() {
        const textureLoader = new THREE.TextureLoader();

        const colorTexture = await new Promise(resolve => 
            textureLoader.load('scene/textures/sonic.jpg', resolve));
        const depthTexture = await new Promise(resolve => 
            textureLoader.load('scene/textures//sonic_dm.jpg', resolve));
        
        this.buildModel(colorTexture, depthTexture);
    }

    buildModel(colorTexture, depthTexture) {
        const leg = new THREE.BoxGeometry(1, 30, 1);
        const bar = new THREE.BoxGeometry(40, 1, 1);
        const plane = new THREE.PlaneGeometry(40, 18, 100, 100);
        
        const metalMaterial = new THREE.MeshPhongMaterial({
            color: "#aaafb5",
            specular: "#000000",
            emissive: "#000000",
        });

        const reliefMaterial = new THREE.ShaderMaterial({
            uniforms: {
                colorMap: { value: colorTexture },
                depthMap: { value: depthTexture },
                reliefScale: { value: 1.0 }
            },
            vertexShader: reliefVertexShader,
            fragmentShader: reliefFragmentShader,
            side: THREE.DoubleSide
        });

        const leg1 = new THREE.Mesh(leg, metalMaterial);
        const leg2 = new THREE.Mesh(leg, metalMaterial);
        const bar1 = new THREE.Mesh(bar, metalMaterial);
        const bar2 = new THREE.Mesh(bar, metalMaterial);
        const display = new THREE.Mesh(plane, reliefMaterial);

        leg1.translateX(-20);
        leg2.translateX(20);
        display.translateY(5);
        bar1.translateY(14.5);
        bar2.translateY(-4.5);

        this.add(leg1);
        this.add(leg2);
        this.add(bar1);
        this.add(bar2);
        this.add(display);
    }

}

export { ShaderOutdoor };