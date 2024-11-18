import * as THREE from 'three';
import { PrimitiveFactory } from './PrimitiveFactory.js';

class SceneGraph {

    constructor() {
        this.backgroundColor = null;
        this.ambientLight = null;
    }

    parse(data) {
        const yasf = data['yasf'];
        this.parseGlobals(yasf['globals']); // globals, fog and skybox
        this.parseCameras(yasf['cameras']);
        this.parseTextures(yasf['textures']);
        this.parseMaterials(yasf['materials']);
        this.parseGraph(yasf['graph']);
    }

    parseGlobals(globals) {
        const background = globals['background'];
        this.backgroundColor = new THREE.Color(background['r'], background['g'], background['b']);

        const ambient = globals['ambient'];
        this.ambientLight = new THREE.AmbientLight(new THREE.Color(ambient['r'], ambient['g'], ambient['b']), ambient['intensity']);

        const fog = globals['fog'];
        this.fog = new THREE.Fog(fog['color']['r'], fog['color']['g'], fog['color']['b'], fog['near'], fog['far']);

        const skybox = globals['skybox'];
        this.parseSkyBox(skybox);
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
        this.geometry = new THREE.BoxGeometry(skybox['size']['x'], skybox['size']['y'], skybox['size']['z']);

        const ft = new THREE.TextureLoader().load(skybox['front']);
        const bk = new THREE.TextureLoader().load(skybox['back']);
        const up = new THREE.TextureLoader().load(skybox['up']);
        const dn = new THREE.TextureLoader().load(skybox['down']);
        const rt = new THREE.TextureLoader().load(skybox['right']);
        const lf = new THREE.TextureLoader().load(skybox['left']);

        const emissiveColor = new THREE.Color(skybox['emissive']['r'], skybox['emissive']['g'], skybox['emissive']['b']);
        const emissiveIntensity = skybox['intensity'];
        const emissiveHex = emissiveColor.getHex();

        const materials = [
            new THREE.MeshPhongMaterial({ map: rt, side: THREE.BackSide, emissive: emissiveHex, emissiveIntensity: emissiveIntensity }),
            new THREE.MeshPhongMaterial({ map: lf, side: THREE.BackSide, emissive: emissiveHex, emissiveIntensity: emissiveIntensity }),
            new THREE.MeshPhongMaterial({ map: up, side: THREE.BackSide, emissive: emissiveHex, emissiveIntensity: emissiveIntensity }),
            new THREE.MeshPhongMaterial({ map: dn, side: THREE.BackSide, emissive: emissiveHex, emissiveIntensity: emissiveIntensity }),
            new THREE.MeshPhongMaterial({ map: ft, side: THREE.BackSide, emissive: emissiveHex, emissiveIntensity: emissiveIntensity }),
            new THREE.MeshPhongMaterial({ map: bk, side: THREE.BackSide, emissive: emissiveHex, emissiveIntensity: emissiveIntensity })
        ];

        // materials.forEach(material => {
        //     material.emissive = new THREE.Color(skybox['emissive']['r'], skybox['emissive']['g'], skybox['emissive']['b']);
        //     material.emissiveIntensity = skybox['intensity'];
        // });

        this.skybox = new THREE.Mesh(this.geometry, materials);
        this.skybox.position.set(new THREE.Vector3(skybox['center']['x'], skybox['center']['y'], skybox['center']['z']));

    }

    parseGraph(graph) {
        this.graph = graph;
        const rootId = graph['rootid']
        delete graph['rootid'];
        graph[rootId]['id'] = rootId;

        this.nodes = {};

        this.scene = this.buildNode(graph[rootId]);

        return this.nodes[rootId];

    }

    createPrimitive(node, materialref) {
        let material = null;
        if (materialref && this.materials[materialref]) {
            material = this.materials[materialref];
        } else {
            material = new THREE.MeshPhongMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
        }
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
                console.error('Unknown primitive type: ' + node['type'] + ' for node ' + nodeId);
                return;
        }
    }

    degreeToRad(degree) {
        const rad = degree * Math.PI / 180;
        return rad;
    }

    buildNodeRef(nodeId, materialRef = null) {
        let node = null;

        Object.keys(this.graph).forEach((graphChildId) => {
            if (graphChildId === nodeId) {
                this.graph[graphChildId]['id'] = graphChildId;
                node = this.buildNode(this.graph[graphChildId], materialRef);
            }
        });

        return node;
    }

    buildNode(node, materialRef = null) {
        const type = node['type'];

        if (type !== 'node') {
            console.error('Reference to a non-node type');
            return null;
        }

        const group = new THREE.Group();
        group.name = node['id'];
        const children = node['children'];
        if (node['materialref']) {
            materialRef = node['materialref']['materialId'];
        }

        Object.keys(children).forEach((childId) => {
            const child = children[childId];
            child['id'] = childId;
            const childType = child['type'];

            if (childType === 'node') {
                console.error('Node cannot be a child of another node');
                return null;
            }

            switch (childType) {
                case 'noderef':
                    // if (this.nodes[childId]) {
                    //     const clone = this.nodes[childId].clone();
                    //     group.add(clone);
                    // } else {
                    const newRef = this.buildNodeRef(childId, materialRef);
                    if (!newRef) {
                        console.error('Couldn\'t build reference to node ' + childId);
                        return null;
                    }
                    group.add(newRef);
                    // }
                    break;
                default:
                    const primitive = this.createPrimitive(child, materialRef);
                    if (!primitive) {
                        return null;
                    }
                    group.add(primitive);
                    break;
            };
        });

        const castShadow = node['castShadow'];
        const receiveShadow = node['receiveShadow'];

        group.castShadow = castShadow ?? false;
        group.receiveShadow = receiveShadow ?? false;

        const tranformationsArray = node['transforms'];
        tranformationsArray?.forEach((transformation) => {
            const transformation_type = transformation['type'];
            if (transformation_type === "translate") {
                group.translateX(transformation["amount"]["x"]);
                group.translateY(transformation["amount"]["y"]);
                group.translateZ(transformation["amount"]["z"]);
            } else if (transformation_type === "rotate") {
                group.rotateX(this.degreeToRad(transformation["amount"]["x"]))
                group.rotateY(this.degreeToRad(transformation["amount"]["y"]));
                group.rotateZ(this.degreeToRad(transformation["amount"]["z"]));
            } else if (transformation_type === "scale") {
                group.scale.set(transformation["amount"]["x"], transformation["amount"]["y"], transformation["amount"]["z"]);
            }
        });

        this.nodes[node['id']] = group;
        return group;
    }

}

export { SceneGraph };
