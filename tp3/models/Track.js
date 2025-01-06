import * as THREE from "three";

class Track extends THREE.Object3D{

  constructor(trackWidth) {

    super();
    //Curve related attributes
    this.segments = 100;
    this.showWireframe = false;
    this.showMesh = true;
    this.showLine = true;
    this.closedCurve = true;
    this.width = trackWidth;

    this.path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-90, 0, 0),
      new THREE.Vector3(80, 0, 0),
      new THREE.Vector3(80, 0, -100),
      new THREE.Vector3(20, 0, -100),
      new THREE.Vector3(20, 0 , -30),
      new THREE.Vector3(-20, 0 , -30),
      new THREE.Vector3(-20, 0, -150),
      new THREE.Vector3(-90, 0, -150),
      new THREE.Vector3(-90, 0, 0)
    ]);

    this.buildCurve();
  }

  buildCurve() {
    this.createCurveMaterialsTextures();
    this.createCurveObjects();
  }

  /**
   * Create materials for the curve elements: the mesh, the line and the wireframe
   */
  createCurveMaterialsTextures() {
    const texture = new THREE.TextureLoader().load(
      "./image/road.jpg",
      () => {
        // Adjust the texture after it is loaded
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1); // Adjust the repeat values to map the texture vertically
        texture.offset.set(0, 0); // Adjust the offset if needed
      }
    );
  
    this.material = new THREE.MeshBasicMaterial({ map: texture });
    
    this.wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x0000ff,
      opacity: 0.3,
      wireframe: true,
      transparent: true,
    });
  
    this.lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
  }

  /**
   * Creates the mesh, the line and the wireframe used to visualize the curve
   */
  createCurveObjects() {
    let geometry = new THREE.TubeGeometry(
      this.path,
      this.segments,
      this.width,
      3,
      this.closedCurve
    );
  
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.wireframe = new THREE.Mesh(geometry, this.wireframeMaterial);
  
    let points = this.path.getPoints(this.segments);
    let bGeometry = new THREE.BufferGeometry().setFromPoints(points);
  
    // Create the final object to add to the scene
    this.line = new THREE.Line(bGeometry, this.lineMaterial);
  
    this.curve = new THREE.Group();
  
    this.mesh.visible = true;
    this.wireframe.visible = true;
    this.line.visible = true;
  
    this.curve.add(this.mesh);
    this.curve.add(this.wireframe);
    this.curve.add(this.line);
  
    this.curve.rotateZ(Math.PI);
    this.curve.scale.set(1, 0.2, 1);
    this.add(this.curve);
  }

  updateWidth(trackWidth){
    this.width = trackWidth;
    this.remove(this.curve);
    this.buildCurve();
  }


  /**
   * updates the contents
   * this method is called from the render method of the app
   */
  update() {
  }

}

export { Track };
