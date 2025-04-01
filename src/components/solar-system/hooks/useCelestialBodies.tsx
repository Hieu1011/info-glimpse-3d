
import * as THREE from 'three';
import { useTextureCreators } from './useTextureCreators';
import { usePlanetCreator } from './usePlanetCreator';
import { useAsteroidBelt } from './useAsteroidBelt';

export function useCelestialBodies(scene: THREE.Scene) {
  // Get texture creators
  const { 
    createPlanetTexture, 
    createEarthTexture, 
    createMoonTexture 
  } = useTextureCreators();
  
  // Get the planet creator function
  const { createPlanet, createEarthWithMoon, createSun } = usePlanetCreator(scene);
  
  // Create the sun
  const sun = createSun();
  
  // Create textures for planets
  const mercuryTexture = createPlanetTexture('#ada8a5', true);
  const venusTexture = createPlanetTexture('#e89b55');
  const earthTexture = createEarthTexture();
  const moonTexture = createMoonTexture();
  const marsTexture = createPlanetTexture('#c1440e');
  const jupiterTexture = createPlanetTexture('#c99039');
  const saturnTexture = createPlanetTexture('#e3bb76');
  
  // Create the planets (size, texture, distance from sun, rotation speed, orbit speed, axial tilt, has rings)
  const mercury = createPlanet(0.4, mercuryTexture, 6, 0.1, 0.8, 0.1);
  const venus = createPlanet(0.9, venusTexture, 8.5, 0.05, 0.6, 177);
  const { earthOrbitGroup, earth, moonOrbitGroup, moon } = createEarthWithMoon(11, earthTexture, moonTexture);
  const mars = createPlanet(0.5, marsTexture, 14, 0.9, 0.4, 25);
  const jupiter = createPlanet(2.5, jupiterTexture, 20, 2.2, 0.2, 3.1);
  const saturn = createPlanet(2.2, saturnTexture, 26, 2.0, 0.15, 26.7, true);
  
  // Create asteroid belt between Mars and Jupiter
  const asteroidBelt = useAsteroidBelt(scene, 16, 18, 200);
  
  return { 
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
    asteroidBelt 
  };
}
