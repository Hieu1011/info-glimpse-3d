
import * as THREE from 'three';

export function useAsteroidBelt(scene: THREE.Scene, innerRadius: number, outerRadius: number, count: number) {
  const asteroidGroup = new THREE.Group();
  
  for (let i = 0; i < count; i++) {
    const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
    const angle = Math.random() * Math.PI * 2;
    
    // Vary the size
    const size = Math.random() * 0.2 + 0.1;
    
    // Create irregular shapes for asteroids
    const asteroidGeometry = new THREE.DodecahedronGeometry(size, 0);
    // Distort the geometry
    if (asteroidGeometry.attributes.position) {
      const positions = asteroidGeometry.attributes.position as THREE.BufferAttribute;
      const vertexCount = positions.count;
      
      for (let j = 0; j < vertexCount; j++) {
        const vertex = new THREE.Vector3();
        vertex.fromBufferAttribute(positions, j);
        
        // Add random variation to each vertex
        vertex.x += (Math.random() - 0.5) * 0.2 * size;
        vertex.y += (Math.random() - 0.5) * 0.2 * size;
        vertex.z += (Math.random() - 0.5) * 0.2 * size;
        
        positions.setXYZ(j, vertex.x, vertex.y, vertex.z);
      }
      
      positions.needsUpdate = true;
    }
    
    const color = Math.random() > 0.5 ? 0x8a8a8a : 0x765c48;
    const asteroidMaterial = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.9,
      metalness: Math.random() * 0.3
    });
    
    const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
    
    // Position on orbital plane with slight vertical variation
    asteroid.position.x = radius * Math.cos(angle);
    asteroid.position.z = radius * Math.sin(angle);
    asteroid.position.y = (Math.random() - 0.5) * 0.5;
    
    // Random rotation
    asteroid.rotation.x = Math.random() * Math.PI;
    asteroid.rotation.y = Math.random() * Math.PI;
    asteroid.rotation.z = Math.random() * Math.PI;
    
    // Store rotation and orbit data
    asteroid.userData = {
      orbitSpeed: 0.05 + Math.random() * 0.05,
      orbitRadius: radius,
      orbitAngle: angle,
      rotationSpeed: Math.random() * 0.01
    };
    
    asteroidGroup.add(asteroid);
  }
  
  scene.add(asteroidGroup);
  return asteroidGroup;
}
