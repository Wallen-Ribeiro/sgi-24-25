import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';

/**
    This class customizes the gui interface for the app
*/
class MyGuiInterface  {

    /**
     * 
     * @param {MyApp} app The application object 
     */
    constructor(app) {
        this.app = app
        this.datgui =  new GUI();
        this.contents = null
    }

    /**
     * Set the contents object
     * @param {MyContents} contents the contents objects 
     */
    setContents(contents) {
        this.contents = contents
    }

    /**
     * Initialize the gui interface
     */
    init() {

        const trackFolder = this.datgui.addFolder('Track');
        trackFolder
            .add(this.contents, "trackWidth", 10, 15)
            .step(0.5)
            .name("track width")
            .onChange(value => {
                this.contents.track.updateWidth(value);
                this.contents.track.update();
            });
    }
}

export { MyGuiInterface };