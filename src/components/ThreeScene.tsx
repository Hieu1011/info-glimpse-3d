
import { useRef, useState, useEffect } from 'react';
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

const Planet = ({ position = [0, 0, 0], color = '#4f86f7', size = 0.5, rotationSpeed = 0.2, orbitRadius = 0, orbitSpeed = 0.2 }: { position?: [number, number, number], color?: string, size?: number, rotationSpeed?: number, orbitRadius?: number, orbitSpeed?: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current || !groupRef.current) return;
    const t = clock.getElapsedTime();
    
    // Self rotation
    meshRef.current.rotation.y += rotationSpeed * 0.01;
    
    // Orbit around center point
    if (orbitRadius > 0) {
      groupRef.current.rotation.y = t * orbitSpeed;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh 
        ref={meshRef} 
        position={[orbitRadius, position[1], position[2]]}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.4} 
          metalness={0.3} 
          emissive={color}
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  );
};

const Galaxy = ({ position = [0, 0, 0], count = 200, radius = 5, thickness = 0.5, spin = 0.8 }: { position?: [number, number, number], count?: number, radius?: number, thickness?: number, spin?: number }) => {
  const points = useRef<THREE.Points>(null);
  const [positions] = useState(() => {
    const pos = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Position in galaxy
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.sqrt(Math.random()) * radius;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;
      const y = (Math.random() - 0.5) * thickness;
      
      // Apply spiral with spin factor
      const spinAngle = spin * dist;
      const finalX = x * Math.cos(spinAngle) - z * Math.sin(spinAngle);
      const finalZ = x * Math.sin(spinAngle) + z * Math.cos(spinAngle);
      
      pos[i * 3] = finalX + position[0];
      pos[i * 3 + 1] = y + position[1];
      pos[i * 3 + 2] = finalZ + position[2];
      
      // Colors - from blue-purple in center to yellow-white at edges
      const distRatio = dist / radius;
      colors[i * 3] = 0.3 + distRatio * 0.7; // R
      colors[i * 3 + 1] = 0.3 + distRatio * 0.5; // G
      colors[i * 3 + 2] = 0.8 - distRatio * 0.3; // B
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
    target={[0, 0, 0] as unknown as THREE.Vector3} 
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
        
        {/* Solar system */}
        <Planet color="#ffcc33" size={0.8} position={[0, 0, 0]} rotationSpeed={0.1} />
        <Planet color="#3366ff" size={0.2} position={[0, 0, 0]} rotationSpeed={0.5} orbitRadius={2} orbitSpeed={0.3} />
        <Planet color="#ff5566" size={0.3} position={[0, 0, 0]} rotationSpeed={0.3} orbitRadius={3.5} orbitSpeed={0.2} />
        
        {/* Distant galaxy */}
        <Galaxy position={[-10, 3, -15]} radius={3} count={500} thickness={0.3} spin={1.2} />
        <Galaxy position={[15, -4, -12]} radius={4} count={600} thickness={0.5} spin={0.9} />
        
        {/* Floating text in space */}
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
