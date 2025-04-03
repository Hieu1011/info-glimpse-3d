
import React, { useRef } from 'react';
import { Points, useTexture } from '@react-three/drei';
import useStarField from '../hooks/useStarField';
import * as THREE from 'three';

const StarField = ({ count = 7000 }) => {
  const { starGeometries, pointsRef } = useStarField(count);
  const smallStarsRef = useRef();
  const mediumStarsRef = useRef();
  const largeStarsRef = useRef();
  
  // Load star texture for more realistic point sprites
  const starTexture = useTexture('/star-texture.png');
  starTexture.encoding = THREE.sRGBEncoding;
  
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
