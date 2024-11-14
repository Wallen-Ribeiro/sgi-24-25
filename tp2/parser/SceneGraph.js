import * as THREE from 'three';

class SceneGraph {

    constructor() {
        this.backgroundColor = null;
        this.ambientLight = null;
    }

    parse(data) {
        const yasf = data['yasf'];
        this.parseGlobals(yasf['globals'], yasf['fog']); // globals, fog and skybox
        this.parseCameras(yasf['cameras']);
        this.parseTextures(yasf['textures']);
        this.parseMaterials(yasf['materials']);
        //this.parseSkyBox(yasf['skybox'])
        this.parseGraph(yasf['graph']);
    }

    parseGlobals(globals, fog) {
        const background = globals['background'];
        this.backgroundColor = new THREE.Color(background['r'], background['g'], background['b']);

        const ambient = globals['ambient'];
        this.ambientLight = new THREE.AmbientLight(new THREE.Color(ambient['r'], ambient['g'], ambient['b']), ambient['intensity']);

        this.fog = new THREE.Fog(fog['color']['r'], fog['color']['g'], fog['color']['b'], fog['near'], fog['far']);
    }

    parseCameras(cameras) {

        this.cameras = {};

        for (const [id, camera] of Object.entries(cameras)) {
            if (camera.type === 'orthogonal') {
                const orthogonalCamera = new THREE.OrthographicCamera(camera.left, camera.right, camera.top, camera.bottom, camera.near, camera.far);
                orthogonalCamera.position.set(new THREE.Vector3(camera.location.x, camera.location.y, camera.location.z));
                orthogonalCamera.lookAt(new THREE.Vector3(camera.target.x, camera.target.y, camera.target.z));
                this.cameras[id] = orthogonalCamera;
            }
            else if (camera.type === 'perspective') {
                const perspectiveCamera = new THREE.PerspectiveCamera(camera.angle, 1, camera.near, camera.far);
                perspectiveCamera.position.set(new THREE.Vector3(camera.location.x, camera.location.y, camera.location.z));
                perspectiveCamera.lookAt(new THREE.Vector3(camera.target.x, camera.target.y, camera.target.z));
                this.cameras[id] = perspectiveCamera;
            }
        }
        this.activeCamera = this.cameras[cameras.initial]; // cameras.inital = inital id    
    }

    parseTextures(textures) {
        this.textures = {};
        const mipmapKeys = ['mipmap0', 'mipmap1', 'mipmap2', 'mipmap3', 'mipmap4', 'mipmap5', 'mipmap6', 'mipmap7'];

        Object.keys(textures).forEach((textureId) => {
            const texture = textures[textureId];

            this.textures[textureId] = new THREE.TextureLoader().load(texture['filepath']);
            for (let i = 0; i <= 7 && texture[mipmapKeys[i]]; i++) {
                this.textures[textureId].mipmaps.push(texture[mipmapKeys[i]]);
            }
        });
    }

    parseMaterials(materials) {
        this.materials = {};

        Object.keys(materials).forEach((materialId) => {
            const material = materials[materialId];

            this.materials[materialId] = new THREE.MeshPhongMaterial({
                color: new THREE.Color(material['color']['r'], material['color']['g'], material['color']['b']),
                specular: new THREE.Color(material['specular']['r'], material['specular']['g'], material['specular']['b']),
                emissive: new THREE.Color(material['emissive']['r'], material['emissive']['g'], material['emissive']['b']),
                shininess: material['shininess'],
                transparent: material['transparent'],
                opacity: material['opacity'],
                wireframe: material['wireframe'] ?? false,
                shading: material['shading'] ? 'flat' : 'smooth',
                side: material['twosided'] ? THREE.DoubleSide : THREE.FrontSide,
                map: material['textureref'] ?? 'null',
                bumpMap: material['bumpscale'] ?? 'null',
                specularMap: material['specularref'] ?? 'null',
                // texturelengyh_s
                // texturelengyh_t
            })

        });
    }

    parseSkyBox(skybox) {
        this.geometry = new THREE.BoxGeometry(skybox['size'], skybox['size'], skybox['size']);

        const ft = new THREE.TextureLoader().load(skybox['front']);
        const bk = new THREE.TextureLoader().load(skybox['back']);
        const up = new THREE.TextureLoader().load(skybox['up']);
        const dn = new THREE.TextureLoader().load(skybox['down']);
        const rt = new THREE.TextureLoader().load(skybox['right']);
        const lf = new THREE.TextureLoader().load(skybox['left']);


        const materials = [
            new THREE.MeshBasicMaterial({ map: rt, side: THREE.BackSide }),
            new THREE.MeshBasicMaterial({ map: lf, side: THREE.BackSide }),
            new THREE.MeshBasicMaterial({ map: up, side: THREE.BackSide }),
            new THREE.MeshBasicMaterial({ map: dn, side: THREE.BackSide }),
            new THREE.MeshBasicMaterial({ map: ft, side: THREE.BackSide }),
            new THREE.MeshBasicMaterial({ map: bk, side: THREE.BackSide })
        ];

        materials.forEach(material => {
            material.emissive = new THREE.Color(skybox['emissive']['r'], skybox['emissive']['g'], skybox['emissive']['b']);
            material.emissiveIntensity = skybox['emissive']['intensity'];
        });

        this.skybox = new THREE.Mesh(this.geometry, materials);
        this.skybox.position.set(new THREE.Vector3(skybox['center']['x'], skybox['center']['y'], skybox['center']['z']));

    }

    parseGraph(graph) {
        const rootId = graph['rootid']

        this.nodes = {};
        this.modified = true;
        while (this.modified) {
            this.modified = false;
            Object.keys(graph).forEach((nodeId) => {
                this.visitNode(graph[nodeId], nodeId);
            });
        }

        return this.nodes[rootId];

    }

    visitNode(node, nodeId) {
        if (this.nodes[nodeId]) {
            if (node['children']) {
                let group = this.nodes[nodeId];
                for (const child of node['children']) {
                    const childNode = this.visitNode(child, child['id']);
                    if (childNode) {
                        group.add(childNode);
                    }
                }
            }

            return null;
        } else {
            // not visited yet

            const type = node['type'];

            switch (type) {
                case 'node':
                    this.modified = true;
                    group = new THREE.Group();
                    this.nodes[nodeId] = group;

                    // transforms (opt)
                    // materialref (opt)
                    // castshadows (opt)
                    // receiveshadows (opt)
                    for (const child of node['children']) {
                        const childNode = this.visitNode(child, child['id']);
                        if (childNode) {
                            group.add(childNode);
                        }
                    }

                    return group;
                case 'noderef':
                    if (this.nodes[node['nodeid']]) {
                        this.modified = true;
                        this.nodes[nodeId] = ""; // as its a ref, it should not be referenced? marking as visited only
                        return this.nodes[node['nodeid']].clone();
                    }
                    return null;
                default:
                    this.modified = true;
                    return createPrimitive(node, nodeId);
            }

        }

    }

    createPrimitive(node, nodeId) {

    }
}

export { SceneGraph };
