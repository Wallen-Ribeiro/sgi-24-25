import * as THREE from 'three';
import { build } from './NURBSBuilder.js';

class PrimitiveFactory {

    static createRectangleFromYASF(rectangle, material, castShadow, receiveShadow) {
        const x1 = rectangle['xy1']['x'];
        const y1 = rectangle['xy1']['y'];
        const x2 = rectangle['xy2']['x'];
        const y2 = rectangle['xy2']['y'];
        const wSegments = rectangle['parts_x'] ?? 1;
        const hSegments = rectangle['parts_y'] ?? 1;

        const width = x2 - x1;
        const height = y2 - y1;

        // console.log(material)
        const geometry = new THREE.PlaneGeometry(width, height, wSegments, hSegments);

        const uvAttribute = geometry.attributes.uv;
        for (let i = 0; i < uvAttribute.count; i++) {
            const u = uvAttribute.getX(i);
            const v = uvAttribute.getY(i);
            uvAttribute.setXY(i, u * width, v * height);
        }
        uvAttribute.needsUpdate = true;

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x1 + width / 2, y1 + height / 2, 0);

        mesh.castShadow = castShadow;
        mesh.receiveShadow = receiveShadow;

        return mesh;
    }

    static createTriangleFromYASF(triangle, material, castShadow, receiveShadow) {
        const x1 = triangle['xyz1']['x'];
        const y1 = triangle['xyz1']['y'];
        const z1 = triangle['xyz1']['z'];
        const x2 = triangle['xyz2']['x'];
        const y2 = triangle['xyz2']['y'];
        const z2 = triangle['xyz2']['z'];
        const x3 = triangle['xyz3']['x'];
        const y3 = triangle['xyz3']['y'];
        const z3 = triangle['xyz3']['z'];

        const geometry = new THREE.BufferGeometry();

        const vertices = new Float32Array([
            x1, y1, z1, // v0
            x2, y2, z2, // v1
            x3, y3, z3  // v2
        ]);

        const indices = [
            0, 1, 2
        ];

        const uvs = new Float32Array([
            0, 0, 
            1, 0, 
            0.5, 1 
        ]);

        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.setIndex(indices);
        geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2)); 

        geometry.computeVertexNormals();

        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = castShadow;
        mesh.receiveShadow = receiveShadow;


        return mesh;
    }

    static createBoxFromYASF(box, material, castShadow, receiveShadow) {
        const x1 = box['xyz1']['x'];
        const y1 = box['xyz1']['y'];
        const z1 = box['xyz1']['z'];
        const x2 = box['xyz2']['x'];
        const y2 = box['xyz2']['y'];
        const z2 = box['xyz2']['z'];
        const wSegments = box['parts_x'] ?? 1;
        const hSegments = box['parts_y'] ?? 1;
        const dSegments = box['parts_z'] ?? 1;

        const width = x2 - x1;
        const height = y2 - y1;
        const depth = z2 - z1;

        const geometry = new THREE.BoxGeometry(width, height, depth, wSegments, hSegments, dSegments);

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x1 + width / 2, y1 + height / 2, z1 + depth / 2);
        mesh.castShadow = castShadow;
        mesh.receiveShadow = receiveShadow;

        return mesh;
    }

    static createCylinderFromYASF(cylinder, material, castShadow, receiveShadow) {
        const base = cylinder['base'];
        const top = cylinder['top'];
        const height = cylinder['height'];
        const slices = cylinder['slices'];
        const stacks = cylinder['stacks'];
        const cap = cylinder['cap'] ?? false;
        const thetaStart = cylinder['theta_start'] ?? 0;
        const thetaLength = cylinder['theta_length'] ?? Math.PI * 2;

        const geometry = new THREE.CylinderGeometry(top, base, height, slices, stacks, !cap, thetaStart, thetaLength);

        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = castShadow;
        mesh.receiveShadow = receiveShadow;

        return mesh;
    }

    static createSphereFromYASF(sphere, material, castShadow, receiveShadow) {
        const radius = sphere['radius'];
        const slices = sphere['slices'];
        const stacks = sphere['stacks'];
        const thetaStart = sphere['theta_start'] ?? 0;
        const thetaLength = sphere['theta_length'] ?? Math.PI;
        const phiStart = sphere['phi_start'] ?? 0;
        const phiLength = sphere['phi_length'] ?? Math.PI * 2;

        const geometry = new THREE.SphereGeometry(radius, slices, stacks, phiStart, phiLength, thetaStart, thetaLength);

        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = castShadow;
        mesh.receiveShadow = receiveShadow;

        return mesh;
    }

    static createNurbsCurveFromYASF(nurbs, material, castShadow, receiveShadow) {
        const orderU = nurbs['degree_u'];
        const orderV = nurbs['degree_v'];
        const samplesU = nurbs['parts_u'];
        const samplesV = nurbs['parts_v'];
        const controlPoints = [];
    
        let index = 0;
        for (let i = 0; i <= orderU; i++) {
            let temp_array = [];
            for (let j = 0; j <= orderV; j++) {
                temp_array.push([nurbs['controlpoints'][index]['x'], nurbs['controlpoints'][index]['y'], nurbs['controlpoints'][index]['z'], 1]);
                index++;
            }
            controlPoints.push(temp_array);
        }
    
        const surfaceData = build(controlPoints, orderU, orderV, samplesU, samplesV);
    
        const uvData = [];
        for (let u = 0; u <= samplesU; u++) {
            for (let v = 0; v <= samplesV; v++) {
                uvData.push(u / samplesU, v / samplesV);
            }
        }
        surfaceData.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvData), 2));
        surfaceData.computeVertexNormals(); 

        const mesh = new THREE.Mesh(surfaceData, material);
        mesh.castShadow = castShadow;
        mesh.receiveShadow = receiveShadow;

        return mesh;
    }
    


    static createPolygonFromYASF(polygon, material, castShadow, receiveShadow) {
        const radius = polygon['radius'];
        const stacks = polygon['stacks'];
        const slices = polygon['slices'];
        const color_c = polygon['color_c'];
        const color_p = polygon['color_p'];
        const colorC = new THREE.Color(color_c['r'], color_c['g'], color_c['b']);
        const colorP = new THREE.Color(color_p['r'], color_p['g'], color_p['b']);
    
        const rStep = radius / stacks;
        const angleStep = 2 * Math.PI / slices;
    
        let vertices = [];
        let colors = [];
        let indices = [];
        let uvs = [];
    
    
        for (let stack = 0; stack <= stacks; stack++) {
            const r = stack * rStep;
            const alpha = stack / stacks;
    
            for (let slice = 0; slice <= slices; slice++) {
                const angle = slice * angleStep;
                const x = r * Math.cos(angle);
                const y = r * Math.sin(angle);
                const u = 0.5 + (x / (2 * radius)); 
                const v = 0.5 - (y / (2 * radius)); 
    
                vertices.push(x, y, 0);
    
                const lerpColor = new THREE.Color();
                colors.push(...lerpColor.lerpColors(colorC, colorP, alpha).toArray());
    
                uvs.push(u, v);
            }
        }
    
        for (let stack = 0; stack < stacks; stack++) {
            for (let slice = 0; slice < slices; slice++) {
                const first = stack * (slices + 1) + slice;
                const second = first + slices + 1;
    
                indices.push(first, second + 1, second);
    
                indices.push(first, first + 1, second + 1);
            }
        }
    
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));

        geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));
        geometry.setIndex(indices);
        geometry.computeVertexNormals();

        const material1 = material || new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, vertexColors: true });

        const mesh = new THREE.Mesh(geometry, material1);
        mesh.castShadow = castShadow;
        mesh.receiveShadow = receiveShadow;
    
        return mesh;
    }
    
    

    static createPointLightFromYASF(pointlight) {
        const enabled = pointlight['enabled'] ?? true;
        const color = new THREE.Color(pointlight['color']['r'], pointlight['color']['g'], pointlight['color']['b']);
        const intensity = pointlight['intensity'] ?? 1;
        const distance = pointlight['distance'] ?? 1000;
        const decay = pointlight['decay'] ?? 2;
        const position = new THREE.Vector3(pointlight['position']['x'], pointlight['position']['y'], pointlight['position']['z']);
        const castShadow = pointlight['castshadow'] ?? false;
        const shadowfar = pointlight['shadowfar'] ?? 500.0;
        const shadowMapSize = pointlight['shadowmapsize'] ?? 512;

        const light = new THREE.PointLight(color, intensity, distance, decay);
        const helper = new THREE.PointLightHelper(light, 1);

        light.castShadow = castShadow;

        light.shadow.camera.far = shadowfar;
        light.shadow.mapSize.width = shadowMapSize;
        light.shadow.mapSize.height = shadowMapSize;

        light.position.set(position.x, position.y, position.z);
        light.enabled = enabled;

        return [light, helper];
    }

    static createSpotLightFromYASF(spotlight) {
        const enabled = spotlight['enabled'] ?? true;
        const color = new THREE.Color(spotlight['color']['r'], spotlight['color']['g'], spotlight['color']['b']);
        const intensity = spotlight['intensity'] ?? 1;
        const distance = spotlight['distance'] ?? 1000;
        const angle = spotlight['angle'];
        const decay = spotlight['decay'] ?? 2;
        const penumbra = spotlight['penumbra'] ?? 1;
        const position = new THREE.Vector3(spotlight['position']['x'], spotlight['position']['y'], spotlight['position']['z']);
        const target = new THREE.Vector3(spotlight['target']['x'], spotlight['target']['y'], spotlight['target']['z']);
        const castShadow = spotlight['castshadow'] ?? false;
        const shadowfar = spotlight['shadowfar'] ?? 500.0;
        const shadowMapSize = spotlight['shadowmapsize'] ?? 512;

        const light = new THREE.SpotLight(color, intensity, distance, angle, penumbra, decay);
        const helper = new THREE.SpotLightHelper(light);

        light.castShadow = castShadow;

        light.shadow.camera.far = shadowfar;
        light.shadow.mapSize.width = shadowMapSize;
        light.shadow.mapSize.height = shadowMapSize;

        light.position.set(position.x, position.y, position.z);
        light.target.position.set(target.x, target.y, target.z);

        light.enabled = enabled;
        return [light, helper];
    }

    static createDirectionalLightFromYASF(directionallight) {
        const enabled = directionallight['enabled'] ?? true;
        const color = new THREE.Color(directionallight['color']['r'], directionallight['color']['g'], directionallight['color']['b']);
        const intensity = directionallight['intensity'] ?? 1;
        const position = new THREE.Vector3(directionallight['position']['x'], directionallight['position']['y'], directionallight['position']['z']);
        const castShadow = directionallight['castshadow'] ?? false;
        const shadowLeft = directionallight['shadowleft'] ?? -5;
        const shadowRight = directionallight['shadowright'] ?? 5;
        const shodowBottom = directionallight['shadowbottom'] ?? -5;
        const shadowTop = directionallight['shadowtop'] ?? 5;
        const shadowFar = directionallight['shadowfar'] ?? 500.0;
        const shadowMapSize = directionallight['shadowmapsize'] ?? 512;

        const light = new THREE.DirectionalLight(color, intensity);
        const helper = new THREE.DirectionalLightHelper(light, 1);

        light.castShadow = castShadow;

        light.shadow.camera.left = shadowLeft;
        light.shadow.camera.right = shadowRight;
        light.shadow.camera.bottom = shodowBottom;
        light.shadow.camera.top = shadowTop;
        light.shadow.camera.far = shadowFar;
        light.shadow.mapSize.width = shadowMapSize;
        light.shadow.mapSize.height = shadowMapSize;

        light.position.set(position.x, position.y, position.z);
        light.enabled = enabled;

        return [light, helper];
    }
}

export { PrimitiveFactory };
