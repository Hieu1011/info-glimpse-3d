
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
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);
    
    // Create more realistic starfield
    const createStarField = () => {
      const starCount = 7000; // Increased star count for more density
      const starGeometry = new THREE.BufferGeometry();
      const starVertices = new Float32Array(starCount * 3);
      const starColors = new Float32Array(starCount * 3);
      const starSizes = new Float32Array(starCount);
      
      for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        
        // Position - create a sphere of stars instead of a cube for more realism
        const radius = 80 + Math.random() * 40;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        starVertices[i3] = radius * Math.sin(phi) * Math.cos(theta);
        starVertices[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        starVertices[i3 + 2] = radius * Math.cos(phi);
        
        // Color - more realistic star colors
        const colorChoice = Math.random();
        if (colorChoice > 0.98) {
          // Reddish stars (giants)
          starColors[i3] = 0.9 + Math.random() * 0.1;
          starColors[i3 + 1] = 0.2 + Math.random() * 0.3;
          starColors[i3 + 2] = 0.2;
        } else if (colorChoice > 0.95) {
          // Blue stars (hot stars)
          starColors[i3] = 0.4 + Math.random() * 0.2;
          starColors[i3 + 1] = 0.6 + Math.random() * 0.2;
          starColors[i3 + 2] = 0.9 + Math.random() * 0.1;
        } else if (colorChoice > 0.9) {
          // Yellow stars (like our sun)
          starColors[i3] = 0.9;
          starColors[i3 + 1] = 0.9;
          starColors[i3 + 2] = 0.5 + Math.random() * 0.3;
        } else {
          // White-ish stars with slight variation (most common)
          const value = 0.7 + Math.random() * 0.3;
          starColors[i3] = value;
          starColors[i3 + 1] = value;
          starColors[i3 + 2] = value + (Math.random() * 0.1);
        }
        
        // Size - realistic star size distribution (most stars are small)
        const sizeFactor = Math.random();
        if (sizeFactor > 0.99) {
          // Very few large stars
          starSizes[i] = 3 + Math.random() * 2;
        } else if (sizeFactor > 0.95) {
          // Some medium stars
          starSizes[i] = 2 + Math.random();
        } else {
          // Most stars are small
          starSizes[i] = 0.5 + Math.random() * 1.5;
        }
      }
      
      starGeometry.setAttribute('position', new THREE.BufferAttribute(starVertices, 3));
      starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
      
      const starMaterial = new THREE.PointsMaterial({
        size: 0.3,
        vertexColors: true,
        transparent: true,
        opacity: 1,
        sizeAttenuation: true
      });
      
      // Create custom shader for stars with glow effect
      starMaterial.onBeforeCompile = (shader) => {
        shader.fragmentShader = shader.fragmentShader.replace(
          'void main() {',
          `
          uniform float time;
          void main() {
            // Twinkle effect
          `
        );
      };
      
      const stars = new THREE.Points(starGeometry, starMaterial);
      scene.add(stars);
      
      return stars;
    };
    
    // Create 3 orbital rings with different speeds and angles
    const createOrbitalRings = () => {
      const ringGroup = new THREE.Group();
      
      const colors = [0x3366ff, 0x6633ff, 0x33ddff];
      const radii = [25, 35, 45];
      const thicknesses = [0.1, 0.15, 0.1];
      const particleCounts = [1000, 1500, 1200];
      
      for (let r = 0; r < 3; r++) {
        const ringGeometry = new THREE.BufferGeometry();
        const ringVertices = new Float32Array(particleCounts[r] * 3);
        
        for (let i = 0; i < particleCounts[r]; i++) {
          const i3 = i * 3;
          const angle = (i / particleCounts[r]) * Math.PI * 2;
          
          // Add some randomness to make it look more natural
          const radius = radii[r] + (Math.random() - 0.5) * thicknesses[r] * 10;
          const tilt = Math.random() * Math.PI * 0.2;
          
          ringVertices[i3] = radius * Math.cos(angle);
          ringVertices[i3 + 1] = radius * Math.sin(angle) * Math.sin(tilt);
          ringVertices[i3 + 2] = radius * Math.sin(angle) * Math.cos(tilt);
        }
        
        ringGeometry.setAttribute('position', new THREE.BufferAttribute(ringVertices, 3));
        
        const ringMaterial = new THREE.PointsMaterial({
          size: 0.25,
          color: colors[r],
          transparent: true,
          opacity: 0.6,
          sizeAttenuation: true
        });
        
        const ring = new THREE.Points(ringGeometry, ringMaterial);
        ring.rotation.x = Math.random() * Math.PI * 0.2; // Slight random tilt
        ring.userData = { rotationSpeed: 0.0003 + Math.random() * 0.0005 };
        
        ringGroup.add(ring);
      }
      
      scene.add(ringGroup);
      return ringGroup;
    };
    
    // Create realistic moon
    const createMoon = () => {
      const moonGeometry = new THREE.SphereGeometry(8, 64, 64);
      
      // Create a more realistic texture
      const textureLoader = new THREE.TextureLoader();
      
      // Use placeholder texture data for now
      const moonTexture = textureLoader.load('data:image/jpeg;base64,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');
      
      const moonMaterial = new THREE.MeshStandardMaterial({
        map: moonTexture,
        roughness: 0.6,
        metalness: 0.1
      });
      
      const moon = new THREE.Mesh(moonGeometry, moonMaterial);
      moon.position.set(-25, 15, -30);
      scene.add(moon);
      
      return moon;
    };
    
    // Create realistic astronaut
    const createAstronaut = () => {
      const astronautGroup = new THREE.Group();
      
      // Body
      const bodyGeometry = new THREE.CapsuleGeometry(1.2, 2.5, 8, 16);
      const bodyMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        roughness: 0.3,
        metalness: 0.2
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      astronautGroup.add(body);
      
      // Helmet
      const helmetGeometry = new THREE.SphereGeometry(1.1, 32, 32);
      const helmetMaterial = new THREE.MeshPhysicalMaterial({ 
        color: 0xc0d6e4,
        transmission: 0.9,
        opacity: 0.7,
        metalness: 0.2,
        roughness: 0.05,
        ior: 1.5,
        reflectivity: 0.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
      });
      const helmet = new THREE.Mesh(helmetGeometry, helmetMaterial);
      helmet.position.y = 1.6;
      astronautGroup.add(helmet);
      
      // Visor
      const visorGeometry = new THREE.SphereGeometry(0.9, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5);
      const visorMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x222255,
        metalness: 0.9,
        roughness: 0.1,
        transmission: 0.4,
        reflectivity: 1.0,
        clearcoat: 1.0
      });
      const visor = new THREE.Mesh(visorGeometry, visorMaterial);
      visor.position.y = 1.6;
      visor.position.z = 0.4;
      visor.rotation.x = Math.PI * 0.5;
      astronautGroup.add(visor);
      
      // Backpack
      const backpackGeometry = new THREE.BoxGeometry(2, 2.2, 1);
      const backpackMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xaaaaaa,
        roughness: 0.5,
        metalness: 0.2
      });
      const backpack = new THREE.Mesh(backpackGeometry, backpackMaterial);
      backpack.position.z = -1.2;
      backpack.position.y = 0.2;
      astronautGroup.add(backpack);
      
      // Arms
      const armGeometry = new THREE.CapsuleGeometry(0.5, 1.8, 8, 8);
      const armMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
      
      const leftArm = new THREE.Mesh(armGeometry, armMaterial);
      leftArm.position.set(-1.8, 0.2, 0);
      leftArm.rotation.z = -0.4;
      astronautGroup.add(leftArm);
      
      const rightArm = new THREE.Mesh(armGeometry, armMaterial);
      rightArm.position.set(1.8, 0.2, 0);
      rightArm.rotation.z = 0.4;
      astronautGroup.add(rightArm);
      
      // Legs
      const legGeometry = new THREE.CapsuleGeometry(0.5, 2.2, 8, 8);
      const legMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
      
      const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
      leftLeg.position.set(-0.8, -2.3, 0);
      astronautGroup.add(leftLeg);
      
      const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
      rightLeg.position.set(0.8, -2.3, 0);
      astronautGroup.add(rightLeg);
      
      // Add some details - NASA logo
      const logoGeometry = new THREE.PlaneGeometry(0.8, 0.8);
      const logoMaterial = new THREE.MeshBasicMaterial({
        color: 0x0b3d91,
        side: THREE.DoubleSide
      });
      const logo = new THREE.Mesh(logoGeometry, logoMaterial);
      logo.position.set(0, 0.8, 1.22);
      logo.rotation.x = Math.PI;
      astronautGroup.add(logo);
      
      // Position the astronaut
      astronautGroup.position.set(15, 0, -20);
      astronautGroup.rotation.y = Math.PI * 0.3;
      scene.add(astronautGroup);
      
      return astronautGroup;
    };
    
    // Create lights
    const createLights = () => {
      // Ambient light for overall illumination
      const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
      scene.add(ambientLight);
      
      // Directional light to simulate sunlight
      const sunLight = new THREE.DirectionalLight(0xffffff, 1);
      sunLight.position.set(50, 30, 20);
      scene.add(sunLight);
      
      // Point light near the moon to make it glow
      const moonLight = new THREE.PointLight(0x99bbff, 2, 30);
      moonLight.position.set(-25, 15, -25);
      scene.add(moonLight);
      
      return { ambientLight, sunLight, moonLight };
    };
    
    // Create all objects
    const starField = createStarField();
    const orbitalRings = createOrbitalRings();
    const moon = createMoon();
    const astronaut = createAstronaut();
    const lights = createLights();
    
    // Animation loop
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (event) => {
      mouseX = (event.clientX - window.innerWidth / 2) * 0.005;
      mouseY = (event.clientY - window.innerHeight / 2) * 0.005;
    });
    
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate orbital rings
      orbitalRings.children.forEach(ring => {
        ring.rotation.y += ring.userData.rotationSpeed;
        ring.rotation.x += ring.userData.rotationSpeed * 0.2;
      });
      
      // Rotate the moon slowly
      if (moon) {
        moon.rotation.y += 0.001;
      }
      
      // Make astronaut float
      if (astronaut) {
        astronaut.position.y = Math.sin(Date.now() * 0.001) * 0.5;
        astronaut.rotation.y += 0.002;
      }
      
      // Camera movement based on mouse position
      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);
      
      renderer.render(scene, camera);
    };
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    animate();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', () => {});
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      scene.dispose();
    };
  }, []);
  
  return <div ref={containerRef} className="absolute inset-0" />;
};

export default AnimatedBackground;
