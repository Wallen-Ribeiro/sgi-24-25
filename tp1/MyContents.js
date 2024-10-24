import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';

/**
 *  This class contains the contents of out application
 */
class MyContents  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app) {
        this.app = app
        this.axis = null

        // box related attributes
        this.boxMesh = null
        this.boxMeshSize = 1.0
        this.boxEnabled = true
        this.lastBoxEnabled = null
        this.boxDisplacement = new THREE.Vector3(0,2,0)

        // plane related attributes
        this.diffusePlaneColor = "#00ffff"
        this.specularPlaneColor = "#777777"
        this.planeShininess = 30
        this.planeMaterial = new THREE.MeshPhongMaterial({ color: this.diffusePlaneColor, 
            specular: this.specularPlaneColor, emissive: "#000000", shininess: this.planeShininess })
    }

    /**
     * builds the box mesh with material assigned
     */
    buildBox() {    
        let boxMaterial = new THREE.MeshPhongMaterial({ color: "#ffff77", 
        specular: "#000000", emissive: "#000000", shininess: 90 })

        // Create a Cube Mesh with basic material
        let box = new THREE.BoxGeometry(  this.boxMeshSize,  this.boxMeshSize,  this.boxMeshSize );
        this.boxMesh = new THREE.Mesh( box, boxMaterial );
        this.boxMesh.rotation.x = -Math.PI / 2;
        this.boxMesh.position.y = this.boxDisplacement.y;
    }

    /**
     * initializes the contents
     */
    init() {
       
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }


        this.polyline = null;
        this.quadraticBezierCurve = null;
        this.cubicBezierCurve = null;
        this.catmullRomCurve = null;
        this.numberOfSamples = 6;

        this.hullMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff",
                                    opacity : 0.1, transparent : false });
        
        this.recompute();

        

        // add a point light on top of the model
        const pointLight = new THREE.PointLight( 0xffffff, 500, 0 );
        pointLight.position.set( 0, 20, 0 );
        this.app.scene.add( pointLight );

        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
        this.app.scene.add( pointLightHelper );

        // add an ambient light
        const ambientLight = new THREE.AmbientLight( 0x555555 );
        this.app.scene.add( ambientLight );

        this.buildBox()
        
        // Create a Plane Mesh with basic material
        
        let plane = new THREE.PlaneGeometry( 10, 10 );
        this.planeMesh = new THREE.Mesh( plane, this.planeMaterial );
        this.planeMesh.rotation.x = -Math.PI / 2;
        this.planeMesh.position.y = -0;
        //this.app.scene.add( this.planeMesh );
    }


    recompute() {

        if (this.polyline !== null) this.app.scene.remove(this.polyline)

        this.initPolyline()

        if (this.quadraticBezierCurve !== null) this.app.scene.remove(this.quadraticBezierCurve)

        this.initQuadraticBezierCurve()

        if (this.cubicBezierCurve !== null) this.app.scene.remove(this.cubicBezierCurve)

        this.initCubicBezierCurve();

        if (this.catmullRomCurve !== null) this.app.scene.remove(this.catmullRomCurve)

        this.initCatmullRomCurve();

    }

    

    drawHull(position, points) {

       

        const geometry = new THREE.BufferGeometry().setFromPoints( points );

        let line = new THREE.Line( geometry, this.hullMaterial );

    

        // set initial position

        line.position.set(position.x,position.y,position.z)

        this.app.scene.add( line );

        console.log(line.position)

    }

    

    initPolyline() {

        // define vertex points

        let points = [

            new THREE.Vector3( -1, -0.6, 2 ),

            new THREE.Vector3(  1, -1, 2 ),

            new THREE.Vector3(  1,  0.6, 0.6 ),

            new THREE.Vector3( -0.6,  1, 0.4 )

        ]

        let position = new THREE.Vector3(-4,4,0)

        this.drawHull(position, points);

        // define geometry

        const geometry = new THREE.BufferGeometry().setFromPoints( points );

        // create the line from material and geometry

        this.polyline = new THREE.Line( geometry,

            new THREE.LineBasicMaterial( { color: 0xff0000 } ) );

        // set initial position

        this.polyline.position.set(position.x,position.y,position.z)

        // add the line to the scene

        this.app.scene.add( this.polyline );

    }


    initQuadraticBezierCurve() {

        let points = [
    
            new THREE.Vector3( -0.6, -0.6, 0.0 ), // starting point
    
            new THREE.Vector3(    0,  0.6, 0.0 ), // control point
    
            new THREE.Vector3(  0.6, -0.6, 0.0 )  // ending point
    
        ]
    
        let position = new THREE.Vector3(0,0,0)
    
        this.drawHull(position, points);
    
        
        
            let curve =
        
                new THREE.QuadraticBezierCurve3( points[0], points[1], points[2])
        
            // sample a number of points on the curve
        
            let sampledPoints = curve.getPoints( this.numberOfSamples );
        
            this.curveGeometry =
        
                    new THREE.BufferGeometry().setFromPoints( sampledPoints )
        
            this.lineMaterial = new THREE.LineBasicMaterial( { color: 0x00ff00 } )
        
            this.lineObj = new THREE.Line( this.curveGeometry, this.lineMaterial )
        
            this.lineObj.position.set(position.x,position.y,position.z)
        
            this.app.scene.add( this.lineObj );
        
        
    
    }



    initCubicBezierCurve() {

        let points = [
    
            new THREE.Vector3( -0.6, -0.6, 1 ), // starting point
    
            new THREE.Vector3( -0.6,  0.6, 0.0 ), // control point

            new THREE.Vector3(  0.6, -0.6, 0.0 ), // control point
    
            new THREE.Vector3(  0.6,  0.6, 0.0 )  // ending point
    
        ]
    
        let position = new THREE.Vector3(-4,0,0)
    
        this.drawHull(position, points);
    
        
        
            let curve =
        
                new THREE.CubicBezierCurve3(points[0], points[1], points[2], points[3])
        
            // sample a number of points on the curve
        
            let sampledPoints = curve.getPoints( this.numberOfSamples + 10);
        
            this.curveGeometry =
        
                    new THREE.BufferGeometry().setFromPoints( sampledPoints )
        
            this.lineMaterial = new THREE.LineBasicMaterial( { color: 0xFF00FFF } )
        
            this.lineObj = new THREE.Line( this.curveGeometry, this.lineMaterial )
        
            this.lineObj.position.set(position.x,position.y,position.z)
        
            this.app.scene.add( this.lineObj );
        
    }

    initCatmullRomCurve() {

        let points = [
    
            new THREE.Vector3 (-0.6,0,0), // starting point
    
            new THREE.Vector3(-0.3,0.6,0.3), // control point

            new THREE.Vector3(0.3,-0.6,0.3), // control point
    
            new THREE.Vector3(0.6,1,0),  // ending point

            new THREE.Vector3(0.9,0.6,0.3), // control point

            new THREE.Vector3(1.2,0,0), // control point
    
        ]
    
        let position = new THREE.Vector3(0,0,0)
    
        this.drawHull(position, points);
    
        
        
            let curve =
        
                new THREE.CatmullRomCurve3(points)
        
            // sample a number of points on the curve
        
            let sampledPoints = curve.getPoints( this.numberOfSamples + 20);
        
            this.curveGeometry =
        
                    new THREE.BufferGeometry().setFromPoints( sampledPoints )
        
            this.lineMaterial = new THREE.LineBasicMaterial( { color: 0xFF00FFF } )
        
            this.lineObj = new THREE.Line( this.curveGeometry, this.lineMaterial )
        
            this.lineObj.position.set(position.x,position.y,position.z)
        
            this.app.scene.add( this.lineObj );
        
    }

    
    
    /**
     * updates the diffuse plane color and the material
     * @param {THREE.Color} value 
     */
    updateDiffusePlaneColor(value) {
        this.diffusePlaneColor = value
        this.planeMaterial.color.set(this.diffusePlaneColor)
    }
    /**
     * updates the specular plane color and the material
     * @param {THREE.Color} value 
     */
    updateSpecularPlaneColor(value) {
        this.specularPlaneColor = value
        this.planeMaterial.specular.set(this.specularPlaneColor)
    }
    /**
     * updates the plane shininess and the material
     * @param {number} value 
     */
    updatePlaneShininess(value) {
        this.planeShininess = value
        this.planeMaterial.shininess = this.planeShininess
    }
    
    /**
     * rebuilds the box mesh if required
     * this method is called from the gui interface
     */
    rebuildBox() {
        // remove boxMesh if exists
        if (this.boxMesh !== undefined && this.boxMesh !== null) {  
            this.app.scene.remove(this.boxMesh)
        }
        this.buildBox();
        this.lastBoxEnabled = null
    }
    
    /**
     * updates the box mesh if required
     * this method is called from the render method of the app
     * updates are trigered by boxEnabled property changes
     */
    updateBoxIfRequired() {
        if (this.boxEnabled !== this.lastBoxEnabled) {
            this.lastBoxEnabled = this.boxEnabled
            if (this.boxEnabled) {
                //this.app.scene.add(this.boxMesh)
            }
            else {
                this.app.scene.remove(this.boxMesh)
            }
        }
    }

    /**
     * updates the contents
     * this method is called from the render method of the app
     * 
     */
    update() {
        // check if box mesh needs to be updated
        this.updateBoxIfRequired()

        // sets the box mesh position based on the displacement vector
        this.boxMesh.position.x = this.boxDisplacement.x
        this.boxMesh.position.y = this.boxDisplacement.y
        this.boxMesh.position.z = this.boxDisplacement.z
        
    }

}

export { MyContents };