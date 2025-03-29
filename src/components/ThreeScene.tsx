import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls, PerspectiveCamera, Text, Float } from '@react-three/drei';
import * as THREE from 'three';

const StarField = ({ count = 2000 }) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const [positions] = useState(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return positions;
  });
  
  const [scales] = useState(() => {
    const scales = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      scales[i] = Math.random() * 0.6 + 0.1;
    }
    return scales;
  });

  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.getElapsedTime() * 0.1;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = positions[i3];
      const y = positions[i3 + 1];
      const z = positions[i3 + 2];
      const scale = scales[i];

      const matrix = new THREE.Matrix4();
      matrix.compose(
        new THREE.Vector3(
          x + Math.sin(time + x * 0.2) * 0.02,
          y + Math.cos(time + y * 0.2) * 0.02,
          z + Math.sin(time + z * 0.2) * 0.02
        ),
        new THREE.Quaternion(),
        new THREE.Vector3(scale, scale, scale)
      );
      
      mesh.current.setMatrixAt(i, matrix);
    }
    
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
    </instancedMesh>
  );
};

const Sun = ({ position = [0, 0, 0], size = 0.8 }) => {
  const sunRef = useRef<THREE.Group>(null);
  const sunMeshRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const flareRef = useRef<THREE.Mesh>(null);
  
  const sunTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      const gradient = ctx.createRadialGradient(
        256, 256, 0,
        256, 256, 256
      );
      gradient.addColorStop(0, '#fff9e5');
      gradient.addColorStop(0.5, '#ffee99');
      gradient.addColorStop(0.8, '#ff7700');
      gradient.addColorStop(1, '#ff3300');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);
      
      ctx.globalAlpha = 0.1;
      for (let i = 0; i < 5000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const radius = Math.random() * 3 + 1;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = Math.random() > 0.5 ? '#ffffcc' : '#ff5500';
        ctx.fill();
      }
      
      ctx.globalAlpha = 0.7;
      for (let i = 0; i < 8; i++) {
        const distance = Math.random() * 180;
        const angle = Math.random() * Math.PI * 2;
        const x = 256 + Math.cos(angle) * distance;
        const y = 256 + Math.sin(angle) * distance;
        const radius = Math.random() * 15 + 5;
        
        const spotGradient = ctx.createRadialGradient(
          x, y, 0,
          x, y, radius
        );
        spotGradient.addColorStop(0, 'rgba(20, 0, 0, 0.8)');
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
    if (!sunRef.current || !sunMeshRef.current || !coronaRef.current || !flareRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    sunMeshRef.current.rotation.y = time * 0.1;
    
    const pulseFactor = (Math.sin(time * 0.5) * 0.05) + 1;
    coronaRef.current.scale.set(pulseFactor, pulseFactor, pulseFactor);
    
    const flareAngle = time * 0.3;
    flareRef.current.position.x = Math.cos(flareAngle) * size * 1.1;
    flareRef.current.position.y = Math.sin(flareAngle) * size * 1.1;
  });
  
  return (
    <group ref={sunRef} position={[position[0], position[1], position[2]]}>
      <mesh ref={sunMeshRef}>
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
        <sphereGeometry args={[size * 1.8, 32, 32]} />
        <meshBasicMaterial 
          color={0xffee77}
          transparent={true}
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
      
      <mesh ref={flareRef} position={[size * 1.1, 0, 0]}>
        <sphereGeometry args={[size * 0.15, 16, 16]} />
        <meshBasicMaterial 
          color={0xffffaa}
          transparent={true}
          opacity={0.7}
        />
      </mesh>
    </group>
  );
};

