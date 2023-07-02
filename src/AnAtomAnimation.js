const canvasContainer = document.getElementById('canvas-container');

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create a renderer
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
canvasContainer.appendChild(renderer.domElement);

// Create a nucleus
const nucleus = new THREE.Group();

// Create proton
const protonGeometry = new THREE.SphereGeometry(0.1, 16, 16);
const protonMaterial = new THREE.MeshPhongMaterial({ color: 0xff77ff, transparent: true, opacity: 0.5 });

for (let i = 0; i < 3; i++) {
  const proton = new THREE.Mesh(protonGeometry, protonMaterial);
  proton.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(0.3);
  nucleus.add(proton);
}

// Create neutron
const neutronGeometry = new THREE.SphereGeometry(0.1, 16, 16);
const neutronMaterial = new THREE.MeshPhongMaterial({ color: 0x7777ff, transparent: true, opacity: 0.5 });

for (let i = 0; i < 4; i++) {
  const neutron = new THREE.Mesh(neutronGeometry, neutronMaterial);
  neutron.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(0.4);
  nucleus.add(neutron);
}

scene.add(nucleus);

// Create a translucent sphere around the clump
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

// Create electron particles
const electronCount = 3;
const electrons = new THREE.Group();

// Create an array to hold initial angles for the electron orbits
const initialAngles = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3];

// Function to calculate initial position based on angle and plane
function calculateInitialPosition(angle, plane) {
  const radius = 2;

  let x = 0, y = 0, z = 0;
  switch (plane) {
    case 'xy':
      x = Math.cos(angle) * radius;
      y = Math.sin(angle) * radius;
      break;
    case 'yz':
      y = Math.cos(angle) * radius;
      z = Math.sin(angle) * radius;
      break;
    case 'zx':
      z = Math.cos(angle) * radius;
      x = Math.sin(angle) * radius;
      break;
  }

  return new THREE.Vector3(x, y, z);
}

for (let i = 0; i < electronCount; i++) {
  const electron = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 16, 16),
    new THREE.MeshPhongMaterial({ color: 0x00ff00 })
  );

  const angle = initialAngles[i];
  const plane = i === 0 ? 'xy' : i === 1 ? 'yz' : 'zx';

  const position = calculateInitialPosition(angle, plane);
  electron.position.copy(position);

  electrons.add(electron);
}

scene.add(electrons);

// Add lights to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate the nucleus
  nucleus.rotation.y += 0.01;

  // Update the positions of electrons
  const time = Date.now() * 0.0005;
  electrons.children.forEach((electron, index) => {
    const angle = initialAngles[index];
    const plane = index === 0 ? 'xy' : index === 1 ? 'yz' : 'zx';

    const position = calculateInitialPosition(angle + time, plane);
    electron.position.copy(position);
  });

  // Render the scene
  renderer.render(scene, camera);
}

// Start the animation loop
animate();
