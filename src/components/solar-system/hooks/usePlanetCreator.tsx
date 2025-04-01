
import * as THREE from 'three';

export function usePlanetCreator(scene: THREE.Scene) {
  // Create the Sun (center of solar system)
  const createSun = () => {
    // Create a detailed sun texture
    const sunCanvas = document.createElement('canvas');
    const sunSize = 512;
    sunCanvas.width = sunSize;
    sunCanvas.height = sunSize;
    const sunCtx = sunCanvas.getContext('2d');
    
    if (sunCtx) {
      // Create base gradient for sun color
      const gradient = sunCtx.createRadialGradient(
        sunSize / 2, sunSize / 2, 0,
        sunSize / 2, sunSize / 2, sunSize / 2
      );
      
      gradient.addColorStop(0, '#fff9e5');
      gradient.addColorStop(0.2, '#ffee99');
      gradient.addColorStop(0.4, '#ff8a00');
      gradient.addColorStop(0.8, '#ff4400');
      gradient.addColorStop(1, '#ff2200');
      
      sunCtx.fillStyle = gradient;
      sunCtx.fillRect(0, 0, sunSize, sunSize);
      
      // Add surface details
      sunCtx.globalAlpha = 0.4;
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * sunSize;
        const y = Math.random() * sunSize;
        const r = Math.random() * 80 + 20;
        
        const spotGradient = sunCtx.createRadialGradient(
          x, y, 0, x, y, r
        );
        
        spotGradient.addColorStop(0, 'rgba(255, 60, 0, 0.8)');
        spotGradient.addColorStop(1, 'rgba(255, 120, 0, 0)');
        
        sunCtx.fillStyle = spotGradient;
        sunCtx.beginPath();
        sunCtx.arc(x, y, r, 0, Math.PI * 2);
        sunCtx.fill();
      }
    }
    
    const sunTexture = new THREE.CanvasTexture(sunCanvas);
    
    // Create the sun geometry and material
    const sunGeometry = new THREE.SphereGeometry(4, 64, 64);
    const sunMaterial = new THREE.MeshBasicMaterial({
      map: sunTexture,
      transparent: false,
      side: THREE.FrontSide
    });
    
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    
    // Create sun corona (glow effect)
    const coronaGeometry = new THREE.SphereGeometry(4.4, 32, 32);
    const coronaMaterial = new THREE.MeshBasicMaterial({
      color: 0xffddaa,
      transparent: true,
      opacity: 0.3,
      side: THREE.BackSide
    });
    
    const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
    sun.add(corona);
    
    // Create outer corona
    const outerCoronaGeometry = new THREE.SphereGeometry(5, 32, 32);
    const outerCoronaMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffdd,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide
    });
    
    const outerCorona = new THREE.Mesh(outerCoronaGeometry, outerCoronaMaterial);
    sun.add(outerCorona);
    
    // Add a point light to simulate sun's light
    const sunLight = new THREE.PointLight(0xffffff, 2, 100);
    sun.add(sunLight);
    
    scene.add(sun);
    return sun;
  };
  
  // Function to create planets with realistic textures
  const createPlanet = (
    size: number, 
    texture: THREE.Texture, 
    position: number, 
    rotationSpeed: number,
    orbitSpeed: number,
    tilt: number = 0,
    hasRings: boolean = false
  ) => {
    // Create planet group (for orbiting)
    const planetGroup = new THREE.Group();
    scene.add(planetGroup);
    
    // Create planet mesh
    const planetGeometry = new THREE.SphereGeometry(size, 32, 32);
    const planetMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.7,
      metalness: 0.0
    });
    
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    planet.rotation.x = tilt * (Math.PI / 180); // Tilt in degrees
    planet.position.x = position;
    planetGroup.add(planet);
    
    // Add rings if needed (for Saturn)
    if (hasRings) {
      const ringGeometry = new THREE.RingGeometry(size * 1.4, size * 2.2, 64);
      
      const ringCanvas = document.createElement('canvas');
      ringCanvas.width = 512;
      ringCanvas.height = 64;
      const ringCtx = ringCanvas.getContext('2d');
      
      if (ringCtx) {
        ringCtx.fillStyle = 'rgb(180, 160, 130)';
        ringCtx.fillRect(0, 0, 512, 64);
        
        for (let i = 0; i < 512; i += 2) {
          const alpha = Math.random() * 0.5 + 0.5;
          const brightness = Math.random() * 30 + 160;
          ringCtx.fillStyle = `rgba(${brightness}, ${brightness - 20}, ${brightness - 40}, ${alpha})`;
          ringCtx.fillRect(i, 0, 2, 64);
        }
      }
      
      const ringTexture = new THREE.CanvasTexture(ringCanvas);
      
      const ringMaterial = new THREE.MeshStandardMaterial({
        map: ringTexture,
        transparent: true,
        side: THREE.DoubleSide,
        roughness: 0.8
      });
      
      const rings = new THREE.Mesh(ringGeometry, ringMaterial);
      rings.rotation.x = Math.PI / 2;
      planet.add(rings);
    }
    
    // Store animation info
    planetGroup.userData = {
      orbitSpeed,
      rotationSpeed
    };
    
    planet.userData = {
      rotationSpeed
    };
    
    return { planetGroup, planet };
  };
  
  // Create Earth with Moon orbiting it
  const createEarthWithMoon = (position: number, earthTexture: THREE.Texture, moonTexture: THREE.Texture) => {
    // Create Earth group for orbit around the sun
    const earthOrbitGroup = new THREE.Group();
    scene.add(earthOrbitGroup);
    
    // Create Earth
    const earthSize = 1;
    const earthGeometry = new THREE.SphereGeometry(earthSize, 32, 32);
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.7,
      metalness: 0.1
    });
    
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.rotation.x = 23.5 * (Math.PI / 180); // Earth's axial tilt
    earth.position.x = position;
    earthOrbitGroup.add(earth);
    
    // Create Moon orbit group
    const moonOrbitGroup = new THREE.Group();
    earth.add(moonOrbitGroup);
    
    // Create Moon
    const moonSize = 0.27; // Relative to Earth
    const moonGeometry = new THREE.SphereGeometry(moonSize, 24, 24);
    const moonMaterial = new THREE.MeshStandardMaterial({
      map: moonTexture,
      roughness: 0.8,
      metalness: 0.0
    });
    
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.x = 2; // Moon distance from Earth
    moonOrbitGroup.add(moon);
    
    // Store animation info
    earthOrbitGroup.userData = {
      orbitSpeed: 0.3, // Earth orbit speed around Sun
      rotationSpeed: 1 // Earth rotation speed
    };
    
    moonOrbitGroup.userData = {
      orbitSpeed: 2.7 // Moon orbit speed around Earth
    };
    
    moon.userData = {
      rotationSpeed: 0.1 // Moon rotation speed
    };
    
    return { earthOrbitGroup, earth, moonOrbitGroup, moon };
  };
  
  return { createPlanet, createEarthWithMoon, createSun };
}
