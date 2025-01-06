uniform float timeFactor;

void main() {
      vec4 modelViewPosition = modelViewMatrix * vec4(position + normal * 10, 1.0);
      gl_Position = projectionMatrix * modelViewPosition; 
}