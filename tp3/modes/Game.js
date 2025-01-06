import { Mode } from './Mode.js';
import { Ballon } from '../models/Ballon.js';
import { Opponent } from '../player/Opponent.js';
import { PowerUp } from '../models/PowerUp.js';
import { SpikeBall } from '../models/SpikeBall.js';
import { Track } from '../models/Track.js';

import * as THREE from 'three';
import { FireworkBox } from '../models/FireworkBox.js';
import { ShaderOutdoor } from '../models/ShaderOutdoor.js';
import { Reader } from '../Reader.js';

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

    /**
     * Initializes the game mode
     */

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

        const points = [
            { type: 'PowerUp', position: { x: 20, y: 30, z: -25 }},
            { type: 'SpikeBall', position: { x: 40, y: 30, z: -70 }},
            { type: 'SpikeBall', position: { x: 60, y: 10, z: -100 }},
        ];
        const reader = new Reader(this.contents.app, this.contents.app.scene);
        reader.readPoints(points)
        this.collidableObjects = reader.collidableObjects;

        this.firework = new FireworkBox(this.contents.app, this.contents.app.scene);
        this.contents.app.scene.add(this.firework);

        this.dmOutdoor = new ShaderOutdoor();
        this.dmOutdoor.position.set(0, 10, -70)
        this.dmOutdoor.scale.set(1, 1, 1);
        this.contents.app.scene.add(this.dmOutdoor);


        console.log("Game mode setup complete.");
    }
    
    /**
     * Updates the game mode
     * @param {number} delta The time delta     * 
     */

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

    /**
     * Handles a collision between the ballon and a collidable object
     * @param {Ballon} ballon The ballon object
     * @param {THREE.Object3D} collidable The collidable object
     */
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

    /**
     * Handles the ballon going out of track
     */
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

    /**
     * Cleans up the game mode
     */
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
