import * as THREE from 'three';
import { TextRender } from './Text.js';

/**
 * This class contains a 3D outdoor
 */

class Outdoor extends THREE.Object3D {

    /**
     * builds the outdoor object
     */
    constructor() {
        super();

        this.layer = 0;
        this.layersText = [];
        this.timeText = null;
        this.time = null;
        this.timeSecs = 0;
        this.timeMin = 0;
        this.timeSec = 0;
        this.lapsText = null;
        this.numLaps = null;
        this.intLaps = 0;
        this.airLayer = null;
        this.voucherText = null;
        this.numVouchers = null;
        this.intVouchers = 0;
        this.gameStatus = null;
        this.statusText = [];

        this.buildModel();
        this.init();
    }

    /**
     * Initializes the outdoor object
     * @returns {void}
     */
    init()  {
        const text_width = 2.0;
        const text_heigth = 2.5;
        this.layer = 0;
        this.layersText.push(new TextRender('Layer: 0 (Stopped)', 2.0, 2.5));
        this.layersText[0].position.set(-18, 12, 0.01);
        this.layersText.push(new TextRender('Layer: 1 (North)', 2.0, 2.5));
        this.layersText[1].position.set(-18, 12, 0.01);
        this.layersText.push(new TextRender('Layer: 2 (South)', 2.0, 2.5));
        this.layersText[2].position.set(-18, 12, 0.01);
        this.layersText.push(new TextRender('Layer: 3 (East)', 2.0, 2.5));
        this.layersText[3].position.set(-18, 12, 0.01);
        this.layersText.push(new TextRender('Layer: 4 (West)', 2.0, 2.5));
        this.layersText[4].position.set(-18, 12, 0.01);

        this.voucherText = new TextRender('Vouchers:', 2.0, 2.5);
        this.voucherText.position.set(-18, 9.5, 0.01);
        this.numVouchers = new TextRender('0', 2.0, 2.5);
        this.numVouchers.position.set(2, 9.5, 0.01);

        this.lapsText = new TextRender('Laps:', 2.0, 2.5);
        this.lapsText.position.set(-18, 7.0, 0.01);
        this.numLaps = new TextRender('0', 2.0, 2.5);
        this.numLaps.position.set(-6, 7.0, 0.01);

        this.timeText = new TextRender('Time:', 2.0, 2.5);
        this.timeText.position.set(-18, 4.5, 0.01);
        this.time = new TextRender('00:00', 2.0, 2.5);
        this.time.position.set(-6, 4.5, 0.01);

        this.gameStatus = 1;
        this.statusText.push(new TextRender('Paused!', 3.0, 4.5));
        this.statusText[0].position.set(-8, 0, 0.01);
        this.statusText.push(new TextRender('Running!', 3.0, 4.5));
        this.statusText[1].position.set(-10, 0, 0.01);


        this.add(this.layersText[this.layer]);
        this.add(this.voucherText);
        this.add(this.numVouchers);
        this.add(this.lapsText);
        this.add(this.numLaps);
        this.add(this.timeText);
        this.add(this.time);
        this.add(this.statusText[this.gameStatus]);
    }

    /**
     * Builds the outdoor model
     * @returns {void}
     */
    buildModel() {
        const leg = new THREE.BoxGeometry(1, 30, 1);
        const bar = new THREE.BoxGeometry(40, 1, 1);
        const plane = new THREE.PlaneGeometry(40, 20);

        const metalMaterial = new THREE.MeshPhongMaterial({
                color: "#aaafb5",
                specular: "#000000",
                emissive: "#000000",
        });
        const backgroundMaterial = new THREE.MeshLambertMaterial({
                color: "#ffffff",
                emissive: "#ffffff",
                side: THREE.DoubleSide
        });

        const leg1 = new THREE.Mesh(leg, metalMaterial);
        const leg2 = new THREE.Mesh(leg, metalMaterial);
        const bar1 = new THREE.Mesh(bar, metalMaterial);
        const bar2 = new THREE.Mesh(bar, metalMaterial);
        const bg = new THREE.Mesh(plane, backgroundMaterial);
        
        leg1.translateX(-20);
        leg2.translateX(20);
        bg.translateY(5);
        bar1.translateY(14.5);
        bar2.translateY(-4.5);


        this.add(leg1);
        this.add(leg2);
        this.add(bar1);
        this.add(bar2);
        this.add(bg);
    }

    /**
     * Updates the outdoor panel object
     * @param {number} delta The time delta
     * @param {number} layer The current layer
     * @param {number} vouchers The number of vouchers
     * @param {number} laps The number of laps
     * @param {number} status The game status
     */
    update(delta, layer, vouchers, laps, status) {
        if(status == 1)
            this.updateTime(delta)

        if(layer != this.layer)
            this.updateLayer(layer)

        if(vouchers != this.intVouchers)
            this.updateVouchers(vouchers)

        if(laps != this.intLaps)
            this.updateLaps(laps)

        if(status != this.status)
            this.updateStatus(status)
    }

    /**
     * Updates the time
     * @param {number} delta The time delta
     */
    updateTime(delta) {
        this.timeSecs += delta;
        const rounded = Math.floor(this.timeSecs);
        if(rounded > this.timeSec) {
            if(rounded < 60) {
                this.timeSec = rounded;
            } else {
                this.timeSecs -= 60.0;
                this.timeSec = 0;
                this.timeMin += 1;
            }
            let a = this.numberToString(this.timeSec);
            let b = this.numberToString(this.timeMin);
            this.time.updateText(this.numberToString(b + ':' + a));
        }
    }

    /**
     * Converts a number to a string
     * @param {number} number The number to convert
     * @returns {string} The converted number
     */
    numberToString(number) {
        if(number < 10)
            return '0' + number;
        return number.toString()
    }

    /**
     * Updates the layer
     * @param {number} layer The current layer
     */
    updateLayer(layer) {
        this.remove(this.layersText[this.layer]);
        this.layer = layer;
        this.add(this.layersText[this.layer])
    }

    /**
     * Updates the vouchers
     * @param {number} vouchers The number of vouchers
     */
    updateVouchers(vouchers) {
        this.intVouchers = vouchers;
        this.numVouchers.updateText(vouchers.toString());

    }

    updateLaps(laps) {
        
    }

    updateStatus(status) {

    }

}

export { Outdoor };
