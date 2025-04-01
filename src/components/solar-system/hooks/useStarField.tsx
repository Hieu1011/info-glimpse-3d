
import * as THREE from 'three';

export function useStarField(scene: THREE.Scene) {
  const starCount = 5000;
  const starGeometry = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);
  const starSizes = new Float32Array(starCount);
  
  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;
    // Create a sphere of stars around the entire solar system
    const radius = 400;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    starPositions[i3 + 2] = radius * Math.cos(phi);
    
    // Vary star sizes for more realism
    starSizes[i] = Math.random() * 1.5 + 0.5;
  }
  
  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
  
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
    gradient.addColorStop(0.2, 'rgba(240, 240, 255, 0.8)');
    gradient.addColorStop(0.5, 'rgba(220, 220, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(220, 220, 255, 0)');
    
    starCtx.fillStyle = gradient;
    starCtx.fillRect(0, 0, starSize, starSize);
  }
  
  const starTexture = new THREE.CanvasTexture(starCanvas);
  
  // Create various star colors
  const starMaterials = [
    new THREE.PointsMaterial({
      size: 1.3,
      map: starTexture,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xffffff
    }),
    new THREE.PointsMaterial({
      size: 1.3,
      map: starTexture,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xaaaaff
    }),
    new THREE.PointsMaterial({
      size: 1.3,
      map: starTexture,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xffffaa
    })
  ];
  
  // Create star clusters with different colors
  const starCount1 = Math.floor(starCount * 0.5);
  const starCount2 = Math.floor(starCount * 0.3);
  const starCount3 = starCount - starCount1 - starCount2;
  
  const stars1 = new THREE.Points(
    new THREE.BufferGeometry().copy(starGeometry).setDrawRange(0, starCount1),
    starMaterials[0]
  );
  
  const stars2 = new THREE.Points(
    new THREE.BufferGeometry().copy(starGeometry).setDrawRange(starCount1, starCount2),
    starMaterials[1]
  );
  
  const stars3 = new THREE.Points(
    new THREE.BufferGeometry().copy(starGeometry).setDrawRange(starCount1 + starCount2, starCount3),
    starMaterials[2]
  );
  
  // Add all star groups to the scene
  scene.add(stars1);
  scene.add(stars2);
  scene.add(stars3);
  
  // Create a starfield group to return all stars
  const starField = new THREE.Group();
  starField.add(stars1);
  starField.add(stars2);
  starField.add(stars3);
  
  return starField;
}
