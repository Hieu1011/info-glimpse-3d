
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
    
    // Create moon
    const createMoon = () => {
      const moonGeometry = new THREE.SphereGeometry(8, 32, 32);
      
      // Load moon texture
      const textureLoader = new THREE.TextureLoader();
      const moonTexture = textureLoader.load('data:image/jpeg;base64,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');
      
      const moonMaterial = new THREE.MeshStandardMaterial({
        map: moonTexture,
        roughness: 0.5,
        metalness: 0.1
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
      const bodyGeometry = new THREE.CapsuleGeometry(1.2, 2, 4, 8);
      const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      astronautGroup.add(body);
      
      // Helmet
      const helmetGeometry = new THREE.SphereGeometry(1, 16, 16);
      const helmetMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x88ccff,
        transparent: true,
        opacity: 0.7
      });
      const helmet = new THREE.Mesh(helmetGeometry, helmetMaterial);
      helmet.position.y = 1.5;
      astronautGroup.add(helmet);
      
      // Backpack
      const backpackGeometry = new THREE.BoxGeometry(1.5, 2, 1);
      const backpackMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
      const backpack = new THREE.Mesh(backpackGeometry, backpackMaterial);
      backpack.position.z = -0.8;
      astronautGroup.add(backpack);
      
      // Arms
      const armGeometry = new THREE.CapsuleGeometry(0.4, 1.5, 4, 8);
      const armMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
      
      const leftArm = new THREE.Mesh(armGeometry, armMaterial);
      leftArm.position.set(-1.5, 0, 0);
      leftArm.rotation.z = -0.3;
      astronautGroup.add(leftArm);
      
      const rightArm = new THREE.Mesh(armGeometry, armMaterial);
      rightArm.position.set(1.5, 0, 0);
      rightArm.rotation.z = 0.3;
      astronautGroup.add(rightArm);
      
      // Legs
      const legGeometry = new THREE.CapsuleGeometry(0.4, 2, 4, 8);
      const legMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
      
      const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
      leftLeg.position.set(-0.7, -2, 0);
      astronautGroup.add(leftLeg);
      
      const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
      rightLeg.position.set(0.7, -2, 0);
      astronautGroup.add(rightLeg);
      
      astronautGroup.position.set(10, 0, -10);
      scene.add(astronautGroup);
      
      return astronautGroup;
    };
    
    // Create particles in circular orbits
    const createOrbitalParticles = (count, radius, height, color, size, speed) => {
      const particlesGeometry = new THREE.BufferGeometry();
      const posArray = new Float32Array(count * 3);
      
      // Distribute particles in a circle
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        // Add some randomness to the radius
        const randomRadius = radius + (Math.random() - 0.5) * (radius * 0.2);
        posArray[i * 3] = Math.cos(angle) * randomRadius;
        posArray[i * 3 + 1] = (Math.random() - 0.5) * height;
        posArray[i * 3 + 2] = Math.sin(angle) * randomRadius;
      }
      
      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      
      // Materials
      const particlesMaterial = new THREE.PointsMaterial({
        size: size,
        color: color,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
      });
      
      // Mesh
      const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particlesMesh);
      
      // Store initial positions for animation
      const initialPositions = [...posArray];
      
      return { mesh: particlesMesh, initialPositions, speed };
    };
    
    // Create background stars
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 3000;
    const starVertices = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount * 3; i += 3) {
      starVertices[i] = (Math.random() - 0.5) * 200;
      starVertices[i + 1] = (Math.random() - 0.5) * 200;
      starVertices[i + 2] = (Math.random() - 0.5) * 200;
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starVertices, 3));
    
    const starMaterial = new THREE.PointsMaterial({
      size: 0.04,
      color: '#ffffff',
      transparent: true,
      opacity: 0.8,
    });
    
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    
    // Add a nebula-like effect with a colored mist
    const createNebula = (color, size, position) => {
      const nebulaMaterial = new THREE.SpriteMaterial({
        map: new THREE.TextureLoader().load('data:image/png;base64,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'),
        color: color,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
      });
      
      const nebula = new THREE.Sprite(nebulaMaterial);
      nebula.scale.set(size, size, 1);
      nebula.position.copy(position);
      scene.add(nebula);
      return nebula;
    };
    
    // Create elements
    const moon = createMoon();
    const astronaut = createAstronaut();
    
    // Create multiple orbital rings
    const orbitalRings = [
      createOrbitalParticles(300, 30, 10, '#4f86f7', 0.1, 0.03), // Blue outer ring
      createOrbitalParticles(200, 20, 5, '#ff69b4', 0.08, 0.02),  // Pink middle ring
      createOrbitalParticles(100, 10, 3, '#7df9ff', 0.06, 0.01),  // Cyan inner ring
    ];
    
    // Add several nebulae
    const nebulae = [
      createNebula('#4169e1', 25, new THREE.Vector3(-20, 10, -30)),
      createNebula('#ff69b4', 20, new THREE.Vector3(30, -5, -20)),
      createNebula('#9370db', 15, new THREE.Vector3(15, 15, -25))
    ];
    
    // Mouse movement
    let mouseX = 0;
    let mouseY = 0;
    
    function onDocumentMouseMove(event) {
      mouseX = (event.clientX - window.innerWidth / 2) / 150;
      mouseY = (event.clientY - window.innerHeight / 2) / 150;
    }
    
    document.addEventListener('mousemove', onDocumentMouseMove);
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Animate orbital rings
      orbitalRings.forEach((ring) => {
        const positions = ring.mesh.geometry.attributes.position.array;
        const initialPositions = ring.initialPositions;
        const time = Date.now() * ring.speed;
        
        for (let i = 0; i < positions.length; i += 3) {
          const x = initialPositions[i];
          const z = initialPositions[i + 2];
          
          // Rotate around y-axis
          positions[i] = x * Math.cos(time) - z * Math.sin(time);
          positions[i + 2] = x * Math.sin(time) + z * Math.cos(time);
        }
        
        ring.mesh.geometry.attributes.position.needsUpdate = true;
        ring.mesh.rotation.y += 0.0003;
      });
      
      // Rotate background stars
      stars.rotation.y += 0.0001;
      
      // Animate astronaut
      astronaut.rotation.y += 0.01;
      astronaut.position.y = Math.sin(Date.now() * 0.001) * 0.5;
      
      // Rotate moon
      moon.rotation.y += 0.002;
      
      // Pulse nebulae
      nebulae.forEach((nebula, i) => {
        const time = Date.now() * 0.0005;
        const scale = 0.9 + Math.sin(time + i) * 0.1;
        nebula.scale.set(nebula.scale.x * scale, nebula.scale.y * scale, 1);
      });
      
      // Follow mouse with slight parallax effect
      camera.position.x += (mouseX - camera.position.x) * 0.01;
      camera.position.y += (-mouseY - camera.position.y) * 0.01;
      
      camera.lookAt(scene.position);
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', onDocumentMouseMove);
    };
  }, []);
  
  return <div ref={containerRef} className="fixed inset-0 -z-10" />;
};

export default AnimatedBackground;
