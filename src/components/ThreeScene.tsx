
import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import StarField from './solar-system/components/StarField';

const Sun = ({ position = [0, 0, 0], size = 0.8 }) => {
  const sunRef = useRef();
  const coronaRef = useRef();
  
  const sunTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
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
    
    sunRef.current.rotation.y = time * 0.05;
    
    const pulseFactor = (Math.sin(time * 0.5) * 0.05) + 1;
    coronaRef.current.scale.set(pulseFactor, pulseFactor, pulseFactor);
  });
  
  return (
    <group position={[position[0], position[1], position[2]]}>
      <mesh ref={sunRef}>
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial 
          map={sunTexture}
          emissiveMap={sunTexture}
          emissiveIntensity={1.2}
          emissive={"#ffcc33"}
        />
      </mesh>
      
      <mesh ref={coronaRef}>
        <sphereGeometry args={[size * 1.3, 32, 32]} />
        <meshBasicMaterial 
          color={0xffdd44}
          transparent={true}
          opacity={0.2}
          side={THREE.BackSide}
        />
      </mesh>
      
      <mesh>
        <sphereGeometry args={[size * 2.0, 32, 32]} />
        <meshBasicMaterial 
          color={0xffee77}
          transparent={true}
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
      
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
  
  const [earthTexture, earthBumpMap, earthSpecularMap, cloudsTexture] = useMemo(() => {
    const surface = document.createElement('canvas');
    surface.width = 1024;
    surface.height = 512;
    const surfaceCtx = surface.getContext('2d');
    
    const bump = document.createElement('canvas');
    bump.width = 1024;
    bump.height = 512;
    const bumpCtx = bump.getContext('2d');
    
    const specular = document.createElement('canvas');
    specular.width = 1024;
    specular.height = 512;
    const specularCtx = specular.getContext('2d');
    
    const clouds = document.createElement('canvas');
    clouds.width = 1024;
    clouds.height = 512;
    const cloudsCtx = clouds.getContext('2d');
    
    if (surfaceCtx && bumpCtx && specularCtx && cloudsCtx) {
      surfaceCtx.fillStyle = '#0077be';
      surfaceCtx.fillRect(0, 0, 1024, 512);
      
      bumpCtx.fillStyle = '#777777';
      bumpCtx.fillRect(0, 0, 1024, 512);
      
      specularCtx.fillStyle = '#333333';
      specularCtx.fillRect(0, 0, 1024, 512);
      
      const continents = [
        {x: 200, y: 100, width: 300, height: 200},
        {x: 550, y: 100, width: 200, height: 150},
        {x: 650, y: 150, width: 150, height: 200},
        {x: 530, y: 250, width: 100, height: 150},
        {x: 250, y: 300, width: 150, height: 150},
        {x: 800, y: 350, width: 120, height: 80},
      ];
      
      continents.forEach(c => {
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
          
          bumpCtx.beginPath();
          bumpCtx.arc(x, y, radius, 0, Math.PI * 2);
          bumpCtx.fillStyle = '#ffffff';
          bumpCtx.fill();
          
          specularCtx.beginPath();
          specularCtx.arc(x, y, radius, 0, Math.PI * 2);
          specularCtx.fillStyle = '#000000';
          specularCtx.fill();
        }
      });
      
      for (let i = 0; i < 800; i++) {
        const radius = Math.random() * 15 + 5;
        
        const nx = Math.random() * 1024;
        const ny = Math.random() * 100;
        
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
        
        bumpCtx.beginPath();
        bumpCtx.arc(nx, ny, radius, 0, Math.PI * 2);
        bumpCtx.fillStyle = '#cccccc';
        bumpCtx.fill();
        
        bumpCtx.beginPath();
        bumpCtx.arc(sx, sy, radius, 0, Math.PI * 2);
        bumpCtx.fillStyle = '#cccccc';
        bumpCtx.fill();
      }
      
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
    
    earthRef.current.rotation.y += 0.002;
    cloudsRef.current.rotation.y += 0.0025;
    
    groupRef.current.rotation.y = t * orbitSpeed;
    
    const pulseFactor = Math.sin(t * 0.5) * 0.01 + 1;
    atmosphereRef.current.scale.set(pulseFactor, pulseFactor, pulseFactor);
  });
  
  return (
    <group ref={groupRef}>
      <group position={[orbitRadius, position[1], position[2]]}>
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
        
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[size * 1.02, 64, 32]} />
          <meshPhongMaterial 
            map={cloudsTexture}
            transparent={true}
            opacity={0.8}
            depthWrite={false}
          />
        </mesh>
        
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
  
  const [marsTexture, marsBumpMap] = useMemo(() => {
    const surface = document.createElement('canvas');
    surface.width = 1024;
    surface.height = 512;
    const surfaceCtx = surface.getContext('2d');
    
    const bump = document.createElement('canvas');
    bump.width = 1024;
    bump.height = 512;
    const bumpCtx = bump.getContext('2d');
    
    if (surfaceCtx && bumpCtx) {
      surfaceCtx.fillStyle = '#c1440e';
      surfaceCtx.fillRect(0, 0, 1024, 512);
      
      bumpCtx.fillStyle = '#777777';
      bumpCtx.fillRect(0, 0, 1024, 512);
      
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
        
        bumpCtx.beginPath();
        bumpCtx.arc(x, y, radius, 0, Math.PI * 2);
        bumpCtx.fillStyle = `rgb(${128 + shade},${128 + shade},${128 + shade})`;
        bumpCtx.fill();
      }
      
      const features = [
        {x: 512, y: 256, radius: 120, type: 'mountain'},
        {x: 700, y: 256, width: 300, height: 40, type: 'canyon'},
        {x: 300, y: 180, radius: 100, type: 'basin'},
        {x: 400, y: 300, radius: 80, type: 'basin'},
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
      
      for (let i = 0; i < 500; i++) {
        const radius = Math.random() * 10 + 3;
        
        const nx = Math.random() * 1024;
        const ny = Math.random() * 80;
        
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
    
    marsRef.current.rotation.y += 0.003;
    
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
  
  const jupiterTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, 0, 512);
      gradient.addColorStop(0, '#e0ae6f');
      gradient.addColorStop(0.3, '#d9a05b');
      gradient.addColorStop(0.5, '#c69c5d');
      gradient.addColorStop(0.7, '#d9a05b');
      gradient.addColorStop(1, '#e0ae6f');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1024, 512);
      
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
    
    jupiterRef.current.rotation.y += 0.004;
    
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
  
  const [saturnTexture, ringsTexture] = useMemo(() => {
    const surface = document.createElement('canvas');
    surface.width = 1024;
    surface.height = 512;
    const surfaceCtx = surface.getContext('2d');
    
    const rings = document.createElement('canvas');
    rings.width = 1024;
    rings.height = 256;
    const ringsCtx = rings.getContext('2d');
    
    if (surfaceCtx && ringsCtx) {
      const gradient = surfaceCtx.createLinearGradient(0, 0, 0, 512);
      gradient.addColorStop(0, '#d2b487');
      gradient.addColorStop(0.3, '#c9ad7e');
      gradient.addColorStop(0.5, '#bfa476');
      gradient.addColorStop(0.7, '#c9ad7e');
      gradient.addColorStop(1, '#d2b487');
      
      surfaceCtx.fillStyle = gradient;
      surfaceCtx.fillRect(0, 0, 1024, 512);
      
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
      
      ringsCtx.clearRect(0, 0, 1024, 256);
      
      const ringBands = [
        {start: 0, end: 20, opacity: 0.1},
        {start: 20, end: 30, opacity: 0},
        {start: 30, end: 70, opacity: 0.4},
        {start: 70, end: 75, opacity: 0.1},
        {start: 75, end: 100, opacity: 0.3},
        {start: 100, end: 105, opacity: 0.05},
        {start: 105, end: 128, opacity: 0.2}
      ];
      
      ringBands.forEach(band => {
        for (let r = band.start; r < band.end; r++) {
          for (let theta = 0; theta < 1024; theta += 1) {
            const noise = Math.random() * 0.2;
            const alpha = band.opacity * (1 - noise);
            
            const r = 210 - Math.random() * 20;
            const g = 180 - Math.random() * 20;
            const b = 135 - Math.random() * 20;
            
            ringsCtx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            
            const y = r + 64;
            ringsCtx.fillRect(theta, y, 1, 1);
          }
        }
      });
      
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
    
    saturnRef.current.rotation.y += 0.003;
    
    ringsRef.current.rotation.x = Math.sin(t * 0.15) * 0.02 + 0.2;
    
    groupRef.current.rotation.y = t * orbitSpeed;
  });
  
  return (
    <group ref={groupRef}>
      <group position={[orbitRadius, position[1], position[2]]}>
        <mesh ref={saturnRef}>
          <sphereGeometry args={[size, 64, 32]} />
          <meshStandardMaterial 
            map={saturnTexture}
            roughness={0.7} 
            metalness={0.1}
          />
        </mesh>
        
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
    { radius: 3, color: '#3366cc' },
    { radius: 4.5, color: '#cc6633' },
    { radius: 6.5, color: '#ccaa66' },
    { radius: 9, color: '#ccbb88' }
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
    camera.position.set(0, 8, 18);
  }, [camera]);

  return <OrbitControls 
    enableZoom={true} 
    minDistance={1.5}
    maxDistance={40}
    enablePan={true} 
    enableRotate={true} 
    minPolarAngle={0} 
    maxPolarAngle={Math.PI} 
    target={new THREE.Vector3(0, 0, 0)} 
    args={[camera, gl.domElement]} 
    autoRotate={false}
    zoomSpeed={2.0}
    rotateSpeed={0.8}
    panSpeed={1.2}
  />;
};

export const ThreeScene = () => {
  return (
    <div className="canvas-container" style={{ width: '100%', height: '100%' }}>
      <Canvas dpr={[1, 2]}>
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000010', 10, 40]} />
        <ambientLight intensity={0.05} />
        <hemisphereLight args={['#0044aa', '#000000', 0.2]} />
        
        <PerspectiveCamera makeDefault position={[0, 8, 18]} fov={50} />
        <CameraController />
        
        <StarField count={7000} />
        
        <Sun position={[0, 0, 0]} size={1.2} />
        <Earth position={[0, 0.1, 0]} size={0.25} orbitRadius={3} orbitSpeed={0.2} />
        <Mars position={[0, 0, 0]} size={0.18} orbitRadius={4.5} orbitSpeed={0.15} />
        <Jupiter position={[0, 0, 0]} size={0.5} orbitRadius={6.5} orbitSpeed={0.08} />
        <Saturn position={[0, 0, 0]} size={0.45} orbitRadius={9} orbitSpeed={0.06} />
        
        <OrbitLines />
      </Canvas>
    </div>
  );
};

export default ThreeScene;