const Moon = ({ position = [0, 0, 0], size = 0.3, orbitRadius = 3.5, orbitSpeed = 0.2 }) => {
  const moonRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  const [moonTexture, moonBumpMap] = useMemo(() => {
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 1024;
    textureCanvas.height = 1024;
    const texCtx = textureCanvas.getContext('2d');
    
    const bumpCanvas = document.createElement('canvas');
    bumpCanvas.width = 1024;
    bumpCanvas.height = 1024;
    const bumpCtx = bumpCanvas.getContext('2d');
    
    if (texCtx && bumpCtx) {
      texCtx.fillStyle = '#aaa9ad';
      texCtx.fillRect(0, 0, 1024, 1024);
      
      bumpCtx.fillStyle = '#555555';
      bumpCtx.fillRect(0, 0, 1024, 1024);
      
      const mariaLocations = [
        {x: 300, y: 400, radius: 200},
        {x: 600, y: 300, radius: 180},
        {x: 400, y: 700, radius: 150},
        {x: 800, y: 600, radius: 100},
      ];
      
      mariaLocations.forEach(maria => {
        texCtx.fillStyle = '#3a3a45';
        texCtx.beginPath();
        texCtx.arc(maria.x, maria.y, maria.radius, 0, Math.PI * 2);
        texCtx.fill();
        
        bumpCtx.fillStyle = '#333333';
        bumpCtx.beginPath();
        bumpCtx.arc(maria.x, maria.y, maria.radius, 0, Math.PI * 2);
        bumpCtx.fill();
      });
      
      for (let i = 0; i < 300; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 1024;
        const radius = Math.random() * 30 + 5;
        
        const gradient = texCtx.createRadialGradient(
          x, y, 0,
          x, y, radius
        );
        gradient.addColorStop(0, '#808080');
        gradient.addColorStop(0.2, '#757575');
        gradient.addColorStop(0.7, '#656565');
        gradient.addColorStop(1, '#9a9a9a');
        
        texCtx.beginPath();
        texCtx.arc(x, y, radius, 0, Math.PI * 2);
        texCtx.fillStyle = gradient;
        texCtx.fill();
        
        const bumpGradient = bumpCtx.createRadialGradient(
          x, y, 0,
          x, y, radius
        );
        bumpGradient.addColorStop(0, '#111111');
        bumpGradient.addColorStop(0.2, '#333333');
        bumpGradient.addColorStop(0.7, '#777777');
        bumpGradient.addColorStop(1, '#555555');
        
        bumpCtx.beginPath();
        bumpCtx.arc(x, y, radius, 0, Math.PI * 2);
        bumpCtx.fillStyle = bumpGradient;
        bumpCtx.fill();
      }
      
      for (let i = 0; i < 5000; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 1024;
        const radius = Math.random() * 2 + 0.5;
        
        const brightness = Math.random() * 30 - 15;
        
        texCtx.beginPath();
        texCtx.arc(x, y, radius, 0, Math.PI * 2);
        texCtx.fillStyle = `rgb(${120 + brightness}, ${120 + brightness}, ${120 + brightness})`;
        texCtx.fill();
        
        bumpCtx.beginPath();
        bumpCtx.arc(x, y, radius, 0, Math.PI * 2);
        bumpCtx.fillStyle = Math.random() > 0.5 ? '#666666' : '#444444';
        bumpCtx.fill();
      }
    }
    
    return [
      new THREE.CanvasTexture(textureCanvas),
      new THREE.CanvasTexture(bumpCanvas)
    ];
  }, []);
  
  useFrame(({ clock }) => {
    if (!moonRef.current || !groupRef.current) return;
    const t = clock.getElapsedTime();
    
    moonRef.current.rotation.y += 0.003;
    
    groupRef.current.rotation.y = t * orbitSpeed;
  });
  
  return (
    <group ref={groupRef}>
      <mesh 
        ref={moonRef} 
        position={[orbitRadius, position[1], position[2]]}
      >
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial 
          map={moonTexture}
          bumpMap={moonBumpMap}
          bumpScale={0.02}
          roughness={0.9} 
          metalness={0.0}
        />
      </mesh>
    </group>
  );
};

