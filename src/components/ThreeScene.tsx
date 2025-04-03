
import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls, PerspectiveCamera, Text, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { StarField } from './solar-system/components/StarField';

const Sun = ({ position = [0, 0, 0], size = 0.8 }) => {
  const sunRef = useRef();
  const coronaRef = useRef();
  
  // Create realistic sun texture with solar flares and granulation
  const sunTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Base sun color
      const gradient = ctx.createRadialGradient(
        512, 512, 0,
        512, 512, 512
      );
      gradient.addColorStop(0, '#fff9e5');
      gradient.addColorStop(0.5, '#ffee99');
      gradient.addColorStop(0.8, '#ff7700');
      gradient.addColorStop(1, '#ff3300');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1024, 1024);
      
      // Add solar granulation texture
      ctx.globalAlpha = 0.15;
      for (let i = 0; i < 8000; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 1024;
        const radius = Math.random() * 4 + 1;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = Math.random() > 0.5 ? '#ffffcc' : '#ff5500';
        ctx.fill();
      }
      
      // Add solar flares
      ctx.globalAlpha = 0.7;
      for (let i = 0; i < 12; i++) {
        const flareSize = Math.random() * 150 + 50;
        const angle = Math.random() * Math.PI * 2;
        const distance = 512 - flareSize / 2;
        const x = 512 + Math.cos(angle) * distance;
        const y = 512 + Math.sin(angle) * distance;
        
        const flareGradient = ctx.createRadialGradient(
          x, y, 0,
          x, y, flareSize
        );
        flareGradient.addColorStop(0, 'rgba(255, 255, 200, 0.8)');
        flareGradient.addColorStop(0.5, 'rgba(255, 150, 50, 0.5)');
        flareGradient.addColorStop(1, 'rgba(255, 100, 50, 0)');
        
        ctx.beginPath();
        ctx.ellipse(x, y, flareSize, flareSize / 2, angle, 0, Math.PI * 2);
        ctx.fillStyle = flareGradient;
        ctx.fill();
      }
      
      // Add sunspots
      ctx.globalAlpha = 0.8;
      for (let i = 0; i < 8; i++) {
        const distance = Math.random() * 300 + 100;
        const angle = Math.random() * Math.PI * 2;
        const x = 512 + Math.cos(angle) * distance;
        const y = 512 + Math.sin(angle) * distance;
        const radius = Math.random() * 40 + 15;
        
        const spotGradient = ctx.createRadialGradient(
          x, y, 0,
          x, y, radius
        );
        spotGradient.addColorStop(0, 'rgba(20, 0, 0, 0.9)');
        spotGradient.addColorStop(0.5, 'rgba(50, 20, 0, 0.7)');
        spotGradient.addColorStop(1, 'rgba(100, 50, 0, 0.3)');
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = spotGradient;
        ctx.fill();
      }
    }
    
    return new THREE.CanvasTexture(canvas);
  }, []);
  
  useFrame((state) => {
    if (!sunRef.current || !coronaRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Slowly rotate the sun
    sunRef.current.rotation.y = time * 0.05;
    
    // Pulsate the corona
    const pulseFactor = (Math.sin(time * 0.5) * 0.05) + 1;
    coronaRef.current.scale.set(pulseFactor, pulseFactor, pulseFactor);
  });
  
  return (
    <group position={[position[0], position[1], position[2]]}>
      {/* Main sun sphere */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial 
          map={sunTexture}
          emissiveMap={sunTexture}
          emissiveIntensity={1.2}
          emissive={"#ffcc33"}
        />
      </mesh>
      
      {/* Inner corona */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[size * 1.3, 32, 32]} />
        <meshBasicMaterial 
          color={0xffdd44}
          transparent={true}
          opacity={0.2}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Outer corona */}
      <mesh>
        <sphereGeometry args={[size * 2.0, 32, 32]} />
        <meshBasicMaterial 
          color={0xffee77}
          transparent={true}
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Sun glow */}
      <mesh>
        <sphereGeometry args={[size * 2.5, 32, 32]} />
        <meshBasicMaterial 
          color={0xffffbb}
          transparent={true}
          opacity={0.05}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

const Earth = ({ position = [0, 0, 0], size = 0.25, orbitRadius = 3, orbitSpeed = 0.2 }) => {
  const earthRef = useRef();
  const cloudsRef = useRef();
  const groupRef = useRef();
  const atmosphereRef = useRef();
  
  // Create realistic earth textures
  const [earthTexture, earthBumpMap, earthSpecularMap, cloudsTexture] = useMemo(() => {
    // Earth surface texture
    const surface = document.createElement('canvas');
    surface.width = 1024;
    surface.height = 512;
    const surfaceCtx = surface.getContext('2d');
    
    // Earth bump map
    const bump = document.createElement('canvas');
    bump.width = 1024;
    bump.height = 512;
    const bumpCtx = bump.getContext('2d');
    
    // Earth specular map
    const specular = document.createElement('canvas');
    specular.width = 1024;
    specular.height = 512;
    const specularCtx = specular.getContext('2d');
    
    // Clouds texture
    const clouds = document.createElement('canvas');
    clouds.width = 1024;
    clouds.height = 512;
    const cloudsCtx = clouds.getContext('2d');
    
    if (surfaceCtx && bumpCtx && specularCtx && cloudsCtx) {
      // Draw oceans
      surfaceCtx.fillStyle = '#0077be';
      surfaceCtx.fillRect(0, 0, 1024, 512);
      
      bumpCtx.fillStyle = '#777777';
      bumpCtx.fillRect(0, 0, 1024, 512);
      
      specularCtx.fillStyle = '#333333';
      specularCtx.fillRect(0, 0, 1024, 512);
      
      // Draw continents (simplified shapes)
      const continents = [
        {x: 200, y: 100, width: 300, height: 200}, // North America
        {x: 550, y: 100, width: 200, height: 150}, // Europe
        {x: 650, y: 150, width: 150, height: 200}, // Asia
        {x: 530, y: 250, width: 100, height: 150}, // Africa
        {x: 250, y: 300, width: 150, height: 150}, // South America
        {x: 800, y: 350, width: 120, height: 80},  // Australia
      ];
      
      continents.forEach(c => {
        // Draw continent with jagged edges
        for (let i = 0; i < 800; i++) {
          const x = c.x + Math.random() * c.width;
          const y = c.y + Math.random() * c.height;
          const radius = Math.random() * 20 + 5;
          
          const gradient = surfaceCtx.createRadialGradient(x, y, 0, x, y, radius);
          gradient.addColorStop(0, '#338855');
          gradient.addColorStop(0.7, '#225533');
          gradient.addColorStop(1, '#0077be');
          
          surfaceCtx.beginPath();
          surfaceCtx.arc(x, y, radius, 0, Math.PI * 2);
          surfaceCtx.fillStyle = gradient;
          surfaceCtx.fill();
          
          // Bump map (height)
          bumpCtx.beginPath();
          bumpCtx.arc(x, y, radius, 0, Math.PI * 2);
          bumpCtx.fillStyle = '#ffffff';
          bumpCtx.fill();
          
          // No specular on land
          specularCtx.beginPath();
          specularCtx.arc(x, y, radius, 0, Math.PI * 2);
          specularCtx.fillStyle = '#000000';
          specularCtx.fill();
        }
      });
      
      // Add ice caps
      for (let i = 0; i < 800; i++) {
        const radius = Math.random() * 15 + 5;
        
        // North pole
        const nx = Math.random() * 1024;
        const ny = Math.random() * 100;
        
        // South pole
        const sx = Math.random() * 1024;
        const sy = 512 - Math.random() * 100;
        
        surfaceCtx.beginPath();
        surfaceCtx.arc(nx, ny, radius, 0, Math.PI * 2);
        surfaceCtx.fillStyle = '#ffffff';
        surfaceCtx.fill();
        
        surfaceCtx.beginPath();
        surfaceCtx.arc(sx, sy, radius, 0, Math.PI * 2);
        surfaceCtx.fillStyle = '#ffffff';
        surfaceCtx.fill();
        
        // Ice caps in bump map
        bumpCtx.beginPath();
        bumpCtx.arc(nx, ny, radius, 0, Math.PI * 2);
        bumpCtx.fillStyle = '#cccccc';
        bumpCtx.fill();
        
        bumpCtx.beginPath();
        bumpCtx.arc(sx, sy, radius, 0, Math.PI * 2);
        bumpCtx.fillStyle = '#cccccc';
        bumpCtx.fill();
      }
      
      // Generate cloud patterns
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 512;
        const radius = Math.random() * 60 + 20;
        
        const cloudGradient = cloudsCtx.createRadialGradient(
          x, y, 0,
          x, y, radius
        );
        cloudGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        cloudGradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.6)');
        cloudGradient.addColorStop(0.8, 'rgba(255, 255, 255, 0.2)');
        cloudGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        cloudsCtx.beginPath();
        cloudsCtx.arc(x, y, radius, 0, Math.PI * 2);
        cloudsCtx.fillStyle = cloudGradient;
        cloudsCtx.fill();
      }
    }
    
    return [
      new THREE.CanvasTexture(surface),
      new THREE.CanvasTexture(bump),
      new THREE.CanvasTexture(specular),
      new THREE.CanvasTexture(clouds)
    ];
  }, []);
  
  useFrame(({ clock }) => {
    if (!earthRef.current || !cloudsRef.current || !groupRef.current || !atmosphereRef.current) return;
    const t = clock.getElapsedTime();
    
    // Rotate earth and clouds
    earthRef.current.rotation.y += 0.002;
    cloudsRef.current.rotation.y += 0.0025; // Clouds move slightly faster
    
    // Orbit around the sun
    groupRef.current.rotation.y = t * orbitSpeed;
    
    // Subtle pulsing atmosphere
    const pulseFactor = Math.sin(t * 0.5) * 0.01 + 1;
    atmosphereRef.current.scale.set(pulseFactor, pulseFactor, pulseFactor);
  });
  
  return (
    <group ref={groupRef}>
      <group position={[orbitRadius, position[1], position[2]]}>
        {/* Earth surface */}
        <mesh ref={earthRef}>
          <sphereGeometry args={[size, 64, 32]} />
          <meshPhongMaterial 
            map={earthTexture}
            bumpMap={earthBumpMap}
            bumpScale={0.05}
            specularMap={earthSpecularMap}
            specular={new THREE.Color('grey')}
            shininess={10}
          />
        </mesh>
        
        {/* Clouds layer */}
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[size * 1.02, 64, 32]} />
          <meshPhongMaterial 
            map={cloudsTexture}
            transparent={true}
            opacity={0.8}
            depthWrite={false}
          />
        </mesh>
        
        {/* Atmosphere glow */}
        <mesh ref={atmosphereRef}>
          <sphereGeometry args={[size * 1.15, 64, 32]} />
          <meshBasicMaterial 
            color={new THREE.Color(0x4ca6ff)}
            transparent={true}
            opacity={0.2}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
    </group>
  );
};

