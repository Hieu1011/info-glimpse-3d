
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
    
    // Create more realistic starfield with proper point sprites
    const createStarField = () => {
      const starCount = 7000;
      
      // Create a custom star texture
      const canvas = document.createElement('canvas');
      const size = 32;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Create radial gradient for the star
        const gradient = ctx.createRadialGradient(
          size / 2, size / 2, 0,
          size / 2, size / 2, size / 2
        );
        
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.4, 'rgba(240, 240, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(220, 220, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);
      }
      
      const starTexture = new THREE.CanvasTexture(canvas);
      
      // Create star vertices for the sphere distribution
      const starGeometry = new THREE.BufferGeometry();
      const starPositions = new Float32Array(starCount * 3);
      const starColors = new Float32Array(starCount * 3);
      const starSizes = new Float32Array(starCount);
      
      for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        
        // Position - create a sphere of stars for more realism
        const radius = 80 + Math.random() * 40;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        starPositions[i3 + 2] = radius * Math.cos(phi);
        
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
        
        // Size - realistic star size distribution
        const sizeFactor = Math.random();
        if (sizeFactor > 0.99) {
          // Very few large stars
          starSizes[i] = 2 + Math.random() * 1.5;
        } else if (sizeFactor > 0.95) {
          // Some medium stars
          starSizes[i] = 1.2 + Math.random() * 0.8;
        } else {
          // Most stars are small
          starSizes[i] = 0.1 + Math.random() * 0.8;
        }
      }
      
      starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
      starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
      
      const starMaterial = new THREE.PointsMaterial({
        size: 0.3,
        map: starTexture,
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      
      const stars = new THREE.Points(starGeometry, starMaterial);
      scene.add(stars);
      
      return stars;
    };
    
    // Create 3 pulsating cosmic nebula circles
    const createCosmicCircles = () => {
      const circleGroup = new THREE.Group();
      
      const colors = [0x3366ff, 0x6633ff, 0x33ddff];
      const radii = [25, 35, 45];
      const segments = 128;
      
      for (let r = 0; r < 3; r++) {
        // Create a circle line
        const circleGeometry = new THREE.BufferGeometry();
        const circlePositions = new Float32Array((segments + 1) * 3);
        
        for (let i = 0; i <= segments; i++) {
          const angle = (i / segments) * Math.PI * 2;
          const index = i * 3;
          
          circlePositions[index] = Math.cos(angle) * radii[r];
          circlePositions[index + 1] = Math.sin(angle) * radii[r];
          circlePositions[index + 2] = 0;
        }
        
        circleGeometry.setAttribute('position', new THREE.BufferAttribute(circlePositions, 3));
        
        // Create pulsating nebula material
        const circleMaterial = new THREE.LineBasicMaterial({
          color: colors[r],
          transparent: true,
          opacity: 0.5
        });
        
        const circle = new THREE.Line(circleGeometry, circleMaterial);
        
        // Add tilt to the circle
        circle.rotation.x = Math.random() * Math.PI * 0.2;
        circle.rotation.z = Math.random() * Math.PI * 0.1;
        
        // Add nebula particles along the circle
        const particleCount = 200 + Math.floor(Math.random() * 100);
        const nebulaGeometry = new THREE.BufferGeometry();
        const nebulaPositions = new Float32Array(particleCount * 3);
        const nebulaSizes = new Float32Array(particleCount);
        
        for (let i = 0; i < particleCount; i++) {
          const angle = (i / particleCount) * Math.PI * 2;
          // Add some randomness to particle positions
          const radiusVariation = (Math.random() - 0.5) * 2.5;
          const heightVariation = (Math.random() - 0.5) * 0.5;
          
          const index = i * 3;
          nebulaPositions[index] = (Math.cos(angle) * (radii[r] + radiusVariation));
          nebulaPositions[index + 1] = (Math.sin(angle) * (radii[r] + radiusVariation));
          nebulaPositions[index + 2] = heightVariation;
          
          // Vary particle sizes
          nebulaSizes[i] = 0.5 + Math.random() * 1.5;
        }
        
        nebulaGeometry.setAttribute('position', new THREE.BufferAttribute(nebulaPositions, 3));
        nebulaGeometry.setAttribute('size', new THREE.BufferAttribute(nebulaSizes, 1));
        
        // Create a custom nebula texture
        const nebulaCanvas = document.createElement('canvas');
        const nebulaSize = 64;
        nebulaCanvas.width = nebulaSize;
        nebulaCanvas.height = nebulaSize;
        const nebulaCtx = nebulaCanvas.getContext('2d');
        
        if (nebulaCtx) {
          const nebulaGradient = nebulaCtx.createRadialGradient(
            nebulaSize / 2, nebulaSize / 2, 0,
            nebulaSize / 2, nebulaSize / 2, nebulaSize / 2
          );
          
          nebulaGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
          nebulaGradient.addColorStop(0.3, 'rgba(160, 160, 255, 0.5)');
          nebulaGradient.addColorStop(1, 'rgba(100, 100, 255, 0)');
          
          nebulaCtx.fillStyle = nebulaGradient;
          nebulaCtx.fillRect(0, 0, nebulaSize, nebulaSize);
        }
        
        const nebulaTexture = new THREE.CanvasTexture(nebulaCanvas);
        
        const nebulaMaterial = new THREE.PointsMaterial({
          size: 1.0,
          map: nebulaTexture,
          transparent: true,
          opacity: 0.7,
          color: new THREE.Color(colors[r]),
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        
        const nebula = new THREE.Points(nebulaGeometry, nebulaMaterial);
        
        // Store animation parameters
        circle.userData = {
          rotationSpeed: 0.0001 + Math.random() * 0.0003,
          pulseSpeed: 0.002 + Math.random() * 0.001,
          pulsePhase: Math.random() * Math.PI * 2
        };
        
        nebula.userData = { ...circle.userData };
        
        circleGroup.add(circle);
        circleGroup.add(nebula);
      }
      
      scene.add(circleGroup);
      return circleGroup;
    };
    
    // Create lights
    const createLights = () => {
      // Ambient light for overall illumination
      const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
      scene.add(ambientLight);
      
      // Directional light to simulate distant star
      const sunLight = new THREE.DirectionalLight(0xffffff, 1);
      sunLight.position.set(50, 30, 20);
      scene.add(sunLight);
      
      // Add some point lights for visual interest
      const colors = [0x3366ff, 0xffff99, 0xff6633];
      const positions = [
        [-30, 15, -20],
        [25, -10, -30],
        [0, 20, -15]
      ];
      
      const pointLights = [];
      for (let i = 0; i < 3; i++) {
        const light = new THREE.PointLight(colors[i], 0.8, 30);
        light.position.set(...positions[i]);
        scene.add(light);
        pointLights.push(light);
      }
      
      return { ambientLight, sunLight, pointLights };
    };
    
    // Create all objects
    const starField = createStarField();
    const cosmicCircles = createCosmicCircles();
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
      
      // Animate the cosmic circles
      if (cosmicCircles && cosmicCircles.children) {
        cosmicCircles.children.forEach(child => {
          if (child.userData && child.userData.rotationSpeed) {
            child.rotation.y += child.userData.rotationSpeed;
            
            // Add pulsating effect
            if (child.userData.pulseSpeed) {
              const pulseValue = Math.sin(Date.now() * child.userData.pulseSpeed + child.userData.pulsePhase) * 0.2 + 0.8;
              
              if (child.material) {
                if (child.material.opacity !== undefined) {
                  child.material.opacity = pulseValue * 0.7;
                }
                
                if (child.material.size !== undefined && child.geometry.attributes.size) {
                  const sizes = child.geometry.attributes.size;
                  for (let i = 0; i < sizes.count; i++) {
                    sizes.array[i] = (0.5 + Math.random() * 1.5) * pulseValue;
                  }
                  sizes.needsUpdate = true;
                }
              }
            }
          }
        });
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
