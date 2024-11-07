class SceneGraph {

    constructor() {
        this.backgroundColor = null;
        this.ambientLight = null;
    }

    parse(data) {

        const yasf = data['yasf'];
        this.parseGlobals(yasf['globals'], yasf['fog'], yasf['skybox']); // globals, fog and skybox
        this.parseCameras(yasf['cameras']);
        this.parseTextures(yasf['textures']);
        this.parseMaterials(yasf['materials']);
        this.parseGraph(yasf['graph']);

    }

    parseGlobals(globals, fog, skybox) {
        const background = globals['background'];
        this.backgroundColor = { 'r': background['r'], 'g': background['g'], 'b': background['b'] };

        const ambient = globals['ambient'];
        this.ambientLight = {
            'color': { 'r': ambient['r'], 'g': ambient['g'], 'b': ambient['b'] },
            'intensity': ambient['intensity']
        };

        this.skybox = {
            'size': { 'x': skybox['size']['x'], 'y': skybox['size']['y'], 'z': skybox['size']['z'] },
            'center': { 'x': skybox['center']['x'], 'y': skybox['center']['y'], 'z': skybox['center']['z'] },
            'emissive': { 'r': skybox['emissive']['r'], 'g': skybox['emissive']['g'], 'b': skybox['emissive']['b'] },
            'intensity': skybox['intensity'],
            'texture': {
                'front': skybox['front'],
                'back': skybox['back'],
                'up': skybox['up'],
                'down': skybox['down'],
                'left': skybox['left'],
                'right': skybox['right'],
            }
        };

        this.fog = {
            'color': { 'r': fog['color']['r'], 'g': fog['color']['g'], 'b': fog['color']['b'] },
            'near': fog['near'],
            'far': fog['far']
        };
    }

    parseCameras(cameras) {
        // TODO
    }

    parseTextures(textures) {
        // TODO
    }

    parseMaterials(materials) {
        // TODO
    }

    parseGraph(graph) {
        // TODO
    }

}

export { SceneGraph };
