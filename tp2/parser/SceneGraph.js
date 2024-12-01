import * as THREE from 'three';
import { PrimitiveFactory } from './PrimitiveFactory.js';

class SceneGraph {
    /**
     * Constructs the SceneGraph object.
     */
    constructor() {
        this.backgroundColor = null;
        this.ambientLight = null;
    }

    /**
     * Parses the YASF data and initializes the scene graph.
     * @param {Object} data - The YASF data.
     */
    parse(data) {
        const yasf = data['yasf'];
        this.parseGlobals(yasf['globals']); // globals, fog and skybox
        this.parseCameras(yasf['cameras']);
        this.parseTextures(yasf['textures']);
        this.parseMaterials(yasf['materials']);
        this.parseGraph(yasf['graph']);
    }

    /**
     * Parses the global settings from the YASF data.
     * @param {Object} globals - The global settings.
     */
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

    /**
     * Parses the cameras from the YASF data.
     * @param {Object} cameras - The camera settings.
     */
    parseCameras(cameras) {

        this.cameras = {};

        for (const [id, camera] of Object.entries(cameras)) {
            if (camera.type === 'orthogonal') {
                const orthogonalCamera = new THREE.OrthographicCamera(camera.left, camera.right, camera.top, camera.bottom, camera.near, camera.far);
                orthogonalCamera.position.set(camera.location.x, camera.location.y, camera.location.z);
                orthogonalCamera.lookAt(camera.target.x, camera.target.y, camera.target.z);
                this.cameras[id] = orthogonalCamera;
            }
            else if (camera.type === 'perspective') {
                const perspectiveCamera = new THREE.PerspectiveCamera(camera.angle, 1, camera.near, camera.far);
                perspectiveCamera.position.set(camera.location.x, camera.location.y, camera.location.z);
                perspectiveCamera.lookAt(camera.target.x, camera.target.y, camera.target.z);
                this.cameras[id] = perspectiveCamera;
            }
        }
        this.activeCamera = cameras.initial; // cameras.inital = inital id    
    }

    /**
     * Loads an image and creates a mipmap to be added to a texture at the defined level.
     * @param {THREE.Texture} parentTexture - The texture to which the mipmap is added.
     * @param {number} level - The level of the mipmap.
     * @param {string} path - The path for the mipmap image.
     * @param {number} [size] - If size is not null, inscribe the value in the mipmap. Null by default.
     * @param {string} [color] - A color to be used for demo.
     */
    loadMipmap(parentTexture, level, path)
    {
        // load texture. On loaded call the function to create the mipmap for the specified level 
        new THREE.TextureLoader().load(path, 
            function(mipmapTexture)  // onLoad callback
            {
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')
                ctx.scale(1, 1);
                
                // const fontSize = 48
                const img = mipmapTexture.image         
                canvas.width = img.width;
                canvas.height = img.height

                // first draw the image
                ctx.drawImage(img, 0, 0 )
                             
                // set the mipmap image in the parent texture in the appropriate level
                parentTexture.mipmaps[level] = canvas
            },
            undefined, // onProgress callback currently not supported
            function(err) {
                console.error('Unable to load the image ' + path + ' as mipmap level ' + level + ".", err)
            }
        )
    }

