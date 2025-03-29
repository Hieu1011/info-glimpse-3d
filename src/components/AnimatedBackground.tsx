
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const AnimatedBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 50;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);
    
    // Create starry background
    const createStarField = () => {
      const starCount = 10000;
      const starPositions = new Float32Array(starCount * 3);
      const starColors = new Float32Array(starCount * 3);
      const starSizes = new Float32Array(starCount);
      
      for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        const radius = 100 + Math.random() * 50;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        starPositions[i3 + 2] = radius * Math.cos(phi);
        
        const brightness = 0.5 + Math.random() * 0.5;
        starColors[i3] = brightness;
        starColors[i3 + 1] = brightness;
        starColors[i3 + 2] = brightness;
        
        starSizes[i] = Math.random() * 0.5;
      }
      
      const starGeometry = new THREE.BufferGeometry();
      starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
      starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
      
      const starMaterial = new THREE.PointsMaterial({
        size: 0.2,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
      });
      
      const stars = new THREE.Points(starGeometry, starMaterial);
      scene.add(stars);
      return stars;
    };
    
    // Asteroid belt
    const createAsteroidBelt = () => {
      const asteroidCount = 1000;
      const asteroidPositions = new Float32Array(asteroidCount * 3);
      
      for (let i = 0; i < asteroidCount; i++) {
        const i3 = i * 3;
        const radius = 20 + Math.random() * 5;
        const theta = Math.random() * Math.PI * 2;
        
        asteroidPositions[i3] = radius * Math.cos(theta);
        asteroidPositions[i3 + 1] = (Math.random() - 0.5) * 2;
        asteroidPositions[i3 + 2] = radius * Math.sin(theta);
      }
      
      const asteroidGeometry = new THREE.BufferGeometry();
      asteroidGeometry.setAttribute('position', new THREE.BufferAttribute(asteroidPositions, 3));
      
      const asteroidMaterial = new THREE.PointsMaterial({
        size: 0.1,
        color: 0x888888,
        transparent: true,
        opacity: 0.7
      });
      
      const asteroidBelt = new THREE.Points(asteroidGeometry, asteroidMaterial);
      scene.add(asteroidBelt);
      return asteroidBelt;
    };
    
    // Planets and solar system setup
    const createPlanet = (name, radius, color, distance, orbitSpeed) => {
      const planetGroup = new THREE.Group();
      const geometry = new THREE.SphereGeometry(radius, 32, 32);
      const material = new THREE.MeshStandardMaterial({ color });
      const planet = new THREE.Mesh(geometry, material);
      
      planetGroup.add(planet);
      planet.position.x = distance;
      
      scene.add(planetGroup);
      
      planetGroup.userData = {
        orbitSpeed,
        rotationSpeed: Math.random() * 0.01
      };
      
      return planetGroup;
    };
    
    // Create solar system
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(3, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0xffff00 })
    );
    scene.add(sun);
    
    const planets = [
      createPlanet('Mercury', 0.4, 0x888888, 5, 0.04),   // Gần mặt trời nhất
      createPlanet('Venus', 0.7, 0xffcc99, 7, 0.03),     // Màu vàng nhạt
      createPlanet('Earth', 0.8, 0x0077be, 10, 0.02),   // Màu xanh dương
      createPlanet('Mars', 0.5, 0xff6644, 13, 0.018),   // Màu đỏ
      createPlanet('Jupiter', 1.5, 0xffaa66, 18, 0.01), // Khí đồng
      createPlanet('Saturn', 1.3, 0xccaa77, 23, 0.008), // Màu be
      createPlanet('Uranus', 1.1, 0x99ccff, 28, 0.006),// Xanh lam nhạt
      createPlanet('Neptune', 1.0, 0x4444ff, 33, 0.004)// Xanh dương đậm
    ];
    
    // Add Earth's moon
    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0xcccccc })
    );
    const earthPlanet = planets[2];
    const moonOrbit = new THREE.Group();
    moonOrbit.add(moon);
    moon.position.x = 1.5;
    earthPlanet.add(moonOrbit);
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0x222222);
    const sunLight = new THREE.PointLight(0xffffff, 2, 100);
    scene.add(ambientLight, sunLight);
    
    createStarField();
    createAsteroidBelt();
    
    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate planets
      planets.forEach(planetGroup => {
        const planet = planetGroup.children[0];
        planet.rotation.y += planetGroup.userData.rotationSpeed;
        planetGroup.rotation.y += planetGroup.userData.orbitSpeed;
      });
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup
    return () => {
      // Dispose resources
      renderer.dispose();
      scene.children.forEach(child => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => mat.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    };
  }, []);
  
  return <div ref={containerRef} className="absolute inset-0" />;
};

export default AnimatedBackground;