const RockyPlanet = ({ position = [0, 0, 0], color = '#3366ff', size = 0.2, rotationSpeed = 0.5, orbitRadius = 2, orbitSpeed = 0.3 }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  const [planetTexture, planetBumpMap] = useMemo(() => {
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 512;
    textureCanvas.height = 512;
    const texCtx = textureCanvas.getContext('2d');
    
    const bumpCanvas = document.createElement('canvas');
    bumpCanvas.width = 512;
    bumpCanvas.height = 512;
    const bumpCtx = bumpCanvas.getContext('2d');
    
    if (texCtx && bumpCtx) {
      const baseColor = new THREE.Color(color);
      
      texCtx.fillStyle = color;
      texCtx.fillRect(0, 0, 512, 512);
      
      bumpCtx.fillStyle = '#555555';
      bumpCtx.fillRect(0, 0, 512, 512);
      
      for (let y = 0; y < 512; y += 4) {
        for (let x = 0; x < 512; x += 4) {
          const noise = Math.random() * 0.2 - 0.1;
          
          const r = Math.floor(baseColor.r * 255 * (1 + noise));
          const g = Math.floor(baseColor.g * 255 * (1 + noise));
          const b = Math.floor(baseColor.b * 255 * (1 + noise));
          
          texCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          texCtx.fillRect(x, y, 4, 4);
          
          bumpCtx.fillStyle = `rgb(${128 + noise * 100}, ${128 + noise * 100}, ${128 + noise * 100})`;
          bumpCtx.fillRect(x, y, 4, 4);
        }
      }
      
      for (let i = 0; i < 20; i++) {
        const centerX = Math.random() * 512;
        const centerY = Math.random() * 512;
        const radius = Math.random() * 70 + 30;
        
        const gradient = texCtx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, radius
        );
        
        const featureType = Math.random();
        if (featureType > 0.7) {
          gradient.addColorStop(0, `rgba(${baseColor.r * 150}, ${baseColor.g * 150}, ${baseColor.b * 180}, 0.7)`);
          gradient.addColorStop(1, `rgba(${baseColor.r * 255}, ${baseColor.g * 255}, ${baseColor.b * 255}, 0)`);
        } else {
          gradient.addColorStop(0, `rgba(${Math.min(255, baseColor.r * 300)}, ${Math.min(255, baseColor.g * 300)}, ${Math.min(255, baseColor.b * 300)}, 0.7)`);
          gradient.addColorStop(1, `rgba(${baseColor.r * 255}, ${baseColor.g * 255}, ${baseColor.b * 255}, 0)`);
        }
        
        texCtx.beginPath();
        texCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        texCtx.fillStyle = gradient;
        texCtx.fill();
        
        const bumpGradient = bumpCtx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, radius
        );
        
        if (featureType > 0.7) {
          bumpGradient.addColorStop(0, 'rgba(30, 30, 30, 0.8)');
          bumpGradient.addColorStop(0.7, 'rgba(100, 100, 100, 0.5)');
          bumpGradient.addColorStop(1, 'rgba(128, 128, 128, 0)');
        } else {
          bumpGradient.addColorStop(0, 'rgba(200, 200, 200, 0.8)');
          bumpGradient.addColorStop(0.7, 'rgba(150, 150, 150, 0.5)');
          bumpGradient.addColorStop(1, 'rgba(128, 128, 128, 0)');
        }
        
        bumpCtx.beginPath();
        bumpCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        bumpCtx.fillStyle = bumpGradient;
        bumpCtx.fill();
      }
    }
    
    return [
      new THREE.CanvasTexture(textureCanvas),
      new THREE.CanvasTexture(bumpCanvas)
    ];
  }, [color]);
  
  useFrame(({ clock }) => {
    if (!meshRef.current || !groupRef.current) return;
    const t = clock.getElapsedTime();
    
    meshRef.current.rotation.y += rotationSpeed * 0.01;
    
    groupRef.current.rotation.y = t * orbitSpeed;
  });
  
  return (
    <group ref={groupRef}>
      <mesh 
        ref={meshRef} 
        position={[orbitRadius, position[1], position[2]]}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial 
          map={planetTexture}
          bumpMap={planetBumpMap}
          bumpScale={0.005}
          roughness={0.8} 
          metalness={0.2}
        />
      </mesh>
    </group>
  );
};

