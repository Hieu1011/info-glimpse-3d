
import React from 'react';
import { Points } from '@react-three/drei';
import useStarField from '../hooks/useStarField';

const StarField = ({ count = 5000 }) => {
  const { starGeometries, pointsRef } = useStarField(count);
  
  return (
    <group>
      <Points 
        ref={pointsRef}
        geometry={starGeometries.smallStarsGeometry}
        limit={starGeometries.smallStarsCount}
      >
        <pointsMaterial 
          size={0.10} 
          vertexColors 
          transparent 
          opacity={0.8}
          sizeAttenuation 
        />
      </Points>
      
      <Points 
        geometry={starGeometries.mediumStarsGeometry}
        limit={starGeometries.mediumStarsCount}
      >
        <pointsMaterial 
          size={0.15} 
          vertexColors 
          transparent 
          opacity={0.8}
          sizeAttenuation 
        />
      </Points>
      
      <Points 
        geometry={starGeometries.largeStarsGeometry}
        limit={starGeometries.largeStarsCount}
      >
        <pointsMaterial 
          size={0.25} 
          vertexColors 
          transparent 
          opacity={0.9}
          sizeAttenuation 
        />
      </Points>
    </group>
  );
};

export default StarField;
