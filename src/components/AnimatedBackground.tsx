
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const AnimatedBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.00025);
    
    // Create camera with better perspective
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(30, 50, 80);
    camera.lookAt(0, 0, 0);
    
    // Create renderer with better quality
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      logarithmicDepthBuffer: true,
      powerPreference: 'high-performance' 
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    
    // Add orbit controls for interactive viewing
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.minDistance = 50;
    controls.maxDistance = 200;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3;
    
    // Create starry background with depth
    const createStarField = () => {
      const starCount = 10000;
      const starGeometry = new THREE.BufferGeometry();
      const starPositions = new Float32Array(starCount * 3);
      const starSizes = new Float32Array(starCount);
      const starColors = new Float32Array(starCount * 3);
      
      for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        // Create stars in a wider sphere for more depth
        const radius = 80 + Math.random() * 120;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        starPositions[i3 + 2] = radius * Math.cos(phi);
        
        // Vary brightness and colors for realism
        const hue = Math.random();
        const color = new THREE.Color().setHSL(hue, 0.2, 0.8 + Math.random() * 0.2);
        
        starColors[i3] = color.r;
        starColors[i3 + 1] = color.g;
        starColors[i3 + 2] = color.b;
        
        starSizes[i] = Math.random() * 1.5;
      }
      
      starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
      starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
      starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
      
      const starMaterial = new THREE.ShaderMaterial({
        uniforms: {
          pointTexture: { value: createStarTexture() }
        },
        vertexShader: `
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          uniform sampler2D pointTexture;
          varying vec3 vColor;
          void main() {
            gl_FragColor = vec4(vColor, 1.0) * texture2D(pointTexture, gl_PointCoord);
            if (gl_FragColor.a < 0.3) discard;
          }
        `,
        blending: THREE.AdditiveBlending,
        depthTest: true,
        transparent: true,
      });
      
      const stars = new THREE.Points(starGeometry, starMaterial);
      scene.add(stars);
      return stars;
    };
    
    // Create a texture for stars
    const createStarTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.Texture();
      
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.2, 'rgba(240,240,255,1)');
      gradient.addColorStop(0.4, 'rgba(220,220,255,0.8)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };
    
    // Create a textured asteroid belt
    const createAsteroidBelt = () => {
      const asteroidCount = 2000;
      const asteroidPositions = new Float32Array(asteroidCount * 3);
      const asteroidScales = new Float32Array(asteroidCount);
      const asteroidRotations = new Float32Array(asteroidCount * 3);
      
      for (let i = 0; i < asteroidCount; i++) {
        const i3 = i * 3;
        const radius = 25 + Math.random() * 10;
        const angle = Math.random() * Math.PI * 2;
        const tilt = (Math.random() - 0.5) * 3; // More vertical space
        
        asteroidPositions[i3] = radius * Math.cos(angle);
        asteroidPositions[i3 + 1] = tilt;
        asteroidPositions[i3 + 2] = radius * Math.sin(angle);
        
        asteroidScales[i] = Math.random() * 0.4 + 0.1;
        
        // Random rotation for varied appearance
        asteroidRotations[i3] = Math.random() * Math.PI * 2;
        asteroidRotations[i3 + 1] = Math.random() * Math.PI * 2;
        asteroidRotations[i3 + 2] = Math.random() * Math.PI * 2;
      }
      
      // Create a single asteroid geometry to be instanced
      const asteroidGeometry = new THREE.DodecahedronGeometry(0.4, 1);
      asteroidGeometry.deleteAttribute('uv');
      // Add some noise to the geometry vertices for a more irregular shape
      const posAttr = asteroidGeometry.getAttribute('position');
      const vertices = posAttr.array;
      for (let i = 0; i < vertices.length; i += 3) {
        vertices[i] += (Math.random() - 0.5) * 0.1;
        vertices[i+1] += (Math.random() - 0.5) * 0.1;
        vertices[i+2] += (Math.random() - 0.5) * 0.1;
      }
      
      // Create instanced mesh for performance
      const asteroidMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x888888, 
        roughness: 0.9,
        metalness: 0.1,
      });
      
      const instancedMesh = new THREE.InstancedMesh(
        asteroidGeometry, 
        asteroidMaterial, 
        asteroidCount
      );
      
      // Initialize each instance with position, rotation and scale
      const dummy = new THREE.Object3D();
      for (let i = 0; i < asteroidCount; i++) {
        const i3 = i * 3;
        
        dummy.position.set(
          asteroidPositions[i3],
          asteroidPositions[i3 + 1],
          asteroidPositions[i3 + 2]
        );
        
        dummy.rotation.set(
          asteroidRotations[i3],
          asteroidRotations[i3 + 1],
          asteroidRotations[i3 + 2]
        );
        
        dummy.scale.set(
          asteroidScales[i],
          asteroidScales[i],
          asteroidScales[i]
        );
        
        dummy.updateMatrix();
        instancedMesh.setMatrixAt(i, dummy.matrix);
      }
      
      instancedMesh.instanceMatrix.needsUpdate = true;
      scene.add(instancedMesh);
      
      return {
        mesh: instancedMesh,
        positions: asteroidPositions,
        rotations: asteroidRotations,
        scales: asteroidScales
      };
    };
    
    // Helper to create planet textures procedurally
    const createPlanetTexture = (type: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.Texture();
      
      switch (type) {
        case 'sun': {
          // Draw the sun with a fiery texture
          const gradient = ctx.createRadialGradient(512, 256, 0, 512, 256, 512);
          gradient.addColorStop(0, '#fff9d8');
          gradient.addColorStop(0.2, '#ffee80');
          gradient.addColorStop(0.4, '#ffaa33');
          gradient.addColorStop(0.6, '#ff8800');
          gradient.addColorStop(0.8, '#ff4400');
          gradient.addColorStop(1, '#ff2200');
          
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 1024, 512);
          
          // Add solar flares and spots
          for (let i = 0; i < 40; i++) {
            const size = Math.random() * 100 + 20;
            const x = Math.random() * 1024;
            const y = Math.random() * 512;
            const spotGradient = ctx.createRadialGradient(x, y, 0, x, y, size);
            
            if (Math.random() > 0.6) {
              // Dark spots
              spotGradient.addColorStop(0, 'rgba(120, 60, 0, 0.8)');
              spotGradient.addColorStop(0.5, 'rgba(160, 80, 0, 0.4)');
              spotGradient.addColorStop(1, 'rgba(255, 140, 0, 0)');
            } else {
              // Bright flares
              spotGradient.addColorStop(0, 'rgba(255, 255, 200, 0.8)');
              spotGradient.addColorStop(0.5, 'rgba(255, 230, 150, 0.4)');
              spotGradient.addColorStop(1, 'rgba(255, 200, 50, 0)');
            }
            
            ctx.fillStyle = spotGradient;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
          }
          break;
        }
        
        case 'earth': {
          // Start with ocean color
          ctx.fillStyle = '#1a4d77';
          ctx.fillRect(0, 0, 1024, 512);
          
          // Define continents outlines
          const continentsList = [
            { // North America
              points: [
                {x: 180, y: 120}, {x: 300, y: 100}, {x: 350, y: 200},
                {x: 250, y: 260}, {x: 170, y: 240}
              ],
              color: '#4a7c3c'
            },
            { // South America
              points: [
                {x: 280, y: 280}, {x: 320, y: 270}, {x: 350, y: 350},
                {x: 280, y: 400}, {x: 260, y: 330}
              ],
              color: '#5a8b44'
            },
            { // Europe
              points: [
                {x: 480, y: 140}, {x: 550, y: 120}, {x: 570, y: 190},
                {x: 520, y: 210}, {x: 490, y: 180}
              ],
              color: '#708b50'
            },
            { // Africa
              points: [
                {x: 500, y: 220}, {x: 580, y: 210}, {x: 600, y: 320},
                {x: 520, y: 360}, {x: 480, y: 290}
              ],
              color: '#bb9944'
            },
            { // Asia
              points: [
                {x: 600, y: 140}, {x: 750, y: 150}, {x: 800, y: 220},
                {x: 700, y: 280}, {x: 580, y: 220}
              ],
              color: '#a89458'
            },
            { // Australia
              points: [
                {x: 800, y: 340}, {x: 880, y: 320}, {x: 900, y: 380},
                {x: 850, y: 410}, {x: 800, y: 380}
              ],
              color: '#c4924a'
            },
            { // Antarctica
              points: [
                {x: 400, y: 450}, {x: 600, y: 460}, {x: 700, y: 450},
                {x: 500, y: 480}, {x: 400, y: 470}
              ],
              color: '#f2f2f2'
            }
          ];
          
          // Draw continents
          for (const continent of continentsList) {
            ctx.beginPath();
            ctx.moveTo(continent.points[0].x, continent.points[0].y);
            
            for (let i = 1; i < continent.points.length; i++) {
              ctx.lineTo(continent.points[i].x, continent.points[i].y);
            }
            
            ctx.closePath();
            ctx.fillStyle = continent.color;
            ctx.fill();
          }
          
          // Add noise for terrain detail
          for (let y = 0; y < 512; y += 2) {
            for (let x = 0; x < 1024; x += 2) {
              const data = ctx.getImageData(x, y, 1, 1).data;
              if (data[0] > 100) { // Only add noise to land
                const noise = (Math.random() - 0.5) * 20;
                ctx.fillStyle = `rgba(${data[0] + noise}, ${data[1] + noise}, ${data[2] + noise}, 1)`;
                ctx.fillRect(x, y, 2, 2);
              }
            }
          }
          
          // Add polar ice caps
          const northPoleGradient = ctx.createLinearGradient(0, 0, 0, 100);
          northPoleGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
          northPoleGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.fillStyle = northPoleGradient;
          ctx.fillRect(0, 0, 1024, 100);
          
          const southPoleGradient = ctx.createLinearGradient(0, 512, 0, 412);
          southPoleGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
          southPoleGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.fillStyle = southPoleGradient;
          ctx.fillRect(0, 412, 1024, 100);
          break;
        }
        
        case 'mars': {
          // Base rusty color
          ctx.fillStyle = '#bb5533';
          ctx.fillRect(0, 0, 1024, 512);
          
          // Add surface variations
          for (let y = 0; y < 512; y += 4) {
            for (let x = 0; x < 1024; x += 4) {
              const noise = Math.random() * 0.2 - 0.1;
              const r = 187 + noise * 40;
              const g = 85 + noise * 20;
              const b = 51 + noise * 10;
              
              ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
              ctx.fillRect(x, y, 4, 4);
            }
          }
          
          // Add crater features
          for (let i = 0; i < 30; i++) {
            const size = Math.random() * 40 + 5;
            const x = Math.random() * 1024;
            const y = Math.random() * 512;
            
            const craterGradient = ctx.createRadialGradient(x, y, 0, x, y, size);
            craterGradient.addColorStop(0, '#99442a');
            craterGradient.addColorStop(0.8, '#cc6644');
            craterGradient.addColorStop(1, '#bb5533');
            
            ctx.fillStyle = craterGradient;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
            
            // Add crater rim highlight
            const rimSize = size * 1.1;
            const rimGradient = ctx.createRadialGradient(x, y, size * 0.9, x, y, rimSize);
            rimGradient.addColorStop(0, 'rgba(220, 180, 130, 0.7)');
            rimGradient.addColorStop(1, 'rgba(220, 180, 130, 0)');
            
            ctx.fillStyle = rimGradient;
            ctx.beginPath();
            ctx.arc(x, y, rimSize, 0, Math.PI * 2);
            ctx.fill();
          }
          
          // Add polar ice caps
          const polarCapGradient = ctx.createRadialGradient(512, 50, 0, 512, 50, 200);
          polarCapGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
          polarCapGradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.5)');
          polarCapGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.fillStyle = polarCapGradient;
          ctx.fillRect(0, 0, 1024, 100);
          
          const southPolarGradient = ctx.createRadialGradient(512, 462, 0, 512, 462, 200);
          southPolarGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
          southPolarGradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.5)');
          southPolarGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.fillStyle = southPolarGradient;
          ctx.fillRect(0, 412, 1024, 100);
          break;
        }
        
        case 'jupiter': {
          // Base color
          const gradient = ctx.createLinearGradient(0, 0, 0, 512);
          gradient.addColorStop(0, '#d8ca9d');
          gradient.addColorStop(0.25, '#cfb678');
          gradient.addColorStop(0.4, '#bc9b64');
          gradient.addColorStop(0.6, '#a67c52');
          gradient.addColorStop(0.8, '#9b6c59');
          gradient.addColorStop(1, '#c68f77');
          
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 1024, 512);
          
          // Add cloudy bands
          for (let band = 0; band < 8; band++) {
            const y = band * 64 + 32;
            const height = 48 + Math.random() * 16;
            
            const bandColor = band % 2 === 0 ? 
              'rgba(150, 110, 80, 0.6)' : 
              'rgba(220, 200, 160, 0.6)';
            
            ctx.fillStyle = bandColor;
            ctx.fillRect(0, y, 1024, height);
            
            // Add swirls within each band
            for (let swirl = 0; swirl < 8; swirl++) {
              const swirlX = swirl * 128 + Math.random() * 64;
              const swirlY = y + height/2;
              const swirlSize = 30 + Math.random() * 20;
              
              const swirlGradient = ctx.createRadialGradient(
                swirlX, swirlY, 0, 
                swirlX, swirlY, swirlSize
              );
              
              if (band % 2 === 0) {
                swirlGradient.addColorStop(0, 'rgba(180, 140, 100, 0.7)');
                swirlGradient.addColorStop(1, 'rgba(150, 110, 80, 0)');
              } else {
                swirlGradient.addColorStop(0, 'rgba(240, 220, 180, 0.7)');
                swirlGradient.addColorStop(1, 'rgba(220, 200, 160, 0)');
              }
              
              ctx.fillStyle = swirlGradient;
              ctx.beginPath();
              ctx.ellipse(
                swirlX, swirlY, 
                swirlSize * 2, swirlSize, 
                0, 0, Math.PI * 2
              );
              ctx.fill();
            }
          }
          
          // Add the Great Red Spot
          const spotX = 700;
          const spotY = 220;
          const spotGradient = ctx.createRadialGradient(
            spotX, spotY, 0,
            spotX, spotY, 100
          );
          spotGradient.addColorStop(0, 'rgba(180, 60, 40, 0.8)');
          spotGradient.addColorStop(0.7, 'rgba(180, 90, 60, 0.5)');
          spotGradient.addColorStop(1, 'rgba(180, 120, 80, 0)');
          
          ctx.fillStyle = spotGradient;
          ctx.beginPath();
          ctx.ellipse(spotX, spotY, 120, 60, Math.PI/6, 0, Math.PI * 2);
          ctx.fill();
          break;
        }
        
        case 'saturn': {
          // Similar to Jupiter but with different colors
          const gradient = ctx.createLinearGradient(0, 0, 0, 512);
          gradient.addColorStop(0, '#e6dcb3');
          gradient.addColorStop(0.3, '#d6cc99');
          gradient.addColorStop(0.6, '#c6bc85');
          gradient.addColorStop(1, '#b6ac75');
          
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 1024, 512);
          
          // Add bands
          for (let band = 0; band < 10; band++) {
            const y = band * 50 + Math.random() * 10;
            const height = 30 + Math.random() * 20;
            
            const bandColor = band % 2 === 0 ? 
              'rgba(160, 140, 100, 0.4)' : 
              'rgba(200, 190, 150, 0.4)';
            
            ctx.fillStyle = bandColor;
            ctx.fillRect(0, y, 1024, height);
          }
          
          // Add subtler swirls and storms
          for (let i = 0; i < 15; i++) {
            const x = Math.random() * 1024;
            const y = Math.random() * 512;
            const size = 20 + Math.random() * 40;
            
            const stormGradient = ctx.createRadialGradient(
              x, y, 0, x, y, size
            );
            stormGradient.addColorStop(0, 'rgba(220, 210, 180, 0.6)');
            stormGradient.addColorStop(1, 'rgba(200, 190, 150, 0)');
            
            ctx.fillStyle = stormGradient;
            ctx.beginPath();
            ctx.ellipse(
              x, y, 
              size * 1.5, size * 0.7, 
              Math.random() * Math.PI, 
              0, Math.PI * 2
            );
            ctx.fill();
          }
          break;
        }
        
        case 'neptune': {
          // Rich blue gradient
          const gradient = ctx.createLinearGradient(0, 0, 0, 512);
          gradient.addColorStop(0, '#5a93bd');
          gradient.addColorStop(0.5, '#3a73ad');
          gradient.addColorStop(1, '#2a5393');
          
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 1024, 512);
          
          // Add cloud features
          for (let y = 0; y < 512; y += 4) {
            for (let x = 0; x < 1024; x += 4) {
              const noise = Math.random() * 0.2 - 0.1;
              const r = 58 + noise * 30;
              const g = 115 + noise * 30;
              const b = 173 + noise * 30;
              
              ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
              ctx.fillRect(x, y, 4, 4);
            }
          }
          
          // Add the Great Dark Spot
          const spotX = 400;
          const spotY = 200;
          const spotGradient = ctx.createRadialGradient(
            spotX, spotY, 0,
            spotX, spotY, 80
          );
          spotGradient.addColorStop(0, 'rgba(20, 40, 80, 0.8)');
          spotGradient.addColorStop(0.7, 'rgba(30, 60, 100, 0.5)');
          spotGradient.addColorStop(1, 'rgba(40, 80, 120, 0)');
          
          ctx.fillStyle = spotGradient;
          ctx.beginPath();
          ctx.ellipse(spotX, spotY, 100, 60, Math.PI/4, 0, Math.PI * 2);
          ctx.fill();
          
          // Add white cirrus clouds
          for (let i = 0; i < 20; i++) {
            const x = Math.random() * 1024;
            const y = Math.random() * 512;
            const size = 10 + Math.random() * 20;
            
            const cloudGradient = ctx.createRadialGradient(
              x, y, 0, x, y, size
            );
            cloudGradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
            cloudGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.fillStyle = cloudGradient;
            ctx.beginPath();
            ctx.ellipse(
              x, y, 
              size * 2, size * 0.6, 
              Math.random() * Math.PI, 
              0, Math.PI * 2
            );
            ctx.fill();
          }
          break;
        }
        
        default: {
          // Generic planet texture with noise pattern
          const colorHue = Math.random() * 360;
          const baseColor = `hsl(${colorHue}, 50%, 50%)`;
          ctx.fillStyle = baseColor;
          ctx.fillRect(0, 0, 1024, 512);
          
          for (let y = 0; y < 512; y += 4) {
            for (let x = 0; x < 1024; x += 4) {
              const noise = Math.random() * 0.2 - 0.1;
              const h = colorHue;
              const s = 50 + noise * 20;
              const l = 50 + noise * 20;
              
              ctx.fillStyle = `hsl(${h}, ${s}%, ${l}%)`;
              ctx.fillRect(x, y, 4, 4);
            }
          }
          
          // Add some random features
          for (let i = 0; i < 20; i++) {
            const x = Math.random() * 1024;
            const y = Math.random() * 512;
            const size = 20 + Math.random() * 60;
            
            const featureGradient = ctx.createRadialGradient(
              x, y, 0, x, y, size
            );
            
            if (Math.random() > 0.5) {
              // Darker feature
              featureGradient.addColorStop(0, `hsla(${colorHue}, 60%, 30%, 0.7)`);
              featureGradient.addColorStop(1, `hsla(${colorHue}, 50%, 50%, 0)`);
            } else {
              // Lighter feature
              featureGradient.addColorStop(0, `hsla(${colorHue}, 40%, 70%, 0.7)`);
              featureGradient.addColorStop(1, `hsla(${colorHue}, 50%, 50%, 0)`);
            }
            
            ctx.fillStyle = featureGradient;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };
    
    // Create a bump map for planet surfaces
    const createBumpMap = (type: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.Texture();
      
      ctx.fillStyle = '#808080'; // Neutral gray
      ctx.fillRect(0, 0, 1024, 512);
      
      if (type === 'earth') {
        // Create mountains and valleys
        for (let i = 0; i < 200; i++) {
          const x = Math.random() * 1024;
          const y = Math.random() * 512;
          const size = 10 + Math.random() * 40;
          
          const gradient = ctx.createRadialGradient(
            x, y, 0, x, y, size
          );
          
          if (Math.random() > 0.5) {
            // Mountains (white in bump map)
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
            gradient.addColorStop(1, 'rgba(128, 128, 128, 0)');
          } else {
            // Valleys (black in bump map)
            gradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
            gradient.addColorStop(1, 'rgba(128, 128, 128, 0)');
          }
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (type === 'mars') {
        // Create crater-heavy terrain
        for (let i = 0; i < 100; i++) {
          const x = Math.random() * 1024;
          const y = Math.random() * 512;
          const size = 5 + Math.random() * 30;
          
          // Crater bowl (depression)
          const craterGradient = ctx.createRadialGradient(
            x, y, 0, x, y, size
          );
          craterGradient.addColorStop(0, 'rgba(40, 40, 40, 0.8)');
          craterGradient.addColorStop(0.8, 'rgba(100, 100, 100, 0.4)');
          craterGradient.addColorStop(1, 'rgba(128, 128, 128, 0)');
          
          ctx.fillStyle = craterGradient;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
          
          // Crater rim (elevation)
          const rimSize = size * 1.1;
          const rimGradient = ctx.createRadialGradient(
            x, y, size * 0.9, x, y, rimSize
          );
          rimGradient.addColorStop(0, 'rgba(220, 220, 220, 0.8)');
          rimGradient.addColorStop(1, 'rgba(128, 128, 128, 0)');
          
          ctx.fillStyle = rimGradient;
          ctx.beginPath();
          ctx.arc(x, y, rimSize, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // Generic bumpy surface
        for (let i = 0; i < 500; i++) {
          const x = Math.random() * 1024;
          const y = Math.random() * 512;
          const size = 5 + Math.random() * 20;
          
          const value = Math.random() > 0.5 ? 200 : 50;
          
          const gradient = ctx.createRadialGradient(
            x, y, 0, x, y, size
          );
          gradient.addColorStop(0, `rgba(${value}, ${value}, ${value}, 0.7)`);
          gradient.addColorStop(1, 'rgba(128, 128, 128, 0)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };
    
    // Create clouds texture for Earth
    const createCloudsTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.Texture();
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0)';
      ctx.fillRect(0, 0, 1024, 512);
      
      // Create cloud formations
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 512;
        const size = 30 + Math.random() * 100;
        
        const gradient = ctx.createRadialGradient(
          x, y, 0, x, y, size
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(
          x, y, 
          size * (1 + Math.random() * 0.5), 
          size * (0.3 + Math.random() * 0.3),
          Math.random() * Math.PI, 
          0, Math.PI * 2
        );
        ctx.fill();
      }
      
      // Add some smaller cumulus clouds
      for (let i = 0; i < 200; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 512;
        const size = 5 + Math.random() * 15;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.random() * 0.4})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };
    
    // Create rings texture for Saturn
    const createRingsTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.Texture();
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0)';
      ctx.fillRect(0, 0, 1024, 256);
      
      // Draw concentric rings with varying opacity
      const ringBands = [
        { start: 0.65, end: 0.7, opacity: 0.3 },  // Inner hazy ring
        { start: 0.7, end: 0.75, opacity: 0.1 },  // Gap 
        { start: 0.75, end: 0.85, opacity: 0.8 }, // Dense B ring
        { start: 0.85, end: 0.9, opacity: 0.3 },  // Cassini Division
        { start: 0.9, end: 1.0, opacity: 0.6 }   // A ring
      ];
      
      ringBands.forEach(band => {
        const innerRadius = band.start * 512;
        const outerRadius = band.end * 512;
        
        const gradient = ctx.createRadialGradient(
          512, 128, innerRadius,
          512, 128, outerRadius
        );
        gradient.addColorStop(0, `rgba(220, 200, 150, ${band.opacity})`);
        gradient.addColorStop(1, `rgba(220, 200, 150, ${band.opacity})`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(512, 128, outerRadius, 0, Math.PI * 2);
        ctx.arc(512, 128, innerRadius, 0, Math.PI * 2, true);
        ctx.fill();
      });
      
      // Add some texture and graininess to the rings
      for (let radius = 0.65 * 512; radius < 512; radius += 1) {
        const angle = Math.random() * Math.PI * 2;
        const x = 512 + Math.cos(angle) * radius;
        const y = 128 + Math.sin(angle) * radius * 0.2; // Maintain elliptical shape
        
        // Calculate which band this point is in
        const normalizedRadius = radius / 512;
        const band = ringBands.find(b => normalizedRadius >= b.start && normalizedRadius <= b.end);
        
        if (band && Math.random() > 0.7) {
          const size = 0.5 + Math.random() * 1;
          const opacity = band.opacity * (0.5 + Math.random() * 0.5);
          
          ctx.fillStyle = `rgba(240, 220, 180, ${opacity})`;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };
    
    // Planets and solar system setup
    const createPlanet = (
      name: string, 
      radius: number, 
      textureType: string, 
      distance: number, 
      orbitSpeed: number, 
      rotationSpeed: number, 
      tilt: number = 0,
      rings?: boolean
    ) => {
      const planetGroup = new THREE.Group();
      planetGroup.name = name;
      
      // Create planet texture and material
      const texture = createPlanetTexture(textureType);
      const bumpMap = createBumpMap(textureType);
      
      const geometry = new THREE.SphereGeometry(radius, 64, 64);
      
      let material;
      if (textureType === 'sun') {
        material = new THREE.MeshBasicMaterial({ 
          map: texture,
          emissive: 0xffff80,
          emissiveMap: texture,
          emissiveIntensity: 1.5
        });
      } else {
        material = new THREE.MeshStandardMaterial({ 
          map: texture,
          bumpMap: bumpMap,
          bumpScale: 0.1,
          roughness: 0.8,
          metalness: 0.1
        });
      }
      
      const planet = new THREE.Mesh(geometry, material);
      planet.castShadow = true;
      planet.receiveShadow = true;
      planet.rotation.z = THREE.MathUtils.degToRad(tilt);
      
      // Add atmosphere for Earth
      if (textureType === 'earth') {
        // Add cloud layer
        const cloudsTexture = createCloudsTexture();
        const cloudsGeometry = new THREE.SphereGeometry(radius * 1.02, 64, 64);
        const cloudsMaterial = new THREE.MeshStandardMaterial({
          map: cloudsTexture,
          transparent: true,
          opacity: 0.6,
          alphaMap: cloudsTexture
        });
        
        const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
        planet.add(clouds);
        
        // Add subtle atmospheric glow
        const atmosphereGeometry = new THREE.SphereGeometry(radius * 1.15, 64, 64);
        const atmosphereMaterial = new THREE.MeshStandardMaterial({
          color: 0x88aaff,
          transparent: true,
          opacity: 0.15,
          side: THREE.BackSide
        });
        
        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        planet.add(atmosphere);
      }
      
      // Add rings for Saturn
      if (rings) {
        const ringsTexture = createRingsTexture();
        const ringsGeometry = new THREE.RingGeometry(radius * 1.4, radius * 2.5, 128);
        
        // Need to modify UVs to make the texture map correctly
        const pos = ringsGeometry.attributes.position;
        const v3 = new THREE.Vector3();
        const uv = new Float32Array(pos.count * 2);
        
        for (let i = 0; i < pos.count; i++) {
          v3.fromBufferAttribute(pos, i);
          
          const u = (v3.x / (radius * 2.5)) * 0.5 + 0.5;
          const v = (v3.y / (radius * 2.5 * 0.2)) * 0.5 + 0.5;
          
          uv[i * 2] = u;
          uv[i * 2 + 1] = v;
        }
        
        ringsGeometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
        
        const ringsMaterial = new THREE.MeshStandardMaterial({
          map: ringsTexture,
          side: THREE.DoubleSide,
          transparent: true,
          alphaMap: ringsTexture
        });
        
        const rings = new THREE.Mesh(ringsGeometry, ringsMaterial);
        rings.rotation.x = THREE.MathUtils.degToRad(80);
        planet.add(rings);
      }
      
      planetGroup.add(planet);
      
      // Position planet at starting point in orbit
      const startingAngle = Math.random() * Math.PI * 2;
      planetGroup.position.x = Math.cos(startingAngle) * distance;
      planetGroup.position.z = Math.sin(startingAngle) * distance;
      
      scene.add(planetGroup);
      
      return {
        group: planetGroup,
        mesh: planet,
        orbitSpeed,
        rotationSpeed,
        distance,
        angle: startingAngle
      };
    };
    
    // Create Earth's moon
    const createMoon = (parent, radius: number, distance: number, orbitSpeed: number) => {
      const moonGroup = new THREE.Group();
      
      // Create moon texture and material
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Base color
        ctx.fillStyle = '#aaa9ad';
        ctx.fillRect(0, 0, 512, 512);
        
        // Add craters
        for (let i = 0; i < 300; i++) {
          const size = Math.random() * 20 + 2;
          const x = Math.random() * 512;
          const y = Math.random() * 512;
          
          const gradient = ctx.createRadialGradient(
            x, y, 0, x, y, size
          );
          
          if (Math.random() > 0.5) {
            // Dark crater
            gradient.addColorStop(0, 'rgba(60, 60, 65, 0.8)');
            gradient.addColorStop(0.8, 'rgba(90, 90, 95, 0.4)');
          } else {
            // Light crater with bright rim
            gradient.addColorStop(0, 'rgba(130, 130, 135, 0.6)');
            gradient.addColorStop(0.7, 'rgba(170, 170, 175, 0.4)');
          }
          gradient.addColorStop(1, 'rgba(170, 169, 173, 0)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Add maria (dark areas)
        const mariaLocations = [
          {x: 150, y: 200, radius: 90},
          {x: 300, y: 150, radius: 70},
          {x: 250, y: 350, radius: 80},
        ];
        
        mariaLocations.forEach(maria => {
          const gradient = ctx.createRadialGradient(
            maria.x, maria.y, 0,
            maria.x, maria.y, maria.radius
          );
          gradient.addColorStop(0, 'rgba(60, 60, 70, 0.9)');
          gradient.addColorStop(0.8, 'rgba(90, 90, 100, 0.7)');
          gradient.addColorStop(1, 'rgba(170, 169, 173, 0)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(maria.x, maria.y, maria.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      
      // Create bump map
      const bumpCanvas = document.createElement('canvas');
      bumpCanvas.width = 512;
      bumpCanvas.height = 512;
      const bumpCtx = bumpCanvas.getContext('2d');
      
      if (bumpCtx) {
        bumpCtx.fillStyle = '#808080';
        bumpCtx.fillRect(0, 0, 512, 512);
        
        // Add crater bumps
        for (let i = 0; i < 300; i++) {
          const size = Math.random() * 20 + 2;
          const x = Math.random() * 512;
          const y = Math.random() * 512;
          
          const gradient = bumpCtx.createRadialGradient(
            x, y, 0, x, y, size
          );
          
          if (Math.random() > 0.3) {
            // Crater depression
            gradient.addColorStop(0, 'rgba(40, 40, 40, 0.8)');
            gradient.addColorStop(0.6, 'rgba(80, 80, 80, 0.5)');
            gradient.addColorStop(1, 'rgba(128, 128, 128, 0)');
          } else {
            // Crater with raised rim
            gradient.addColorStop(0, 'rgba(40, 40, 40, 0.8)');
            gradient.addColorStop(0.5, 'rgba(80, 80, 80, 0.5)');
            gradient.addColorStop(0.7, 'rgba(200, 200, 200, 0.5)');
            gradient.addColorStop(1, 'rgba(128, 128, 128, 0)');
          }
          
          bumpCtx.fillStyle = gradient;
          bumpCtx.beginPath();
          bumpCtx.arc(x, y, size, 0, Math.PI * 2);
          bumpCtx.fill();
        }
      }
      
      const bumpMap = new THREE.CanvasTexture(bumpCanvas);
      bumpMap.needsUpdate = true;
      
      const geometry = new THREE.SphereGeometry(radius, 32, 32);
      const material = new THREE.MeshStandardMaterial({ 
        map: texture,
        bumpMap: bumpMap,
        bumpScale: 0.1,
        roughness: 0.9,
        metalness: 0.0
      });
      
      const moon = new THREE.Mesh(geometry, material);
      moon.castShadow = true;
      moon.receiveShadow = true;
      
      moonGroup.add(moon);
      
      // Position moon
      moonGroup.position.x = distance;
      
      parent.group.add(moonGroup);
      
      return {
        group: moonGroup,
        mesh: moon,
        orbitSpeed,
        distance
      };
    };
    
    // Create solar system
    const sun = createPlanet('Sun', 4, 'sun', 0, 0, 0.005);
    
    // Add point light for the sun
    const sunLight = new THREE.PointLight(0xffffff, 2, 300);
    sun.group.add(sunLight);
    
    // Add planets with realistic parameters (distance not to scale to fit scene)
    const planets = [
      createPlanet('Mercury', 0.4, 'default', 8, 0.02, 0.004, 0),
      createPlanet('Venus', 0.9, 'default', 12, 0.015, 0.002, 177),
      createPlanet('Earth', 1.0, 'earth', 16, 0.01, 0.01, 23.5),
      createPlanet('Mars', 0.5, 'mars', 22, 0.008, 0.01, 25),
      createPlanet('Jupiter', 2.5, 'jupiter', 30, 0.005, 0.02, 3),
      createPlanet('Saturn', 2.0, 'saturn', 38, 0.004, 0.018, 26.7, true),
      createPlanet('Uranus', 1.3, 'default', 45, 0.003, 0.01, 82),
      createPlanet('Neptune', 1.2, 'neptune', 52, 0.002, 0.01, 28),
    ];
    
    // Add Earth's moon
    const earth = planets[2];
    const moon = createMoon(earth, 0.27, 2.5, 0.03);
    
    const asteroidBelt = createAsteroidBelt();
    createStarField();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation
    const clock = new THREE.Clock();
    
    const animate = () => {
      const delta = clock.getDelta();
      
      // Update controls
      controls.update();
      
      // Rotate planets and update orbits
      planets.forEach(planet => {
        // Update rotation
        planet.mesh.rotation.y += planet.rotationSpeed * delta;
        
        // Update orbit position
        planet.angle += planet.orbitSpeed * delta;
        planet.group.position.x = Math.cos(planet.angle) * planet.distance;
        planet.group.position.z = Math.sin(planet.angle) * planet.distance;
      });
      
      // Rotate sun
      sun.mesh.rotation.y += sun.rotationSpeed * delta;
      
      // Update moon orbit
      moon.group.rotation.y += moon.orbitSpeed * delta;
      
      // Animate asteroid belt
      if (asteroidBelt.mesh) {
        const dummy = new THREE.Object3D();
        for (let i = 0; i < asteroidBelt.positions.length / 3; i++) {
          const i3 = i * 3;
          
          // Get current position
          const x = asteroidBelt.positions[i3];
          const y = asteroidBelt.positions[i3 + 1];
          const z = asteroidBelt.positions[i3 + 2];
          
          // Calculate orbit angle
          const angle = Math.atan2(z, x) + 0.001 * (0.5 + Math.random() * 0.5);
          const radius = Math.sqrt(x * x + z * z);
          
          // Update position with slight variation
          asteroidBelt.positions[i3] = radius * Math.cos(angle);
          asteroidBelt.positions[i3 + 2] = radius * Math.sin(angle);
          
          // Update rotation
          asteroidBelt.rotations[i3] += 0.01 * Math.random();
          asteroidBelt.rotations[i3 + 1] += 0.01 * Math.random();
          asteroidBelt.rotations[i3 + 2] += 0.01 * Math.random();
          
          // Apply updates to instance
          dummy.position.set(
            asteroidBelt.positions[i3],
            asteroidBelt.positions[i3 + 1],
            asteroidBelt.positions[i3 + 2]
          );
          
          dummy.rotation.set(
            asteroidBelt.rotations[i3],
            asteroidBelt.rotations[i3 + 1],
            asteroidBelt.rotations[i3 + 2]
          );
          
          dummy.scale.set(
            asteroidBelt.scales[i],
            asteroidBelt.scales[i],
            asteroidBelt.scales[i]
          );
          
          dummy.updateMatrix();
          asteroidBelt.mesh.setMatrixAt(i, dummy.matrix);
        }
        
        asteroidBelt.mesh.instanceMatrix.needsUpdate = true;
      }
      
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      if (!containerRef.current) return;
      
      window.removeEventListener('resize', handleResize);
      
      // Dispose resources
      renderer.dispose();
      containerRef.current.removeChild(renderer.domElement);
      
      // Dispose geometries and materials
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else if (object.material) {
            object.material.dispose();
          }
        }
      });
    };
  }, []);
  
  return <div ref={containerRef} className="absolute inset-0" />;
};

export default AnimatedBackground;
