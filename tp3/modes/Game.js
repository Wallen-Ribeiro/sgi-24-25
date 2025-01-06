import { Mode } from './Mode.js';
import { Ballon } from '../models/Ballon.js';
import { Opponent } from '../player/Opponent.js';
import { PowerUp } from '../models/PowerUp.js';
import { SpikeBall } from '../models/SpikeBall.js';
import { Track } from '../models/Track.js';
import * as THREE from 'three';

class Game extends Mode {
    constructor(contents) {
        super(contents);
        this.ballon = null;
        this.opponent = null;
        this.collidableObjects = [];
        this.track = null;
    }

    getTrack() {
        return this.track;
    }

    init() {
        console.log("Game mode initialized.");

        this.ballon = new Ballon();
        this.contents.app.scene.add(this.ballon);
        this.contents.app.scene.add(this.ballon.shadow);
        this.ballon.position.set(0, 30, 0);

        this.opponent = new Opponent();
        this.opponent.init();
        this.contents.app.scene.add(this.opponent);

        this.track = new Track(this.contents.trackWidth);
        this.contents.app.scene.add(this.track);
        const samplePoints = 300;
        this.trackPoints = this.track.path.getPoints(samplePoints);
        for(let i = 0; i < samplePoints; i++) {
            this.trackPoints[i].setX(-this.trackPoints[i].x);
        } 

        const powerUp = new PowerUp();
        powerUp.position.set(20, 30, 0);
        this.collidableObjects.push(powerUp);
        this.contents.app.scene.add(powerUp);

        const spikeBall1 = new SpikeBall();
        spikeBall1.position.set(40, 30, 0);
        this.collidableObjects.push(spikeBall1);
        this.contents.app.scene.add(spikeBall1);

        const spikeBall2 = new SpikeBall();
        spikeBall2.position.set(60, 4, 0);
        this.collidableObjects.push(spikeBall2);
        this.contents.app.scene.add(spikeBall2);

        console.log("Game mode setup complete.");
    }

    update(delta) {
        if (this.contents.outdoor) this.contents.outdoor.update(delta, this.ballon.layer, this.ballon.vouchers, 0, 1);
        if (this.ballon) this.ballon.update();
        if (this.opponent) this.opponent.update();

        this.handleOutOfTrack();

        if(this.ballon.invencible) {
            return;
        }

        // Handle Collisions
        this.collidableObjects.forEach((collidable) => {
            const distance = this.ballon.position.distanceTo(collidable.position);
            const sumRadius = this.ballon.radius + collidable.radius;

            if (distance < sumRadius) {
                this.handleCollision(this.ballon, collidable);
            }
        });
    }

    handleCollision(ballon, collidable) {
        const type = collidable.type ?? "";
        console.log(`Collision with: ${type}`);

        switch (type) {
            case "POWERUP":
                ballon.vouchers += 1;
                ballon.setInvencible();
                break;

            case "OBSTACLE":
                if (ballon.vouchers > 0) {
                    ballon.vouchers -= 1;
                    ballon.setInvencible();
                } else {
                    ballon.setStunned();
                }
                break;

            default:
                console.log("Unknown collision type.");
                break;
        }
    }

    handleOutOfTrack() {
        const position = this.ballon.shadow.position;

        let minDistance = Infinity;
        let closestPoint = null
        this.trackPoints.forEach((point) => {
            const distance = position.distanceTo(point);
            if(distance < minDistance) {
                minDistance = distance;
                closestPoint = point;
            }
        });

        if(minDistance > this.track.width + this.ballon.shadowRadius) {
            if(this.ballon.vouchers > 0) {
                this.ballon.vouchers -= 1;
                this.ballon.setInvencible();
            } else {
                this.ballon.setStunned();
            }
            this.ballon.position.setX(closestPoint.x)
            this.ballon.position.setZ(closestPoint.z)
        }

    }

    cleanup() {
        console.log("Cleaning up game mode.");

        if (this.ballon) {
            this.contents.app.scene.remove(this.ballon);
            this.contents.app.scene.remove(this.ballon.shadow);
            this.ballon = null;
        }

        if (this.opponent) {
            this.contents.app.scene.remove(this.opponent);
            this.opponent = null;
        }

        if (this.track) {
            this.contents.app.scene.remove(this.track);
            this.track = null;
        }

        this.collidableObjects.forEach((collidable) => {
            this.contents.app.scene.remove(collidable);
        });
        this.collidableObjects = [];
    }
}

export { Game };
