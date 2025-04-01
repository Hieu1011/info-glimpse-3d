
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const AnimatedBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    if (!containerRef.current || isInitialized) return;
    setIsInitialized(true);
    
    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera with better angle
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    // Position camera to see the whole solar system but not too far
    camera.position.set(30, 15, 30);
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    
    // Add orbit controls for better user interaction
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 10;
    controls.maxDistance = 60;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.1;
    controls.target.set(0, 0, 0);
    
    // Add ambient light for base illumination
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
    
    // Create realistic starfield background
    const createStarField = () => {
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
    };
    
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
    
    // Create textures for all planets
    const createPlanetTexture = (color: string, details: boolean = true): THREE.CanvasTexture => {
      const canvas = document.createElement('canvas');
      const size = 512;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Base color
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, size, size);
        
        if (details) {
          // Add detail patterns
          for (let i = 0; i < 2000; i++) {
            const x = Math.random() * size;
            const y = Math.random() * size;
            const radius = Math.random() * 3 + 1;
            const alpha = Math.random() * 0.2 + 0.1;
            
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.fill();
          }
          
          // Add larger features
          for (let i = 0; i < 20; i++) {
            const x = Math.random() * size;
            const y = Math.random() * size;
            const radius = Math.random() * 30 + 5;
            
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 0, 0, 0.15)`;
            ctx.fill();
          }
        }
      }
      
      return new THREE.CanvasTexture(canvas);
    };
    
    // Create Earth texture with continents
    const createEarthTexture = (): THREE.CanvasTexture => {
      const canvas = document.createElement('canvas');
      const size = 1024;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Base ocean color
        ctx.fillStyle = '#2233aa';
        ctx.fillRect(0, 0, size, size);
        
        // Simplified continent shapes (rough approximations)
        const continentsList = [
          // North America
          { points: [[200, 200], [350, 180], [380, 300], [320, 410], [200, 350]], color: '#3d8e33' },
          // South America
          { points: [[320, 410], [380, 490], [330, 600], [270, 550], [280, 450]], color: '#3d8e33' },
          // Europe
          { points: [[500, 200], [600, 180], [620, 280], [520, 330], [480, 260]], color: '#4a7942' },
          // Africa
          { points: [[500, 330], [620, 330], [650, 500], [520, 550], [460, 450]], color: '#c2a678' },
          // Asia
          { points: [[620, 180], [850, 200], [880, 330], [750, 450], [620, 330]], color: '#7d9f35' },
          // Australia
          { points: [[800, 500], [900, 480], [920, 550], [850, 600], [780, 560]], color: '#b97d49' },
          // Antarctica
          { points: [[350, 700], [550, 750], [750, 700], [600, 650], [400, 650]], color: '#e8e8e8' },
        ];
        
        // Draw continents
        continentsList.forEach(continent => {
          ctx.fillStyle = continent.color;
          ctx.beginPath();
          ctx.moveTo(continent.points[0][0], continent.points[0][1]);
          
          for (let i = 1; i < continent.points.length; i++) {
            ctx.lineTo(continent.points[i][0], continent.points[i][1]);
          }
          
          ctx.closePath();
          ctx.fill();
          
          // Add some terrain variation
          ctx.globalAlpha = 0.2;
          for (let i = 0; i < 500; i++) {
            const x = Math.random() * size;
            const y = Math.random() * size;
            const radius = Math.random() * 4 + 1;
            
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#333333';
            ctx.fill();
          }
          ctx.globalAlpha = 1.0;
        });
        
        // Add cloud patterns
        ctx.globalAlpha = 0.3;
        for (let i = 0; i < 40; i++) {
          const x = Math.random() * size;
          const y = Math.random() * size;
          const radius = Math.random() * 50 + 20;
          
          const gradient = ctx.createRadialGradient(
            x, y, 0,
            x, y, radius
          );
          
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }
        ctx.globalAlpha = 1.0;
      }
      
      return new THREE.CanvasTexture(canvas);
    };
    
    // Create Moon texture
    const createMoonTexture = (): THREE.CanvasTexture => {
      const canvas = document.createElement('canvas');
      const size = 512;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Base color
        ctx.fillStyle = '#aaa9ad';
        ctx.fillRect(0, 0, size, size);
        
        // Maria (dark areas)
        const maria = [
          { x: 250, y: 250, r: 100 },
          { x: 350, y: 200, r: 80 },
          { x: 180, y: 300, r: 70 },
          { x: 300, y: 350, r: 60 }
        ];
        
        maria.forEach(m => {
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
          ctx.fillStyle = '#3a3a45';
          ctx.fill();
        });
        
        // Craters
        for (let i = 0; i < 1000; i++) {
          const x = Math.random() * size;
          const y = Math.random() * size;
          const radius = Math.random() * 8 + 1;
          
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          
          // Crater with shadow
          const gradient = ctx.createRadialGradient(
            x - radius * 0.3, y - radius * 0.3, 0,
            x, y, radius
          );
          gradient.addColorStop(0, '#d0d0d0');
          gradient.addColorStop(0.8, '#808080');
          gradient.addColorStop(1, '#505050');
          
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      }
      
      return new THREE.CanvasTexture(canvas);
    };
    
    // Create asteroid belt
    const createAsteroidBelt = (innerRadius: number, outerRadius: number, count: number) => {
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
          const positions = asteroidGeometry.attributes.position;
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
    };
    
    // Create all celestial objects
    const starField = createStarField();
    const sun = createSun();
    
    // Create textures for planets
    const mercuryTexture = createPlanetTexture('#ada8a5', true);
    const venusTexture = createPlanetTexture('#e89b55');
    const earthTexture = createEarthTexture();
    const moonTexture = createMoonTexture();
    const marsTexture = createPlanetTexture('#c1440e');
    const jupiterTexture = createPlanetTexture('#c99039');
    const saturnTexture = createPlanetTexture('#e3bb76');
    
    // Create the planets (size, texture, distance from sun, rotation speed, orbit speed, axial tilt, has rings)
    const mercury = createPlanet(0.4, mercuryTexture, 6, 0.1, 0.8, 0.1);
    const venus = createPlanet(0.9, venusTexture, 8.5, 0.05, 0.6, 177);
    const { earthOrbitGroup, earth, moonOrbitGroup, moon } = createEarthWithMoon(11, earthTexture, moonTexture);
    const mars = createPlanet(0.5, marsTexture, 14, 0.9, 0.4, 25);
    const jupiter = createPlanet(2.5, jupiterTexture, 20, 2.2, 0.2, 3.1);
    const saturn = createPlanet(2.2, saturnTexture, 26, 2.0, 0.15, 26.7, true);
    
    // Create asteroid belt between Mars and Jupiter
    const asteroidBelt = createAsteroidBelt(16, 18, 200);
    
    // Animation loop
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      
      // Update controls
      controls.update();
      
      // Rotate the sun
      sun.rotation.y += 0.001;
      
      // Animate planets (rotation and orbit)
      [mercury, venus, earthOrbitGroup, mars, jupiter, saturn].forEach(({ planetGroup, planet }) => {
        if (planetGroup && planetGroup.userData) {
          // Update orbit around the sun
          planetGroup.rotation.y += planetGroup.userData.orbitSpeed * 0.005;
          
          // Update planet self-rotation
          if (planet) {
            planet.rotation.y += planet.userData.rotationSpeed * 0.01;
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
        if ('geometry' in object) {
          object.geometry.dispose();
        }
        
        if ('material' in object) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else if (object.material) {
            (object.material as THREE.Material).dispose();
          }
        }
      });
      
      // Remove renderer from DOM
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [isInitialized]);
  
  return <div ref={containerRef} className="absolute inset-0" />;
};

export default AnimatedBackground;
