
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const useStarField = (count = 5000) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Create three different star field layers with different colors and sizes
  const starGeometries = useMemo(() => {
    // Small blue-white stars (foreground)
    const smallStarsPositions = new Float32Array(count * 3);
    const smallStarsColors = new Float32Array(count * 3);
    
    // Medium yellow-white stars (middle layer)
    const mediumStarsPositions = new Float32Array(Math.floor(count * 0.5) * 3);
    const mediumStarsColors = new Float32Array(Math.floor(count * 0.5) * 3);
    
    // Large red-orange stars (background)
    const largeStarsPositions = new Float32Array(Math.floor(count * 0.2) * 3);
    const largeStarsColors = new Float32Array(Math.floor(count * 0.2) * 3);
    
    // Fill positions and colors for small stars
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      smallStarsPositions[i3] = (Math.random() - 0.5) * 50;
      smallStarsPositions[i3 + 1] = (Math.random() - 0.5) * 50;
      smallStarsPositions[i3 + 2] = (Math.random() - 0.5) * 50;
      
      // Blue-white color variation
      smallStarsColors[i3] = 0.7 + Math.random() * 0.3; // R
      smallStarsColors[i3 + 1] = 0.8 + Math.random() * 0.2; // G
      smallStarsColors[i3 + 2] = 0.9 + Math.random() * 0.1; // B
    }
    
    // Fill positions and colors for medium stars
    for (let i = 0; i < Math.floor(count * 0.5); i++) {
      const i3 = i * 3;
      mediumStarsPositions[i3] = (Math.random() - 0.5) * 60;
      mediumStarsPositions[i3 + 1] = (Math.random() - 0.5) * 60;
      mediumStarsPositions[i3 + 2] = (Math.random() - 0.5) * 60;
      
      // Yellow-white color variation
      mediumStarsColors[i3] = 0.9 + Math.random() * 0.1; // R
      mediumStarsColors[i3 + 1] = 0.8 + Math.random() * 0.2; // G
      mediumStarsColors[i3 + 2] = 0.5 + Math.random() * 0.3; // B
    }
    
    // Fill positions and colors for large stars
    for (let i = 0; i < Math.floor(count * 0.2); i++) {
      const i3 = i * 3;
      largeStarsPositions[i3] = (Math.random() - 0.5) * 70;
      largeStarsPositions[i3 + 1] = (Math.random() - 0.5) * 70;
      largeStarsPositions[i3 + 2] = (Math.random() - 0.5) * 70;
      
      // Red-orange color variation
      largeStarsColors[i3] = 0.8 + Math.random() * 0.2; // R
      largeStarsColors[i3 + 1] = 0.4 + Math.random() * 0.3; // G
      largeStarsColors[i3 + 2] = 0.1 + Math.random() * 0.2; // B
    }
    
    // Create geometry objects with the positions and colors
    const smallStarsGeometry = new THREE.BufferGeometry();
    smallStarsGeometry.setAttribute('position', new THREE.BufferAttribute(smallStarsPositions, 3));
    smallStarsGeometry.setAttribute('color', new THREE.BufferAttribute(smallStarsColors, 3));
    
    const mediumStarsGeometry = new THREE.BufferGeometry();
    mediumStarsGeometry.setAttribute('position', new THREE.BufferAttribute(mediumStarsPositions, 3));
    mediumStarsGeometry.setAttribute('color', new THREE.BufferAttribute(mediumStarsColors, 3));
    
    const largeStarsGeometry = new THREE.BufferGeometry();
    largeStarsGeometry.setAttribute('position', new THREE.BufferAttribute(largeStarsPositions, 3));
    largeStarsGeometry.setAttribute('color', new THREE.BufferAttribute(largeStarsColors, 3));
    
    return {
      smallStarsGeometry,
      mediumStarsGeometry,
      largeStarsGeometry,
      smallStarsCount: count,
      mediumStarsCount: Math.floor(count * 0.5),
      largeStarsCount: Math.floor(count * 0.2)
    };
  }, [count]);
  
  useFrame(({ clock }) => {
    if (pointsRef.current) {
      // Slight rotation to create a subtle twinkling effect
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.02;
    }
  });
  
  return {
    starGeometries,
    pointsRef
  };
};

export default useStarField;
