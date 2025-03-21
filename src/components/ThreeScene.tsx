
import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls, PerspectiveCamera, Environment, Text, Float } from '@react-three/drei';
import * as THREE from 'three';

const Particles = ({ count = 500 }) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const [positions] = useState(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  });

  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.getElapsedTime() * 0.1;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = positions[i3];
      const y = positions[i3 + 1];
      const z = positions[i3 + 2];

      mesh.current.setMatrixAt(
        i,
        new THREE.Matrix4().setPosition(
          x + Math.sin(time + x) * 0.01,
          y + Math.cos(time + y) * 0.01,
          z + Math.sin(time + z) * 0.01
        )
      );
    }
    
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.02, 16, 16]} />
      <meshBasicMaterial color="#4f86f7" transparent opacity={0.6} />
    </instancedMesh>
  );
};

const FloatingText = ({ position, children, ...props }: { position: [number, number, number], children: React.ReactNode } & any) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.y = position[1] + Math.sin(t * 0.5) * 0.05;
  });

  return (
    <Text
      ref={ref}
      position={position}
      fontSize={0.5}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
      {...props}
    >
      {children}
    </Text>
  );
};

const CameraController = () => {
  const { camera, gl } = useThree();
  
  useEffect(() => {
    camera.position.set(0, 0, 5);
  }, [camera]);

  return <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} minPolarAngle={Math.PI / 2.5} maxPolarAngle={Math.PI / 1.5} target={[0, 0, 0]} args={[camera, gl.domElement]} />;
};

const MovingSphere = ({ position = [0, 0, 0], color = '#4f86f7', size = 0.2 }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.position.x = position[0] + Math.sin(t * 0.5) * 0.5;
    meshRef.current.position.y = position[1] + Math.cos(t * 0.5) * 0.3;
    meshRef.current.position.z = position[2] + Math.sin(t * 0.3) * 0.2;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.8} />
    </mesh>
  );
};

export const ThreeScene = () => {
  return (
    <div className="canvas-container">
      <Canvas dpr={[1, 2]}>
        <color attach="background" args={['#050816']} />
        <fog attach="fog" args={['#050816', 5, 15]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
        <CameraController />
        
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
          <MovingSphere position={[1, 0.5, 0]} color="#5e72eb" size={0.3} />
          <MovingSphere position={[-1.5, -0.5, 0.5]} color="#ff9190" size={0.25} />
          <MovingSphere position={[0, -1, -0.5]} color="#b1c5ff" size={0.2} />
        </Float>
        
        <Particles count={300} />
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default ThreeScene;
