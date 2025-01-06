import * as THREE from 'three';

/**
* This class contains a 2D text
 */

class TextRender extends THREE.Object3D {

    /**
     * 
     */
    constructor(text, letter_width, letter_height) {
        super();

        this.widthChar = 15;
        this.heightChar = 8;
        this.char_width = 1 / this.widthChar;
        this.char_heigth = 1 / this.heightChar;
        this.arrayChar = [[' ', '!', '"', '#', '$', '%', '&', '\'', '(', ')', '*', '+', ',', '-', '-'],
                          ['/', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '<', '='],
                          ['>', '?', '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
                          ['M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[']];
        
        this.buildText(text, letter_width, letter_height)
    }

    buildText(text, letter_width, letter_height) {
        const test = "dkjfasfj";
        let displacement = 0.0;
        const upper_text = text.toUpperCase();
        for(let i = 0; i < upper_text.length; i++) {
            const letter_mesh = this.buildLetter(upper_text[i], letter_width, letter_height);
            letter_mesh.translateX(displacement);
            displacement += letter_width;
            this.add(letter_mesh)
        }
    }

    buildLetter(letter, letter_width, letter_height) {
        let m = 0;
        let n = 0;
        let found = false;
        for(let i = 0; i < 4 && !found; i++) {
            for(let j = 0; j < this.widthChar && !found; j++) {
                if(this.arrayChar[i][j] === letter) {
                    m = i;
                    n = j;
                    found = true;
                }
            }
        }

        let u1 = n * this.char_width;
        let v1 = 1 - m * this.char_heigth;
        let u2 = u1 + this.char_width;
        let v2 = v1 - this.char_heigth;
 
        const plane = new THREE.PlaneGeometry(letter_width, letter_height);
        plane.attributes.uv.array.set([
            u1, v1, u2, v1, u1, v2, u2, v2
        ])
        const texture = new THREE.TextureLoader().load('scene/textures/font_sheet.png');
        const material = new THREE.MeshBasicMaterial({
            map: texture
        });
        
        const mesh = new THREE.Mesh(plane, material);
        return mesh;
    }

}

export { TextRender };

