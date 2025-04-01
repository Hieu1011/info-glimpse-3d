
import * as THREE from 'three';

export function useStarField(scene: THREE.Scene) {
  const starCount = 5000;
  const starGeometry = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);
  
  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;
    // Create a sphere of stars around the entire solar system
    const radius = 400;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    starPositions[i3 + 2] = radius * Math.cos(phi);
  }
  
  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  
  // Create star material with a custom texture
  const starCanvas = document.createElement('canvas');
  const starSize = 32;
  starCanvas.width = starSize;
  starCanvas.height = starSize;
  const starCtx = starCanvas.getContext('2d');
  
  if (starCtx) {
    const gradient = starCtx.createRadialGradient(
      starSize / 2, starSize / 2, 0,
      starSize / 2, starSize / 2, starSize / 2
    );
    
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.4, 'rgba(240, 240, 255, 0.8)');
    gradient.addColorStop(1, 'rgba(220, 220, 255, 0)');
    
    starCtx.fillStyle = gradient;
    starCtx.fillRect(0, 0, starSize, starSize);
  }
  
  const starTexture = new THREE.CanvasTexture(starCanvas);
  
  const starMaterial = new THREE.PointsMaterial({
    size: 1.5,
    map: starTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
  
  return stars;
}