const Mars = ({ position = [0, 0, 0], size = 0.18, orbitRadius = 4.5, orbitSpeed = 0.15 }) => {
  const marsRef = useRef();
  const groupRef = useRef();
  
  // Create realistic Mars texture
  const [marsTexture, marsBumpMap] = useMemo(() => {
    // Mars surface texture
    const surface = document.createElement('canvas');
    surface.width = 1024;
    surface.height = 512;
    const surfaceCtx = surface.getContext('2d');
    
    // Mars bump map
    const bump = document.createElement('canvas');
    bump.width = 1024;
    bump.height = 512;
    const bumpCtx = bump.getContext('2d');
    
    if (surfaceCtx && bumpCtx) {
      // Base rusty red color
      surfaceCtx.fillStyle = '#c1440e';
      surfaceCtx.fillRect(0, 0, 1024, 512);
      
      bumpCtx.fillStyle = '#777777';
      bumpCtx.fillRect(0, 0, 1024, 512);
      
      // Surface variations
      for (let i = 0; i < 20000; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 512;
        const radius = Math.random() * 8 + 1;
        
        const shade = Math.random() * 30 - 15;
        const r = Math.min(255, Math.max(0, 193 + shade));
        const g = Math.min(255, Math.max(0, 68 + shade));
        const b = Math.min(255, Math.max(0, 14 + shade));
        
        surfaceCtx.beginPath();
        surfaceCtx.arc(x, y, radius, 0, Math.PI * 2);
        surfaceCtx.fillStyle = `rgb(${r},${g},${b})`;
        surfaceCtx.fill();
        
        // Corresponding bump
        bumpCtx.beginPath();
        bumpCtx.arc(x, y, radius, 0, Math.PI * 2);
        bumpCtx.fillStyle = `rgb(${128 + shade},${128 + shade},${128 + shade})`;
        bumpCtx.fill();
      }
      
      // Add large features (Olympus Mons, Valles Marineris, etc.)
      const features = [
        {x: 512, y: 256, radius: 120, type: 'mountain'}, // Olympus Mons
        {x: 700, y: 256, width: 300, height: 40, type: 'canyon'}, // Valles Marineris
        {x: 300, y: 180, radius: 100, type: 'basin'}, // Hellas Planitia
        {x: 400, y: 300, radius: 80, type: 'basin'}, // Argyre Planitia
      ];
      
      features.forEach(feature => {
        if (feature.type === 'mountain') {
          const gradient = surfaceCtx.createRadialGradient(
            feature.x, feature.y, 0,
            feature.x, feature.y, feature.radius
          );
          gradient.addColorStop(0, '#d4683b');
          gradient.addColorStop(0.7, '#c1440e');
          gradient.addColorStop(1, '#992211');
          
          surfaceCtx.beginPath();
          surfaceCtx.arc(feature.x, feature.y, feature.radius, 0, Math.PI * 2);
          surfaceCtx.fillStyle = gradient;
          surfaceCtx.fill();
          
          // Bump for mountain
          const bumpGradient = bumpCtx.createRadialGradient(
            feature.x, feature.y, 0,
            feature.x, feature.y, feature.radius
          );
          bumpGradient.addColorStop(0, '#ffffff');
          bumpGradient.addColorStop(1, '#777777');
          
          bumpCtx.beginPath();
          bumpCtx.arc(feature.x, feature.y, feature.radius, 0, Math.PI * 2);
          bumpCtx.fillStyle = bumpGradient;
          bumpCtx.fill();
        } else if (feature.type === 'canyon') {
          surfaceCtx.fillStyle = '#992211';
          surfaceCtx.fillRect(feature.x, feature.y, feature.width, feature.height);
          
          // Bump for canyon
          bumpCtx.fillStyle = '#333333';
          bumpCtx.fillRect(feature.x, feature.y, feature.width, feature.height);
        } else if (feature.type === 'basin') {
          const gradient = surfaceCtx.createRadialGradient(
            feature.x, feature.y, 0,
            feature.x, feature.y, feature.radius
          );
          gradient.addColorStop(0, '#992211');
          gradient.addColorStop(0.7, '#c1440e');
          gradient.addColorStop(1, '#c1440e');
          
          surfaceCtx.beginPath();
          surfaceCtx.arc(feature.x, feature.y, feature.radius, 0, Math.PI * 2);
          surfaceCtx.fillStyle = gradient;
          surfaceCtx.fill();
          
          // Bump for basin
          const bumpGradient = bumpCtx.createRadialGradient(
            feature.x, feature.y, 0,
            feature.x, feature.y, feature.radius
          );
          bumpGradient.addColorStop(0, '#333333');
          bumpGradient.addColorStop(1, '#777777');
          
          bumpCtx.beginPath();
          bumpCtx.arc(feature.x, feature.y, feature.radius, 0, Math.PI * 2);
          bumpCtx.fillStyle = bumpGradient;
          bumpCtx.fill();
        }
      });
      
      // Add polar ice caps
      for (let i = 0; i < 500; i++) {
        const radius = Math.random() * 10 + 3;
        
        // North pole
        const nx = Math.random() * 1024;
        const ny = Math.random() * 80;
        
        // South pole
        const sx = Math.random() * 1024;
        const sy = 512 - Math.random() * 80;
        
        surfaceCtx.beginPath();
        surfaceCtx.arc(nx, ny, radius, 0, Math.PI * 2);
        surfaceCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        surfaceCtx.fill();
        
        surfaceCtx.beginPath();
        surfaceCtx.arc(sx, sy, radius, 0, Math.PI * 2);
        surfaceCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        surfaceCtx.fill();
      }
    }
    
    return [
      new THREE.CanvasTexture(surface),
      new THREE.CanvasTexture(bump)
    ];
  }, []);
  
  useFrame(({ clock }) => {
    if (!marsRef.current || !groupRef.current) return;
    const t = clock.getElapsedTime();
    
    // Rotate Mars
    marsRef.current.rotation.y += 0.003;
    
    // Orbit around the sun
    groupRef.current.rotation.y = t * orbitSpeed;
  });
  
  return (
    <group ref={groupRef}>
      <mesh 
        ref={marsRef} 
        position={[orbitRadius, position[1], position[2]]}
      >
        <sphereGeometry args={[size, 64, 32]} />
        <meshStandardMaterial 
          map={marsTexture}
          bumpMap={marsBumpMap}
          bumpScale={0.02}
          roughness={0.9} 
          metalness={0.1}
        />
      </mesh>
    </group>
  );
};