    /**
     * Parses the textures from the YASF data.
     * @param {Object} textures - The texture settings.
     */
    parseTextures(textures) {
        this.textures = {};
        const mipmapKeys = ['mipmap0', 'mipmap1', 'mipmap2', 'mipmap3', 'mipmap4', 'mipmap5', 'mipmap6', 'mipmap7'];

        Object.keys(textures).forEach((textureId) => {
            const texture = textures[textureId];

            const isVideo = texture.isVideo;

            if (isVideo) {
                const body = document.getElementsByTagName('body')[0];
                const video = document.createElement('video');
                video.setAttribute('id', textureId);
                video.setAttribute('crossOrigin', 'anonymous');
                video.setAttribute('style', 'display:none');
                video.setAttribute('src', texture['filepath']);
                video.setAttribute('autoplay', true);
                video.setAttribute('loop', true);
                video.setAttribute('type', 'video/mp4');
                body.appendChild(video);

                this.textures[textureId] = new THREE.VideoTexture(video);
            } else {
                this.textures[textureId] = new THREE.TextureLoader().load(texture['filepath']);
            }

            for (let i = 0; i <= 7 && texture[mipmapKeys[i]]; i++) {
                this.textures[textureId].generateMipmaps = false;
                let mipmap = texture[mipmapKeys[i]];
                this.loadMipmap(this.textures[textureId], i, mipmap);
            }
            this.textures[textureId].needsUpdate = true;
        });
    }

    /**
     * Parses the materials from the YASF data.
     * @param {Object} materials - The material settings.
     */
    parseMaterials(materials) {
        this.materials = {};

        Object.keys(materials).forEach((materialId) => {
            const material = materials[materialId];
            const textureRef = material['textureref'];
            let texture = textureRef ? this.textures[textureRef] : null;
            const bumpRef = material['bumpref'];
            const bumpMap = bumpRef ? this.textures[bumpRef] : null;
            const bumpScale = material['bumpscale']?? 1.0;
            const specularRef = material['specularref'];
            const specularMap = specularRef ? this.textures[specularRef] : null;
            const texLengthS = material['texlength_s'] ?? 1;
            const texLengthT = material['texlength_t'] ?? 1;
            const color = new THREE.Color(material['color']['r'], material['color']['g'], material['color']['b']);
            const specular = new THREE.Color(material['specular']['r'], material['specular']['g'], material['specular']['b']);
            const emissive = new THREE.Color(material['emissive']['r'], material['emissive']['g'], material['emissive']['b']);
        
            if (texture) {
                texture = texture;
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(1/texLengthS, 1/texLengthT);
            }

            this.materials[materialId] = new THREE.MeshPhongMaterial({
                color: color.getHex(),
                specular: specular.getHex(),
                emissive: emissive.getHex(),
                shininess: material['shininess'],
                transparent: material['transparent'],
                opacity: material['opacity'],
                wireframe: material['wireframe'] ?? false,
                flatShading: material['shading'] ?? false,
                side: material['twosided'] ? THREE.DoubleSide : THREE.FrontSide,
                map: texture,
                bumpMap: bumpMap,
                specularMap: specularMap,
                bumpScale: bumpScale
            });

            this.materials[materialId].name = materialId;
        });
    }

    /**
     * Parses the skybox from the YASF data.
     * @param {Object} skybox - The skybox settings.
     */
    parseSkyBox(skybox) {
        const geometry = new THREE.BoxGeometry(skybox['size']['x'], skybox['size']['y'], skybox['size']['z']);

        const ft = new THREE.TextureLoader().load(skybox['front']);
        const bk = new THREE.TextureLoader().load(skybox['back']);
        const up = new THREE.TextureLoader().load(skybox['up']);
        const dn = new THREE.TextureLoader().load(skybox['down']);
        const rt = new THREE.TextureLoader().load(skybox['right']);
        const lf = new THREE.TextureLoader().load(skybox['left']);

        const eColor = new THREE.Color(skybox['emissive']['r'], skybox['emissive']['g'], skybox['emissive']['b']).getHex();
        const eIntensity = skybox['intensity'];

        const materials = [
            new THREE.MeshLambertMaterial({ map: rt, side: THREE.BackSide, emissive: eColor, emissiveIntensity: eIntensity }),
            new THREE.MeshLambertMaterial({ map: lf, side: THREE.BackSide, emissive: eColor, emissiveIntensity: eIntensity }),
            new THREE.MeshLambertMaterial({ map: up, side: THREE.BackSide, emissive: eColor, emissiveIntensity: eIntensity }),
            new THREE.MeshLambertMaterial({ map: dn, side: THREE.BackSide, emissive: eColor, emissiveIntensity: eIntensity }),
            new THREE.MeshLambertMaterial({ map: ft, side: THREE.BackSide, emissive: eColor, emissiveIntensity: eIntensity }),
            new THREE.MeshLambertMaterial({ map: bk, side: THREE.BackSide, emissive: eColor, emissiveIntensity: eIntensity })
        ];

        this.skybox = new THREE.Mesh(geometry, materials);
        this.skybox.position.set(skybox['center']['x'], skybox['center']['y'], skybox['center']['z']);

    }

