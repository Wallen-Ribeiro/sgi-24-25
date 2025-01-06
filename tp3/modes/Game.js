import { Mode } from './Mode.js';
import { Ballon } from '../models/Ballon.js';
import { Opponent } from '../player/Opponent.js';
import { PowerUp } from '../models/PowerUp.js';
import { SpikeBall } from '../models/SpikeBall.js';
import { Track } from '../models/Track.js';

class Game extends Mode {
    constructor(contents) {
        super(contents);
        this.ballon = null;
        this.opponent = null;
        this.collidableObjects = [];
        this.track = null;
    }

    init() {
        console.log("Game mode initialized.");

        this.ballon = new Ballon();
        this.contents.app.scene.add(this.ballon);
        this.contents.app.scene.add(this.ballon.shadow);

        this.opponent = new Opponent();
        this.opponent.init();
        this.contents.app.scene.add(this.opponent);

        this.track = new Track(this.contents.trackWidth);
        this.contents.app.scene.add(this.track);

        const powerUp = new PowerUp();
        powerUp.position.set(20, 4, 0);
        this.collidableObjects.push(powerUp);
        this.contents.app.scene.add(powerUp);

        const spikeBall1 = new SpikeBall();
        spikeBall1.position.set(40, 4, 0);
        this.collidableObjects.push(spikeBall1);
        this.contents.app.scene.add(spikeBall1);

        const spikeBall2 = new SpikeBall();
        spikeBall2.position.set(60, 4, 0);
        this.collidableObjects.push(spikeBall2);
        this.contents.app.scene.add(spikeBall2);

        console.log("Game mode setup complete.");
    }

    update() {
        if (this.ballon) this.ballon.update();
        if (this.opponent) this.opponent.update();

        // Handle Collisions
        this.collidableObjects.forEach((collidable) => {
            const distance = this.ballon.position.distanceTo(collidable.position);
            const sumRadius = this.ballon.radius + collidable.radius;

            if (distance < sumRadius) {
                console.log("Collision detected in game mode.");
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
                console.log(`Balloon vouchers: ${ballon.vouchers}`);
                break;

            case "OBSTACLE":
                if (ballon.vouchers > 0) {
                    ballon.vouchers -= 1;
                    ballon.setInvencible();
                } else {
                    ballon.setStunned();
                }
                console.log(`Balloon vouchers: ${ballon.vouchers}`);
                break;

            default:
                console.log("Unknown collision type.");
                break;
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
