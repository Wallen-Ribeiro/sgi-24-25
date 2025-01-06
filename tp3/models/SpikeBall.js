import * as THREE from 'three';

const vs = `
uniform float time;
varying vec3 vNormal;
varying vec2 vUv;

void main() {
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
    
    float pulse = sin(time * 2.0) * 0.1 + 1.0;
    vec3 newPosition = position * pulse;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;

const fs = `
uniform float time;
uniform vec3 color;
varying vec3 vNormal;
varying vec2 vUv;

void main() {
    float pulse = sin(time * 2.0) * 0.2 + 0.8;

    vec3 light = vec3(0.0, 1.0, 0.0);
    float intensity = dot(vNormal, light) * 0.5 + 0.5;
    vec3 finalColor = color * intensity * pulse;
    
    gl_FragColor = vec4(finalColor, 1.0);
}
`;

class SpikeBall extends THREE.Object3D {
    constructor() {
        super();
        this.type = "OBSTACLE";
        this.radius = 2;
        this.clock = new THREE.Clock();
        this.uniforms = {
            time: { value: 0 },
            color: { value: new THREE.Color("#373837") }
        };
        this.spikeUniforms = {
            time: { value: 0 },
            color: { value: new THREE.Color("#aaafb5") }
        };
        this.buildModel();
    }

    buildModel() {
        const ballRadius = this.radius * 0.6;
        const spikeRadius = 0.5;
        const spikeHeight = this.radius * 0.8;
        const sphere = new THREE.SphereGeometry(ballRadius, 32, 32);
        const cone = new THREE.ConeGeometry(spikeRadius, spikeHeight, 16, 1);

        const ballMaterial = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: vs,
            fragmentShader: fs
        });

        const spikeMaterial = new THREE.ShaderMaterial({
            uniforms: this.spikeUniforms,
            vertexShader: vs,
            fragmentShader: fs
        });

        const ball = new THREE.Mesh(sphere, ballMaterial);
        this.ball = ball;

        const spikes = [];
        for(let i = 0; i < 6; i++) {
            spikes.push(new THREE.Mesh(cone, spikeMaterial));
        }

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
        const time = this.clock.getElapsedTime();
        this.uniforms.time.value = time;
        this.spikeUniforms.time.value = time;
    }
}

export { SpikeBall };
