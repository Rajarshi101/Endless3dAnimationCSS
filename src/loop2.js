const canvasContainer = document.getElementById('canvas-container');

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
canvasContainer.appendChild(renderer.domElement);

// Create a shape geometry
const geometry = new THREE.DodecahedronGeometry(1);

// Create a material
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

// Create a mesh
const shape = new THREE.Mesh(geometry, material);

// Add the shape to the scene
scene.add(shape);

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate the shape
  shape.rotation.x += 0.01;
  shape.rotation.y += 0.01;

  // Render the scene
  renderer.render(scene, camera);
}

// Start the animation loop
animate();
