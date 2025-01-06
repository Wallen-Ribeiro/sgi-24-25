import * as THREE from 'three';

class Firework {
    constructor(app, scene, explodeTime = 2, explosionDuration = 3) {
        this.scene = scene;
        this.explodeTime = explodeTime; 
        this.explosionDuration = explosionDuration;
        this.elapsedTime = 0;

        this.geometry = new THREE.BufferGeometry();
        this.position = new Float32Array(3);
        this.position.set([0, 0, 0]);
        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.position, 3));

        this.material = new THREE.PointsMaterial({
            color: 0xffcc00,
            size: 0.2,
        });

        this.particle = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.particle);

        this.velocity = new THREE.Vector3(0, 8, 0);
        this.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.5,
            8.0 + Math.random() * 4.0,
            (Math.random() - 0.5) * 0.5
        );
        this.acceleration = new THREE.Vector3(0, -0.3, 0);

        this.hasExploded = false;
        this.explosionParticles = [];
        this.explosionStartTime = null;
    }

    explode(position) {
        const numParticles = 50;
        const explosionSpeed = 1;
        const positions = [];
        const colors = new Float32Array(numParticles * 3);

        for (let i = 0; i < numParticles; i++) {
            const direction = new THREE.Vector3(
                Math.random() * 2 - 1,
                Math.random() * 2 - 1,
                Math.random() * 2 - 1
            ).normalize();
            const velocity = direction.multiplyScalar(explosionSpeed);

            const particle = {
                position: position.clone(),
                velocity: velocity,
            };

            positions.push(particle);
            colors[i * 3] = Math.random();     
            colors[i * 3 + 1] = Math.random();
            colors[i * 3 + 2] = Math.random(); 
        }

        this.explosionParticles = positions;

        this.explosionGeometry = new THREE.BufferGeometry();
        const explosionPositions = new Float32Array(numParticles * 3);
        this.explosionGeometry.setAttribute('position', new THREE.BufferAttribute(explosionPositions, 3));
        this.explosionGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        this.explosionMaterial = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
        });

        this.explosionPoints = new THREE.Points(this.explosionGeometry, this.explosionMaterial);
        this.scene.add(this.explosionPoints);

        this.explosionStartTime = this.elapsedTime;
    }

    update(delta) {
        this.elapsedTime += delta;

        if (!this.hasExploded) {
            this.velocity.add(this.acceleration.clone().multiplyScalar(delta));
            this.position[1] += this.velocity.y * delta;
            this.position[0] += this.velocity.x * delta;
            this.position[2] += this.velocity.z * delta;

            this.geometry.attributes.position.needsUpdate = true;

            if (this.elapsedTime >= this.explodeTime) {
                this.hasExploded = true;
                this.scene.remove(this.particle);
                this.explode(new THREE.Vector3(this.position[0], this.position[1], this.position[2]));
            }
        } else if (this.explosionStartTime !== null) {
            const explosionPositions = this.explosionGeometry.attributes.position.array;

            this.explosionParticles.forEach((particle, index) => {
                particle.velocity.add(this.acceleration.clone().multiplyScalar(delta));
                particle.position.add(particle.velocity.clone().multiplyScalar(delta));

                explosionPositions[index * 3] = particle.position.x;
                explosionPositions[index * 3 + 1] = particle.position.y;
                explosionPositions[index * 3 + 2] = particle.position.z;
            });

            this.explosionGeometry.attributes.position.needsUpdate = true;

            if (this.elapsedTime - this.explosionStartTime >= this.explosionDuration) {
                this.scene.remove(this.explosionPoints);
                this.explosionPoints.geometry.dispose();
                this.explosionPoints.material.dispose();
                this.explosionStartTime = null;
            }
        }
    }
}

export { Firework };
