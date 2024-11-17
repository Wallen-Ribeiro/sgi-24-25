import * as THREE from 'three';
import { PrimitiveFactory } from './PrimitiveFactory.js';

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
        this.activeCamera = cameras.initial; // cameras.inital = inital id    
    }

    parseTextures(textures) {
        this.textures = {};
        const mipmapKeys = ['mipmap0', 'mipmap1', 'mipmap2', 'mipmap3', 'mipmap4', 'mipmap5', 'mipmap6', 'mipmap7'];

        Object.keys(textures).forEach((textureId) => {
            const texture = textures[textureId];

            const isVideo = texture.isVideo;

            if (isVideo) {
                this.textures[textureId] = new THREE.VideoTexture()
            } else {
                this.textures[textureId] = new THREE.TextureLoader().load(texture['filepath']);
            }

            for (let i = 0; i <= 7 && texture[mipmapKeys[i]]; i++) {
                this.textures[textureId].mipmaps.push(texture[mipmapKeys[i]]);
            }
        });
    }

    parseMaterials(materials) {
        this.materials = {};

        Object.keys(materials).forEach((materialId) => {
            const material = materials[materialId];
            const textureRef = material['textureref'];
            const texture = textureRef ? this.textures[textureRef] : null;
            const color = new THREE.Color(material['color']['r'], material['color']['g'], material['color']['b']);
            const specular = new THREE.Color(material['specular']['r'], material['specular']['g'], material['specular']['b']);
            const emissive = new THREE.Color(material['emissive']['r'], material['emissive']['g'], material['emissive']['b']);
            const red = new THREE.Color(1, 0, 0);
            const green = new THREE.Color(0, 1, 0);

            this.materials[materialId] = new THREE.MeshPhongMaterial({
                color: color.getHex(),
                specular: specular.getHex(),
                emissive: emissive.getHex(),
                shininess: material['shininess'],
                transparent: material['transparent'],
                opacity: material['opacity'],
                wireframe: material['wireframe'] ?? false,
                // shading: material['shading'] ? 'flat' : 'smooth',
                side: material['twosided'] ? THREE.DoubleSide : THREE.FrontSide,
                map: texture,
                // bumpMap: material['bumpscale'] ?? 'null',
                // specularMap: material['specularref'] ?? 'null',
                // texturelengyh_s
                // texturelengyh_t
            });

            this.materials[materialId].name = materialId;
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
        this.scene = this.nodes[rootId];

        this.applyMaterial(this.scene);

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
                const materialRef = node['materialref'];

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
                    if (materialRef) {
                        group.material = this.materials[materialRef['materialId']];
                    }
                    this.modified = true;
                    node['visited'] = true;

                    const castShadow = this.nodes[nodeId]['castShadow'];
                    const receiveShadow = this.nodes[nodeId]['receiveShadow'];

                    this.nodes[nodeId].castShadow = castShadow ?? false;
                    this.nodes[nodeId].receiveShadow = receiveShadow ?? false;


                    const tranformationsArray = node['transforms'];

                    tranformationsArray?.forEach((transformation) => {
                        const transformation_type = transformation['type'];
                        if (transformation_type === "translate") {
                            this.nodes[nodeId].translateX(transformation["amount"]["x"]);
                            this.nodes[nodeId].translateY(transformation["amount"]["y"]);
                            this.nodes[nodeId].translateZ(transformation["amount"]["z"]);
                        } else if (transformation_type === "rotate") {
                            this.nodes[nodeId].rotateX(this.degreeToRad(transformation["amount"]["x"]))
                            this.nodes[nodeId].rotateY(this.degreeToRad(transformation["amount"]["y"]));
                            this.nodes[nodeId].rotateZ(this.degreeToRad(transformation["amount"]["z"]));
                        } else if (transformation_type === "scale") {
                            this.nodes[nodeId].scale.set(transformation["amount"]["x"],
                                transformation["amount"]["y"], transformation["amount"]["z"]);
                        }
                    });

                    return group;
                }

                return null;

            case 'noderef':
                if (this.nodes[nodeId]) {
                    this.modified = true;
                    const clone = this.nodes[nodeId].clone();
                    clone.material = this.nodes[nodeId].material;
                    if (node['materialref']) {
                        clone.material = this.materials[node['materialref']];
                    }
                    return clone;
                }
                return null;
            default:
                this.modified = true;
                return this.createPrimitive(node, nodeId);
        }
    }


    createPrimitive(node, nodeId) {
        const material = this.materials[node['materialref']];
        // const material = this.materials['floorApp'];
        switch (node['type']) {
            case 'rectangle':
                return PrimitiveFactory.createRectangleFromYASF(node, material);
            case 'triangle':
                return PrimitiveFactory.createTriangleFromYASF(node, material);
            case 'box':
                return PrimitiveFactory.createBoxFromYASF(node, material);
            case 'cylinder':
                return PrimitiveFactory.createCylinderFromYASF(node, material);
            case 'sphere':
                return PrimitiveFactory.createSphereFromYASF(node, material);
            case 'nurbs':
                return PrimitiveFactory.createNurbsCurveFromYASF(node, material);
            case 'polygon':
                return PrimitiveFactory.createPolygonFromYASF(node, material);
            case 'pointlight':
                return PrimitiveFactory.createPointLightFromYASF(node);
            case 'spotlight':
                return PrimitiveFactory.createSpotLightFromYASF(node);
            case 'directionallight':
                return PrimitiveFactory.createDirectionalLightFromYASF(node);
            default:
                console.error('Unknown primitive type: ' + node['type']);
                return;
        }
    }

    degreeToRad(degree) {
        const rad = degree * Math.PI / 180;
        return rad;
    }

    applyMaterial(node, material = null) {
        if (node.isMesh && material) {
            node.material = material;
        } else if (node.material) {
            material = node.material;
        } else if (material) {
            node.material = material;
        }
        for (let i = 0; i < node.children.length; i++) {
            this.applyMaterial(node.children[i], material);
        }
    }
}

export { SceneGraph };