const Jupiter = ({ position = [0, 0, 0], size = 0.5, orbitRadius = 6.5, orbitSpeed = 0.08 }) => {
  const jupiterRef = useRef();
  const groupRef = useRef();
  
  // Create realistic Jupiter texture
  const jupiterTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Base color
      const gradient = ctx.createLinearGradient(0, 0, 0, 512);
      gradient.addColorStop(0, '#e0ae6f');
      gradient.addColorStop(0.3, '#d9a05b');
      gradient.addColorStop(0.5, '#c69c5d');
      gradient.addColorStop(0.7, '#d9a05b');
      gradient.addColorStop(1, '#e0ae6f');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1024, 512);
      
      // Add bands
      const bands = [
        {y: 100, height: 40, color: '#aa7039'},
        {y: 170, height: 30, color: '#d4b67e'},
        {y: 230, height: 50, color: '#aa7039'},
        {y: 310, height: 60, color: '#d4b67e'},
        {y: 390, height: 30, color: '#aa7039'}
      ];
      
      bands.forEach(band => {
        ctx.fillStyle = band.color;
        ctx.fillRect(0, band.y, 1024, band.height);
        
        // Add turbulence to bands
        ctx.globalAlpha = 0.4;
        for (let x = 0; x < 1024; x += 4) {
          const height = Math.sin(x * 0.05) * 10 + Math.random() * 5;
          const y1 = band.y + Math.random() * 5;
          const y2 = band.y + band.height - Math.random() * 5;
          
          ctx.fillStyle = x % 32 < 16 ? '#e6c186' : band.color;
          ctx.fillRect(x, y1, 4, height);
          
          ctx.fillStyle = x % 32 < 16 ? band.color : '#e6c186';
          ctx.fillRect(x, y2 - height, 4, height);
        }
        ctx.globalAlpha = 1;
      });
      
      // Add Great Red Spot
      const spotGradient = ctx.createRadialGradient(
        300, 230, 0,
        300, 230, 80
      );
      spotGradient.addColorStop(0, '#993333');
      spotGradient.addColorStop(0.7, '#cc4433');
      spotGradient.addColorStop(1, '#aa7039');
      
      ctx.beginPath();
      ctx.ellipse(300, 230, 80, 40, 0, 0, Math.PI * 2);
      ctx.fillStyle = spotGradient;
      ctx.fill();
      
      // Add detailed turbulence and storms
      for (let i = 0; i < 200; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 512;
        const width = Math.random() * 60 + 10;
        const height = Math.random() * 20 + 5;
        const angle = Math.random() * Math.PI * 0.25;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        
        const stormColor = Math.random() > 0.5 ? '#e6c186' : '#aa7039';
        ctx.fillStyle = stormColor;
        ctx.globalAlpha = 0.3;
        ctx.fillRect(-width/2, -height/2, width, height);
        
        ctx.restore();
      }
    }
    
    return new THREE.CanvasTexture(canvas);
  }, []);
  
  useFrame(({ clock }) => {
    if (!jupiterRef.current || !groupRef.current) return;
    const t = clock.getElapsedTime();
    
    // Jupiter rotates quite fast
    jupiterRef.current.rotation.y += 0.004;
    
    // Orbit around the sun
    groupRef.current.rotation.y = t * orbitSpeed;
  });
  
  return (
    <group ref={groupRef}>
      <mesh 
        ref={jupiterRef} 
        position={[orbitRadius, position[1], position[2]]}
      >
        <sphereGeometry args={[size, 64, 32]} />
        <meshStandardMaterial 
          map={jupiterTexture}
          roughness={0.7} 
          metalness={0.1}
        />
      </mesh>
    </group>
  );
};

