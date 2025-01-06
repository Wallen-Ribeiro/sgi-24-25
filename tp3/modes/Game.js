import { Mode } from './Mode.js';
import { Ballon } from '../models/Ballon.js';
import { Opponent } from '../player/Opponent.js';
import { PowerUp } from '../models/PowerUp.js';
import { SpikeBall } from '../models/SpikeBall.js';
import { Track } from '../models/Track.js';

import * as THREE from 'three';
import { FireworkBox } from '../models/FireworkBox.js';

class Game extends Mode {
    constructor(contents, player1, player2) {
        super(contents);
        this.ballon = null;
        this.opponent = null;
        this.collidableObjects = [];
        this.track = null;
        this.player1 = player1;
        this.player2 = player2;
    }

    getTrack() {
        return this.track;
    }

    init() {
        console.log("Game mode initialized.");
        

        this.ballon = new Ballon(this.player1);
        this.contents.app.scene.add(this.ballon);
        this.contents.app.scene.add(this.ballon.shadow);
        this.ballon.position.set(0, 30, 0);

        this.opponent = new Opponent(this.player2);
        this.contents.app.scene.add(this.opponent);

        this.track = new Track(this.contents.trackWidth);
        this.contents.app.scene.add(this.track);
        const samplePoints = 300;
        this.trackPoints = this.track.path.getPoints(samplePoints);
        for(let i = 0; i < samplePoints; i++) {
            this.trackPoints[i].setX(-this.trackPoints[i].x);
        } 

        const powerUp = new PowerUp();
        powerUp.position.set(20, 30, -25);
        powerUp.scale.set(1.5, 1.5, 1.5);
        this.collidableObjects.push(powerUp);
        this.contents.app.scene.add(powerUp);

        this.spikeBall1 = new SpikeBall();
        this.spikeBall1.position.set(40, 30, -70);
        this.spikeBall1.scale.set(2.5, 2.5, 2.5);
        this.collidableObjects.push(this.spikeBall1);
        this.contents.app.scene.add(this.spikeBall1);

        const spikeBall2 = new SpikeBall();
        spikeBall2.scale.set(2.5, 2.5, 2.5);
        spikeBall2.position.set(60, 10, -100);
        this.collidableObjects.push(spikeBall2);
        this.contents.app.scene.add(spikeBall2);

        this.firework = new FireworkBox(this.contents.app, this.contents.app.scene);
        this.contents.app.scene.add(this.firework);


        console.log("Game mode setup complete.");
    }

    update(delta) {
        if (this.contents.outdoor) this.contents.outdoor.update(delta, this.ballon.layer, this.ballon.vouchers, 0, 1);
        if (this.firework) this.firework.update(delta);
        if (this.ballon) this.ballon.update();
        if (this.opponent) this.opponent.update();

        this.handleOutOfTrack();

        if(this.ballon.invencible) {
            return;
        }

        // Handle Collisions (and collidable updates)
        this.collidableObjects.forEach((collidable) => {
            const distance = this.ballon.position.distanceTo(collidable.position);
            const sumRadius = this.ballon.radius + collidable.radius;

            if(collidable.update) {
                collidable.update();
            }

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
