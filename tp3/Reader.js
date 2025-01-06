import { PowerUp } from "./models/PowerUp.js";
import { SpikeBall } from "./models/SpikeBall.js";

class Reader {
    constructor(app, scene) {
        this.app = app;
        this.scene = scene;
        this.collidableObjects = [];
    }

    readPoints(points) {
        points.forEach(point => {
            let object;

            switch (point.type) {
                case 'PowerUp':
                    object = new PowerUp();
                    break;
                case 'SpikeBall':
                    object = new SpikeBall();
                    break;
                default:
                    console.warn(`Unknown object type: ${point.type}`);
                    return;
            }

            object.position.set(point.position.x, point.position.y, point.position.z);

            this.collidableObjects.push(object);
            this.scene.add(object);
        });
    }
}

export { Reader };