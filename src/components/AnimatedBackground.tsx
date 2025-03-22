
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
    
    // Create particles in circular orbits
    const createOrbitalParticles = (count: number, radius: number, height: number, color: string, size: number, speed: number) => {
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
      const initialPositions = posArray.slice();
      
      return { mesh: particlesMesh, initialPositions, speed };
    };
    
    // Create multiple orbital rings
    const orbitalRings = [
      createOrbitalParticles(300, 30, 10, '#4f86f7', 0.1, 0.03), // Blue outer ring
      createOrbitalParticles(200, 20, 5, '#ff69b4', 0.08, 0.02),  // Pink middle ring
      createOrbitalParticles(100, 10, 3, '#7df9ff', 0.06, 0.01),  // Cyan inner ring
    ];
    
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
    const createNebula = (color: string, size: number, position: THREE.Vector3) => {
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
    
    // Add several nebulae
    const nebulae = [
      createNebula('#4169e1', 25, new THREE.Vector3(-20, 10, -30)),
      createNebula('#ff69b4', 20, new THREE.Vector3(30, -5, -20)),
      createNebula('#9370db', 15, new THREE.Vector3(15, 15, -25))
    ];
    
    // Mouse movement
    let mouseX = 0;
    let mouseY = 0;
    
    function onDocumentMouseMove(event: MouseEvent) {
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
        const positions = ring.mesh.geometry.attributes.position.array as Float32Array;
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
