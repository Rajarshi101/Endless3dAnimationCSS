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

// Create a shape geometry
const geometry = new THREE.DodecahedronGeometry(1);

// Create multicolored materials
const materials = [
  new THREE.MeshBasicMaterial({ color: 0xff0000 }),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
  new THREE.MeshBasicMaterial({ color: 0x0000ff }),
  new THREE.MeshBasicMaterial({ color: 0xffff00 }),
  new THREE.MeshBasicMaterial({ color: 0xff00ff }),
  new THREE.MeshBasicMaterial({ color: 0x00ffff })
];

// Create a material from the multicolored materials
const material = new THREE.MeshFaceMaterial(materials);

// Create a mesh
const shape = new THREE.Mesh(geometry, material);

// Add the shape to the scene
scene.add(shape);

// Add rounded features to the shape
const edges = new THREE.EdgesGeometry(geometry);
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
const lines = new THREE.LineSegments(edges, lineMaterial);
shape.add(lines);

// Create floating glowing particles
const particleCount = 100;
const particles = new THREE.Group();

for (let i = 0; i < particleCount; i++) {
  const particle = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 })
  );

  const angle1 = Math.random() * Math.PI * 2;
  const angle2 = Math.random() * Math.PI * 2;

  const radius = 1.5;

  const x = Math.cos(angle1) * Math.sin(angle2) * radius;
  const y = Math.sin(angle1) * Math.sin(angle2) * radius;
  const z = Math.cos(angle2) * radius;

  particle.position.set(x, y, z);

  // Generate random rotation speeds for the particle
  particle.rotationSpeedX = Math.random() * 0.00001 + 0.00001;
  particle.rotationSpeedY = Math.random() * 0.00001 + 0.00001;
  particle.rotationSpeedZ = Math.random() * 0.00001 + 0.00001;

  particles.add(particle);
}

scene.add(particles);

// Check collision between particles
function checkCollision(particle) {
  const collisionThreshold = 0.2; // Adjust this value to control the collision threshold

  const otherParticles = particles.children.filter(p => p !== particle);

  for (const otherParticle of otherParticles) {
    const distance = particle.position.distanceTo(otherParticle.position);
    if (distance < collisionThreshold) {
      const angle1 = Math.random() * Math.PI * 2;
      const angle2 = Math.random() * Math.PI * 2;

      const radius = 1.5;

      const x = Math.cos(angle1) * Math.sin(angle2) * radius;
      const y = Math.sin(angle1) * Math.sin(angle2) * radius;
      const z = Math.cos(angle2) * radius;

      particle.position.set(x, y, z);
      checkCollision(particle);
      break;
    }
  }
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate the shape
  shape.rotation.x += 0.01;
  shape.rotation.y += 0.01;

  // Update particle positions and rotations
  particles.children.forEach(particle => {
    particle.rotation.x += particle.rotationSpeedX;
    particle.rotation.y += particle.rotationSpeedY;
    particle.rotation.z += particle.rotationSpeedZ;

    const radius = particle.position.length();
    const angle1 = Math.atan2(particle.position.y, particle.position.x) + particle.rotation.x;
    const angle2 = Math.acos(particle.position.z / radius) + particle.rotation.y;

    const x = Math.cos(angle1) * Math.sin(angle2) * radius;
    const y = Math.sin(angle1) * Math.sin(angle2) * radius;
    const z = Math.cos(angle2) * radius;

    particle.position.set(x, y, z);
    checkCollision(particle);
  });

  // Render the scene
  renderer.render(scene, camera);
}

// Start the animation loop
animate();
