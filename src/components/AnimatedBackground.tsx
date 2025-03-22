
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
    
    // Create realistic moon
    const createMoon = () => {
      const moonGeometry = new THREE.SphereGeometry(8, 64, 64);
      
      // Load moon texture
      const textureLoader = new THREE.TextureLoader();
      const moonTexture = textureLoader.load('/moon-texture.jpg');
      
      const moonMaterial = new THREE.MeshStandardMaterial({
        map: moonTexture,
        normalScale: new THREE.Vector2(0.5, 0.5),
        roughness: 0.5,
        metalness: 0.2
      });
      
      const moon = new THREE.Mesh(moonGeometry, moonMaterial);
      moon.position.set(-15, 8, -15);
      scene.add(moon);
      
      return moon;
    };
    
    // Create astronaut
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
      
      // NASA logo
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
      astronautGroup.position.set(12, 0, -10);
      scene.add(astronautGroup);
      
      return astronautGroup;
    };
    
    // Create starfield
    const createStarField = () => {
      const starCount = 5000;
      const starGeometry = new THREE.BufferGeometry();
      const starPositions = new Float32Array(starCount * 3);
      
      for (let i = 0; i < starCount * 3; i += 3) {
        starPositions[i] = (Math.random() - 0.5) * 200;
        starPositions[i + 1] = (Math.random() - 0.5) * 200;
        starPositions[i + 2] = (Math.random() - 0.5) * 200;
      }
      
      starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
      
      const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.5,
        transparent: true,
        sizeAttenuation: true
      });
      
      const stars = new THREE.Points(starGeometry, starMaterial);
      scene.add(stars);
      
      return stars;
    };
    
    // Add orbital rings
    const createOrbitalRing = (radius, color, segments = 128) => {
      const ringGeometry = new THREE.RingGeometry(radius - 0.3, radius, segments);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      scene.add(ring);
      return ring;
    };
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1); // soft white light
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);
    
    // Create objects
    const moon = createMoon();
    const astronaut = createAstronaut();
    const stars = createStarField();
    const ring1 = createOrbitalRing(30, 0x3498db);
    const ring2 = createOrbitalRing(40, 0xe74c3c);
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Mouse movement effect
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    const handleMouseMove = (event) => {
      mouseX = (event.clientX - window.innerWidth / 2) / 100;
      mouseY = (event.clientY - window.innerHeight / 2) / 100;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Smooth camera movement following mouse
      targetX = mouseX * 0.3;
      targetY = mouseY * 0.3;
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);
      
      // Rotate astronaut
      if (astronaut) {
        astronaut.rotation.y += 0.005;
        astronaut.position.y = Math.sin(Date.now() * 0.001) * 1 + 2; // Floating effect
      }
      
      // Rotate moon
      if (moon) {
        moon.rotation.y += 0.001;
      }
      
      // Rotate rings
      if (ring1) ring1.rotation.z += 0.0005;
      if (ring2) ring2.rotation.z -= 0.0003;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of all THREE.js resources
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        }
      });
      
      renderer.dispose();
    };
  }, []);
  
  return <div ref={containerRef} className="absolute inset-0 z-[-1]" />;
};

export default AnimatedBackground;
