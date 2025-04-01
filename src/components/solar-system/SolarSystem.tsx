
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useStarField } from './hooks/useStarField';
import { useSceneSetup } from './hooks/useSceneSetup';
import { useCelestialBodies } from './hooks/useCelestialBodies';
import { useAnimation } from './hooks/useAnimation';

const SolarSystem = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    if (!containerRef.current || isInitialized) return;
    setIsInitialized(true);
    
    // Create scene, camera, renderer, and controls
    const { scene, camera, renderer, controls } = useSceneSetup(containerRef);
    
    // Create starfield background
    const starField = useStarField(scene);
    
    // Create all celestial bodies (sun, planets, moon, asteroid belt)
    const { 
      sun, 
      mercury, 
      venus, 
      earthOrbitGroup, 
      earth, 
      moonOrbitGroup, 
      moon, 
      mars, 
      jupiter, 
      saturn,
      uranus,
      neptune,
      asteroidBelt 
    } = useCelestialBodies(scene);
    
    // Setup animation loop and event handlers
    const cleanupFn = useAnimation({
      scene,
      camera,
      renderer,
      controls,
      sun,
      planets: [mercury, venus, mars, jupiter, saturn, uranus, neptune],
      earth,
      moonOrbitGroup,
      moon,
      earthOrbitGroup,
      asteroidBelt,
      containerRef
    });
    
    return cleanupFn;
  }, [isInitialized]);
  
  return <div ref={containerRef} className="absolute inset-0 bg-[#050520]" />;
};

export default SolarSystem;
