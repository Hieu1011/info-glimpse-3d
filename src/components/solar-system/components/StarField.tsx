
import React, { useRef, useMemo } from 'react';
import { Points } from '@react-three/drei';
import useStarField from '../hooks/useStarField';
import * as THREE from 'three';

const StarField = ({ count = 7000 }) => {
  const { starGeometries, pointsRef } = useStarField(count);
  const smallStarsRef = useRef();
  const mediumStarsRef = useRef();
  const largeStarsRef = useRef();
  
  // Create star texture programmatically instead of loading from file
  const starTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Clear canvas
      ctx.fillStyle = 'rgba(0,0,0,0)';
      ctx.fillRect(0, 0, 64, 64);
      
      // Create radial gradient for star
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.4, 'rgba(255,255,255,0.8)');
      gradient.addColorStop(0.8, 'rgba(255,255,255,0.2)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
      
      // Add a slight bloom effect
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.4;
      ctx.filter = 'blur(4px)';
      ctx.fillStyle = 'rgba(200,220,255,0.5)';
      ctx.beginPath();
      ctx.arc(32, 32, 16, 0, Math.PI * 2);
      ctx.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.encoding = THREE.sRGBEncoding;
    return texture;
  }, []);
  
  return (
    <group>
      <Points 
        ref={pointsRef}
        geometry={starGeometries.smallStarsGeometry}
        limit={starGeometries.smallStarsCount}
      >
        <pointsMaterial 
          size={0.15} 
          vertexColors 
          transparent 
          opacity={0.8}
          sizeAttenuation 
          map={starTexture}
          alphaTest={0.01}
          alphaMap={starTexture}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Points>
      
      <Points 
        ref={mediumStarsRef}
        geometry={starGeometries.mediumStarsGeometry}
        limit={starGeometries.mediumStarsCount}
      >
        <pointsMaterial 
          size={0.25} 
          vertexColors 
          transparent 
          opacity={0.9}
          sizeAttenuation 
          map={starTexture}
          alphaTest={0.01}
          alphaMap={starTexture}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Points>
      
      <Points 
        ref={largeStarsRef}
        geometry={starGeometries.largeStarsGeometry}
        limit={starGeometries.largeStarsCount}
      >
        <pointsMaterial 
          size={0.4} 
          vertexColors 
          transparent 
          opacity={1.0}
          sizeAttenuation 
          map={starTexture}
          alphaTest={0.01}
          alphaMap={starTexture}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

export default StarField;
