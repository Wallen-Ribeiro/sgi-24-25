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

            const isVideo = texture.isVideo;

            if (isVideo){
                this.textures[textureId] = new THREE.VideoTexture()
            } else {
                this.textures[textureId] = new THREE.TextureLoader().load(texture['filepath']);
            }
            
            for(let i = 0; i <= 7 && texture[mipmapKeys[i]]; i++) {
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
        delete graph['rootid'];

        this.nodes = {};
        this.modified = true;
        while (this.modified) {
            this.modified = false;
            Object.keys(graph).forEach((nodeId) => {
                this.visitNode(graph[nodeId], nodeId);
            });
        }

        console.log(this.nodes);
        return this.nodes[rootId];

    }


    visitNode(node, nodeId) {
        let visited = node['visited'] ?? false;

        if (visited) {
            return null;
        }

        const type = node['type'];

        switch (type) {
            case 'node':
                const group = new THREE.Group();
                visited = true;
                const children = node['children'];
                const materialRef= node['materialref'];

                if (materialRef){
                    const materialId = materialRef['materialId'];
                    const parentMaterial = this.materials[materialId];
                    Object.keys(children).forEach((child) => {
                        if (child instanceof THREE.Mesh) {
                            child.material = parentMaterial;
                        }
                    });
                }

                Object.keys(children).forEach((childId) => {
                    const childNode = this.visitNode(children[childId], childId);
                    if (childNode) {
                        group.add(childNode);
                    } else {
                        visited = false;
                        return;
                    }
                });

                if (visited) {
                    this.nodes[nodeId] = group;
                    group.name = nodeId;
                    this.modified = true;
                    node['visited'] = true;

                    const castShadows = this.nodes[nodeId]['castShadows'];
                    const receiveShadows = this.nodes[nodeId]['receiveShadows'];

                    this.nodes[nodeId].castShadows = castShadows ?? false;
                    this.nodes[nodeId].receiveShadows = receiveShadows ?? false;


                    const tranformationsArray = node['transforms'];

                    tranformationsArray?.forEach((transformation) => {
                        const transformation_type = transformation['type'];
                        if (transformation_type === "translate"){
                            this.nodes[nodeId].translateX(transformation["amount"]["x"]) 
                            this.nodes[nodeId].translateY(transformation["amount"]["y"]);
                            this.nodes[nodeId].translateZ(transformation["amount"]["z"]);
                        } else if (transformation_type === "rotate"){
                            this.nodes[nodeId].rotateX(transformation["amount"]["x"]) 
                            this.nodes[nodeId].rotateY(transformation["amount"]["y"]);
                            this.nodes[nodeId].rotateZ(transformation["amount"]["z"]);
                        } else if (transformation_type === "scale"){
                            this.nodes[nodeId].scale.set(new THREE.Vector3(transformation["amount"]["x"],
                                 transformation["amount"]["y"], transformation["amount"]["z"]));
                        }
                    });

                    return group;
                }

                return null;

            case 'noderef':
                if (this.nodes[nodeId]) {
                    this.modified = true;
                    return this.nodes[nodeId].clone();
                }
                return null;
            default:
                this.modified = true;
                return this.createPrimitive(node, nodeId);
        }
    }


    createPrimitive(node, nodeId) {
        switch (node['type']) {
            case 'rectangle':
                break;
            case 'triangle':
                break;
            case 'box':
                break;
            case 'cylinder':
                break;
            case 'sphere':
                break;
            case 'nurbs':
                break;
            case 'polygon':
                break;
            case 'pointlight':
                break;
            case 'spotlight':
                break;
            case 'directionallight':
                break;
        }

        this.nodes[nodeId] = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
        this.nodes[nodeId].name = nodeId;
        return this.nodes[nodeId];
    }
}

export { SceneGraph };