const Saturn = ({ position = [0, 0, 0], size = 0.45, orbitRadius = 9, orbitSpeed = 0.06 }) => {
  const saturnRef = useRef();
  const ringsRef = useRef();
  const groupRef = useRef();
  
  // Create realistic Saturn and rings textures
  const [saturnTexture, ringsTexture] = useMemo(() => {
    // Saturn surface
    const surface = document.createElement('canvas');
    surface.width = 1024;
    surface.height = 512;
    const surfaceCtx = surface.getContext('2d');
    
    // Saturn rings
    const rings = document.createElement('canvas');
    rings.width = 1024;
    rings.height = 256;
    const ringsCtx = rings.getContext('2d');
    
    if (surfaceCtx && ringsCtx) {
      // Base Saturn color
      const gradient = surfaceCtx.createLinearGradient(0, 0, 0, 512);
      gradient.addColorStop(0, '#d2b487');
      gradient.addColorStop(0.3, '#c9ad7e');
      gradient.addColorStop(0.5, '#bfa476');
      gradient.addColorStop(0.7, '#c9ad7e');
      gradient.addColorStop(1, '#d2b487');
      
      surfaceCtx.fillStyle = gradient;
      surfaceCtx.fillRect(0, 0, 1024, 512);
      
      // Add bands similar to Jupiter but more subtle
      const bands = [
        {y: 110, height: 30, color: '#bfa476'},
        {y: 180, height: 20, color: '#d9c49d'},
        {y: 250, height: 40, color: '#bfa476'},
        {y: 320, height: 50, color: '#d9c49d'},
        {y: 400, height: 25, color: '#bfa476'}
      ];
      
      bands.forEach(band => {
        surfaceCtx.fillStyle = band.color;
        surfaceCtx.fillRect(0, band.y, 1024, band.height);
        
        // Add subtle details to bands
        surfaceCtx.globalAlpha = 0.3;
        for (let x = 0; x < 1024; x += 4) {
          const height = Math.sin(x * 0.03) * 8 + Math.random() * 4;
          const y1 = band.y + Math.random() * 4;
          const y2 = band.y + band.height - Math.random() * 4;
          
          surfaceCtx.fillStyle = x % 24 < 12 ? '#d9c49d' : band.color;
          surfaceCtx.fillRect(x, y1, 4, height);
          
          surfaceCtx.fillStyle = x % 24 < 12 ? band.color : '#d9c49d';
          surfaceCtx.fillRect(x, y2 - height, 4, height);
        }
        surfaceCtx.globalAlpha = 1;
      });
      
      // Add subtle storms
      for (let i = 0; i < 150; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 512;
        const width = Math.random() * 40 + 10;
        const height = Math.random() * 15 + 5;
        const angle = Math.random() * Math.PI * 0.2;
        
        surfaceCtx.save();
        surfaceCtx.translate(x, y);
        surfaceCtx.rotate(angle);
        
        const stormColor = Math.random() > 0.5 ? '#d9c49d' : '#bfa476';
        surfaceCtx.fillStyle = stormColor;
        surfaceCtx.globalAlpha = 0.25;
        surfaceCtx.fillRect(-width/2, -height/2, width, height);
        
        surfaceCtx.restore();
      }
      
      // Create detailed ring texture
      // First clear with transparency
      ringsCtx.clearRect(0, 0, 1024, 256);
      
      // Create ring bands with gaps
      const ringBands = [
        {start: 0, end: 20, opacity: 0.1},     // Innermost faint ring
        {start: 20, end: 30, opacity: 0},      // Gap
        {start: 30, end: 70, opacity: 0.4},    // B ring (brightest)
        {start: 70, end: 75, opacity: 0.1},    // Cassini Division (gap)
        {start: 75, end: 100, opacity: 0.3},   // A ring
        {start: 100, end: 105, opacity: 0.05}, // Encke Gap
        {start: 105, end: 128, opacity: 0.2}   // Outer A ring
      ];
      
      ringBands.forEach(band => {
        for (let r = band.start; r < band.end; r++) {
          for (let theta = 0; theta < 1024; theta += 1) {
            // Add some variation to each ring particle
            const noise = Math.random() * 0.2;
            const alpha = band.opacity * (1 - noise);
            
            // Color variation from cream to light brown
            const colorNoise = Math.random() * 20;
            const r = 210 - colorNoise;
            const g = 180 - colorNoise;
            const b = 135 - colorNoise;
            
            ringsCtx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            
            // Place each particle
            const y = r + 64; // Center on the canvas height
            ringsCtx.fillRect(theta, y, 1, 1);
          }
        }
      });
      
      // Add some radial structures in the rings
      for (let i = 0; i < 100; i++) {
        const startX = Math.random() * 1024;
        const width = Math.random() * 10 + 5;
        const startR = 20 + Math.random() * 100;
        const length = Math.random() * 30 + 10;
        
        ringsCtx.globalAlpha = 0.1;
        ringsCtx.fillStyle = Math.random() > 0.5 ? 'rgba(180, 160, 120, 0.3)' : 'rgba(100, 90, 70, 0.3)';
        
        for (let r = startR; r < startR + length; r++) {
          const y = r + 64;
          ringsCtx.fillRect(startX, y, width, 1);
        }
      }
      
      ringsCtx.globalAlpha = 1;
    }
    
    return [
      new THREE.CanvasTexture(surface),
      new THREE.CanvasTexture(rings)
    ];
  }, []);
  
  useFrame(({ clock }) => {
    if (!saturnRef.current || !ringsRef.current || !groupRef.current) return;
    const t = clock.getElapsedTime();
    
    // Saturn rotation
    saturnRef.current.rotation.y += 0.003;
    
    // Rings don't rotate with the planet
    // Just add a slight wobble to the rings
    ringsRef.current.rotation.x = Math.sin(t * 0.15) * 0.02 + 0.2;
    
    // Orbit around the sun
    groupRef.current.rotation.y = t * orbitSpeed;
  });
  
  return (
    <group ref={groupRef}>
      <group position={[orbitRadius, position[1], position[2]]}>
        {/* Saturn planet */}
        <mesh ref={saturnRef}>
          <sphereGeometry args={[size, 64, 32]} />
          <meshStandardMaterial 
            map={saturnTexture}
            roughness={0.7} 
            metalness={0.1}
          />
        </mesh>
        
        {/* Saturn rings */}
        <mesh ref={ringsRef} rotation={[0.2, 0, 0]}>
          <ringGeometry args={[size * 1.3, size * 2.5, 128]} />
          <meshStandardMaterial 
            map={ringsTexture}
            transparent={true}
            roughness={0.7}
            metalness={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
};

const OrbitLines = () => {
  const orbits = [
    { radius: 3, color: '#3366cc' },    // Earth
    { radius: 4.5, color: '#cc6633' },  // Mars
    { radius: 6.5, color: '#ccaa66' },  // Jupiter
    { radius: 9, color: '#ccbb88' }     // Saturn
  ];
  
  return (
    <group>
      {orbits.map((orbit, index) => (
        <mesh key={index} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[orbit.radius, orbit.radius + 0.02, 128]} />
          <meshBasicMaterial 
            color={orbit.color} 
            transparent={true} 
            opacity={0.2} 
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};

const CameraController = () => {
  const { camera, gl } = useThree();
  
  useEffect(() => {
    camera.position.set(0, 2, 11);
  }, [camera]);

  return <OrbitControls 
    enableZoom={true} 
    minDistance={5}
    maxDistance={20}
    enablePan={false} 
    enableRotate={true} 
    minPolarAngle={Math.PI / 3} 
    maxPolarAngle={Math.PI / 1.8} 
    target={new THREE.Vector3(0, 0, 0)} 
    args={[camera, gl.domElement]} 
    autoRotate 
    autoRotateSpeed={0.3} 
  />;
};

export const ThreeScene = () => {
  return (
    <div className="canvas-container">
      <Canvas dpr={[1, 2]}>
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000010', 10, 40]} />
        <ambientLight intensity={0.05} />
        <hemisphereLight args={['#0044aa', '#000000', 0.2]} />
        
        <PerspectiveCamera makeDefault position={[0, 2, 11]} fov={50} />
        <CameraController />
        
        <StarField count={7000} />
        
        <Sun position={[0, 0, 0]} size={1.2} />
        <Earth position={[0, 0.1, 0]} size={0.25} orbitRadius={3} orbitSpeed={0.2} />
        <Mars position={[0, 0, 0]} size={0.18} orbitRadius={4.5} orbitSpeed={0.15} />
        <Jupiter position={[0, 0, 0]} size={0.5} orbitRadius={6.5} orbitSpeed={0.08} />
        <Saturn position={[0, 0, 0]} size={0.45} orbitRadius={9} orbitSpeed={0.06} />
        
        <OrbitLines />
        
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <Text
            position={[0, 3.5, 0]}
            fontSize={0.5}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            maxWidth={10}
            textAlign="center"
          >
            SOLAR SYSTEM
          </Text>
        </Float>
      </Canvas>
    </div>
  );
};

export default ThreeScene;
