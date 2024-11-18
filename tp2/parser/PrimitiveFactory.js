import * as THREE from 'three';

class PrimitiveFactory {

    static createRectangleFromYASF(rectangle, material) {
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

        const material1 = material ?? new THREE.MeshPhongMaterial({ color: 0x990000, side: THREE.DoubleSide, specular: 0x000000 });
        const mesh = new THREE.Mesh(geometry, material1);
        mesh.position.set(x1 + width / 2, y1 + height / 2, 0);

        return mesh;
    }

    static createTriangleFromYASF(triangle, material) {
        const x1 = triangle['xyz1']['x'];
        const y1 = triangle['xyz1']['y'];
        const z1 = triangle['xyz1']['z'];
        const x2 = triangle['xyz2']['x'];
        const y2 = triangle['xyz2']['y'];
        const z2 = triangle['xyz2']['z'];
        const x3 = triangle['xyz3']['x'];
        const y3 = triangle['xyz3']['y'];
        const z3 = triangle['xyz3']['z'];

        const geometry = new THREE.Geometry();

        const vertices = new Float32Array([
            x1, y1, z1, // v0
            x2, y2, z2, // v1
            x3, y3, z3  // v2
        ]);

        const indices = [
            0, 1, 2
        ];

        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.setIndex(indices);

        return new THREE.Mesh(geometry, material);
    }

    static createBoxFromYASF(box, material) {
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

        return mesh;
    }

    static createCylinderFromYASF(cylinder, material) {
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

        return mesh;
    }

    static createSphereFromYASF(sphere, material) {
        const radius = sphere['radius'];
        const slices = sphere['slices'];
        const stacks = sphere['stacks'];
        const thetaStart = sphere['theta_start'] ?? 0;
        const thetaLength = sphere['theta_length'] ?? Math.PI;
        const phiStart = sphere['phi_start'] ?? 0;
        const phiLength = sphere['phi_length'] ?? Math.PI * 2;

        const geometry = new THREE.SphereGeometry(radius, slices, stacks, phiStart, phiLength, thetaStart, thetaLength);

        const mesh = new THREE.Mesh(geometry, material);

        return mesh;
    }

    static createNurbsCurveFromYASF(nurbs, material) {

    }

    static createPolygonFromYASF(polygon, material) {
        const radius = polygon['radius'];
        const stacks = polygon['stacks'];
        const slices = polygon['slices'];
        const color_c = polygon['color_c'];
        const color_p = polygon['color_p'];
        const colorC = new THREE.Color(color_c['r'], color_c['g'], color_c['b']);
        const colorP = new THREE.Color(color_p['r'], color_p['g'], color_p['b']);

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

        light.castShadow = castShadow;

        light.shadow.camera.far = shadowfar;
        light.shadow.mapSize.width = shadowMapSize;
        light.shadow.mapSize.height = shadowMapSize;

        light.position.set(position.x, position.y, position.z);
        light.enabled = enabled;

        return light;
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

        light.castShadow = castShadow;

        light.shadow.camera.far = shadowfar;
        light.shadow.mapSize.width = shadowMapSize;
        light.shadow.mapSize.height = shadowMapSize;

        light.position.set(position.x, position.y, position.z);
        light.target.position.set(target.x, target.y, target.z);

        light.enabled = enabled;
        return light;
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

        return light;
    }

}

export { PrimitiveFactory };