    /**
     * Parses the graph from the YASF data and builds the scene graph.
     * @param {Object} graph - The graph data.
     * @returns {THREE.Group} The root node of the scene graph.
     */
    parseGraph(graph) {
        this.graph = graph;
        const rootId = graph['rootid']
        delete graph['rootid'];
        graph[rootId]['id'] = rootId;

        this.nodes = {};

        this.scene = this.buildNode(graph[rootId]);

        return this.nodes[rootId];
    }


    /**
     * Creates a primitive from YASF data.
     * @param {Object} node - The node data.
     * @param {string} materialref - The material reference.
     * @param {boolean} castShadow - Whether the mesh casts shadows.
     * @param {boolean} receiveShadow - Whether the mesh receives shadows.
     * @returns {THREE.Mesh|Array} The created primitive or an array of primitives (for lights).
     */
    createPrimitive(node, materialref, castShadow, receiveShadow) {
        let material = null;
        if (materialref && this.materials[materialref]) {
            material = this.materials[materialref];
        } else {
            material = new THREE.MeshPhongMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
        }
        switch (node['type']) {
            case 'rectangle':
                return PrimitiveFactory.createRectangleFromYASF(node, material, castShadow, receiveShadow);
            case 'triangle':
                return PrimitiveFactory.createTriangleFromYASF(node, material, castShadow, receiveShadow);
            case 'box':
                return PrimitiveFactory.createBoxFromYASF(node, material, castShadow, receiveShadow);
            case 'cylinder':
                return PrimitiveFactory.createCylinderFromYASF(node, material, castShadow, receiveShadow);
            case 'sphere':
                return PrimitiveFactory.createSphereFromYASF(node, material, castShadow, receiveShadow);
            case 'nurbs':
                return PrimitiveFactory.createNurbsCurveFromYASF(node, material, castShadow, receiveShadow);
            case 'polygon':
                return PrimitiveFactory.createPolygonFromYASF(node, this.materials[materialref], castShadow, receiveShadow);
            case 'pointlight':
                return PrimitiveFactory.createPointLightFromYASF(node);
            case 'spotlight':
                return PrimitiveFactory.createSpotLightFromYASF(node);
            case 'directionallight':
                return PrimitiveFactory.createDirectionalLightFromYASF(node);
            default:
                console.error('Unknown primitive type: ' + node['type'] + ' for node ' + node.id);
                return;
        }
    }

    /**
     * Converts degrees to radians.
     * @param {number} degree - The degree value.
     * @returns {number} The radian value.
     */
    degreeToRad(degree) {
        const rad = degree * Math.PI / 180;
        return rad;
    }

    /**
     * Builds a node reference from the graph.
     * @param {string} nodeId - The node ID.
     * @param {string} [materialRef=null] - The material reference.
     * @param {boolean} [castShadow=false] - Whether the mesh casts shadows.
     * @param {boolean} [receiveShadow=false] - Whether the mesh receives shadows.
     * @returns {THREE.Group} The built node.
     */
    buildNodeRef(nodeId, materialRef = null, castShadow = false, receiveShadow = false) {
        let node = null;

        Object.keys(this.graph).forEach((graphChildId) => {
            if (graphChildId === nodeId) {
                this.graph[graphChildId]['id'] = graphChildId;
                node = this.buildNode(this.graph[graphChildId], materialRef, castShadow, receiveShadow);
            }
        });

        return node;
    }

