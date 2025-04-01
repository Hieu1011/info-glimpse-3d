
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { MutableRefObject } from 'react';

type AnimationProps = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  sun: THREE.Mesh;
  planets: Array<{ planetGroup: THREE.Group; planet: THREE.Mesh }>;
  earth: THREE.Mesh;
  moonOrbitGroup: THREE.Group;
  moon: THREE.Mesh;
  asteroidBelt: THREE.Group;
  containerRef: MutableRefObject<HTMLDivElement | null>;
};

export function useAnimation({
  scene,
  camera,
  renderer,
  controls,
  sun,
  planets,
  earth,
  moonOrbitGroup,
  moon,
  asteroidBelt,
  containerRef
}: AnimationProps) {
  // Animation loop
  const animate = () => {
    const animationId = requestAnimationFrame(animate);
    
    // Update controls
    controls.update();
    
    // Rotate the sun
    sun.rotation.y += 0.001;
    
    // Animate planets (rotation and orbit)
    planets.forEach((planetObj) => {
      if (planetObj && 'planetGroup' in planetObj && 'planet' in planetObj) {
        const { planetGroup, planet } = planetObj;
        // Update orbit around the sun
        if (planetGroup && planetGroup.userData) {
          planetGroup.rotation.y += planetGroup.userData.orbitSpeed * 0.005;
        
          // Update planet self-rotation
          if (planet) {
            planet.rotation.y += planet.userData.rotationSpeed * 0.01;
          }
        }
      }
    });
    
    // Special handling for Earth-Moon system
    earth.rotation.y += 0.01; // Earth rotation
    moonOrbitGroup.rotation.y += 0.007; // Moon orbiting Earth
    moon.rotation.y += 0.001; // Moon self-rotation
    
    // Animate asteroid belt
    asteroidBelt.children.forEach(asteroid => {
      if (asteroid.userData) {
        // Update asteroid rotation
        asteroid.rotation.x += asteroid.userData.rotationSpeed;
        asteroid.rotation.y += asteroid.userData.rotationSpeed * 0.8;
        
        // Update asteroid orbit
        const radius = asteroid.userData.orbitRadius;
        const angle = asteroid.userData.orbitAngle += asteroid.userData.orbitSpeed * 0.01;
        
        asteroid.position.x = radius * Math.cos(angle);
        asteroid.position.z = radius * Math.sin(angle);
      }
    });
    
    renderer.render(scene, camera);
  };
  
  // Handle window resize
  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  
  window.addEventListener('resize', handleResize);
  
  // Start animation
  const animationId = requestAnimationFrame(animate);
  
  // Cleanup function
  return () => {
    window.removeEventListener('resize', handleResize);
    cancelAnimationFrame(animationId);
    
    // Dispose of THREE.js objects to prevent memory leaks
    renderer.dispose();
    
    // Dispose of geometries and materials
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        if (object.geometry) {
          object.geometry.dispose();
        }
        
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      }
    });
    
    // Remove renderer from DOM
    if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
      containerRef.current.removeChild(renderer.domElement);
    }
  };
}