const Galaxy = ({ position = [0, 0, 0], count = 200, radius = 5, thickness = 0.5, spin = 0.8 }) => {
  const points = useRef<THREE.Points>(null);
  const [positions] = useState(() => {
    const pos = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.sqrt(Math.random()) * radius;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;
      const y = (Math.random() - 0.5) * thickness;
      
      const spinAngle = spin * dist;
      const finalX = x * Math.cos(spinAngle) - z * Math.sin(spinAngle);
      const finalZ = x * Math.sin(spinAngle) + z * Math.cos(spinAngle);
      
      pos[i * 3] = finalX + position[0];
      pos[i * 3 + 1] = y + position[1];
      pos[i * 3 + 2] = finalZ + position[2];
      
      const distRatio = dist / radius;
      colors[i * 3] = 0.3 + distRatio * 0.7;
      colors[i * 3 + 1] = 0.3 + distRatio * 0.5;
      colors[i * 3 + 2] = 0.8 - distRatio * 0.3;
    }
    
    return { positions: pos, colors };
  });
  
  useFrame(({ clock }) => {
    if (!points.current) return;
    const t = clock.getElapsedTime() * 0.05;
    points.current.rotation.y = t;
  });
  
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={count} 
          array={positions.positions} 
          itemSize={3} 
        />
        <bufferAttribute 
          attach="attributes-color" 
          count={count} 
          array={positions.colors} 
          itemSize={3} 
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.08} 
        vertexColors 
        transparent 
        opacity={0.8}
        sizeAttenuation 
      />
    </points>
  );
};

const CameraController = () => {
  const { camera, gl } = useThree();
  
  useEffect(() => {
    camera.position.set(0, 0, 5);
  }, [camera]);

  return <OrbitControls 
    enableZoom={false} 
    enablePan={false} 
    enableRotate={true} 
    minPolarAngle={Math.PI / 2.5} 
    maxPolarAngle={Math.PI / 1.5} 
    target={new THREE.Vector3(0, 0, 0)} 
    args={[camera, gl.domElement]} 
    autoRotate 
    autoRotateSpeed={0.5} 
  />;
};

export const ThreeScene = () => {
  return (
    <div className="canvas-container">
      <Canvas dpr={[1, 2]}>
        <color attach="background" args={['#030714']} />
        <fog attach="fog" args={['#030714', 5, 20]} />
        <ambientLight intensity={0.2} />
        <hemisphereLight args={['#4040ff', '#000000', 0.5]} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} castShadow />
        
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
        <CameraController />
        
        <StarField count={3000} />
        
        <Sun position={[0, 0, 0]} size={0.8} />
        <RockyPlanet color="#3366ff" size={0.2} position={[0, 0, 0]} rotationSpeed={0.5} orbitRadius={2} orbitSpeed={0.3} />
        <Moon position={[0, 0, 0]} size={0.3} orbitRadius={3.5} orbitSpeed={0.2} />
        
        <Galaxy position={[-10, 3, -15]} radius={3} count={500} thickness={0.3} spin={1.2} />
        <Galaxy position={[15, -4, -12]} radius={4} count={600} thickness={0.5} spin={0.9} />
        
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <Text
            position={[0, 2.5, 0]}
            fontSize={0.5}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            maxWidth={10}
            textAlign="center"
          >
            REACT NATIVE UNIVERSE
          </Text>
        </Float>
      </Canvas>
    </div>
  );
};

export default ThreeScene;