    /**
     * Builds a LOD reference from the graph.
     * @param {string} lodId - The LOD ID.
     * @param {string} [materialRef=null] - The material reference.
     * @param {boolean} [castShadow=false] - Whether the mesh casts shadows.
     * @param {boolean} [receiveShadow=false] - Whether the mesh receives shadows.
     * @returns {THREE.LOD} The built LOD.
     */
    buildLODRef(lodId, materialRef = null, castShadow = false, receiveShadow = false) {
        let lod = null;
        Object.keys(this.graph).forEach((graphChildId) => {
            if (graphChildId === lodId) {
                this.graph[graphChildId]['id'] = graphChildId;
                lod = this.buildLOD(this.graph[graphChildId], materialRef, castShadow, receiveShadow);
            }
        });
        return lod;
    }

    /**
     * Builds a node from the graph.
     * @param {Object} node - The node data.
     * @param {string} [materialRef=null] - The material reference.
     * @param {boolean} [castShadow=false] - Whether the mesh casts shadows.
     * @param {boolean} [receiveShadow=false] - Whether the mesh receives shadows.
     * @returns {THREE.Group} The built node.
     */
    buildNode(node, materialRef = null, castShadow = false, receiveShadow = false) {
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

        castShadow = node['castshadows'] ?? castShadow;
        receiveShadow = node['receiveshadows'] ?? receiveShadow;

        Object.keys(children).forEach((childId) => {
            const child = children[childId];
            child['id'] = childId;
            const childType = child['type'];

            if (childType === 'node') {
                console.error('Node cannot be a child of another node');
                return null;
            }

            switch (childId) {
                case 'nodesList':
                    for (const nodeId of child) {
                        const newRef = this.buildNodeRef(nodeId, materialRef, castShadow, receiveShadow);
                        if (!newRef) {
                            console.error('Couldn\'t build reference to node ' + nodeId);
                            return null;
                        }
                        group.add(newRef);
                    }
                    break;
                case 'lodsList':
                    for (const lodId of child) {
                        const newRef = this.buildLODRef(lodId, materialRef, castShadow, receiveShadow);
                        if (!newRef) {
                            console.error('Couldn\'t build reference to LOD ' + lodId);
                            return null;
                        }
                        group.add(newRef);
                    }
                    break;
                default:
                    const primitive = this.createPrimitive(child, materialRef, castShadow, receiveShadow);
                    if (!primitive) {
                        return null;
                    }
                    // verify if the primitive is array (lights also return helper)
                    if (Array.isArray(primitive)) {
                        primitive.forEach((p) => {
                            group.add(p);
                        });
                    } else {
                        group.add(primitive);
                    }

                    break;
            };
        });


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

    /**
     * Builds a LOD from the graph.
     * @param {Object} lod - The LOD data.
     * @param {string} [materialRef=null] - The material reference.
     * @param {boolean} [castShadow=false] - Whether the mesh casts shadows.
     * @param {boolean} [receiveShadow=false] - Whether the mesh receives shadows.
     * @returns {THREE.LOD} The built LOD.
     **/
    buildLOD(lod, materialRef = null, castShadow = false, receiveShadow = false) {
        const type = lod['type'];

        if (type !== 'lod') {
            console.error('Reference to a non-lod type');
            return null;
        }

        const lodGroup = new THREE.LOD();
        const lodNodes = lod['lodNodes'];

        for (const lodNode of lodNodes) {
            const nodeId = lodNode['nodeId'];
            const minDist = lodNode['mindist'];

            const newRef = this.buildNodeRef(nodeId, materialRef, castShadow, receiveShadow);
            if (!newRef) {
                console.error('Couldn\'t build reference to node ' + nodeId);
                return null;
            }

            lodGroup.addLevel(newRef, minDist);
        }

        return lodGroup;

    }
}

export { SceneGraph };
