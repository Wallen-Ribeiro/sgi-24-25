import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';
import { Game } from './modes/Game.js';

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
        this.contents = contents;
        this.contents.onModeChange = this.updateGui.bind(this);
    }

    /**
     * Initialize the gui interface
     */
    init() {
        this.updateGui();
        
        const cameraFolder = this.datgui.addFolder('Camera');
        const cameraOptions = {
            'Perspective': 'Perspective',
            'First Person': 'FirstPerson',
            'Third Person': 'ThirdPerson',
            'Left': 'Left',
            'Top': 'Top',
            'Front': 'Front'
        };

        cameraFolder
            .add(this.app, 'activeCameraName', cameraOptions)
            .name('Camera Mode')
            .onChange(value => {
                this.app.setActiveCamera(value);
            });
    }

    /**
     * Update the GUI based on the current mode
     */
    updateGui() {
        const gameMode = this.contents.getCurrentMode();
        if (gameMode instanceof Game) {
            const trackFolder = this.datgui.addFolder('Track');
            trackFolder
                .add(gameMode.track, "width", 30, 40)
                .step(0.5)
                .name("track width")
                .onChange(value => {
                    gameMode.track.updateWidth(value);
                    gameMode.track.update();
                });
        }
    }
}

export { MyGuiInterface };