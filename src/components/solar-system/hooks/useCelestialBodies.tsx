
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
  
  // Create textures for planets - scientific accurate colors
  const mercuryTexture = createPlanetTexture('#ada8a5', true); // Grayish
  const venusTexture = createPlanetTexture('#e89b55'); // Yellow-orange
  const earthTexture = createEarthTexture();
  const moonTexture = createMoonTexture();
  const marsTexture = createPlanetTexture('#c1440e'); // Reddish
  const jupiterTexture = createPlanetTexture('#c99039'); // Orange-tan with bands
  const saturnTexture = createPlanetTexture('#e3bb76'); // Pale yellow
  const uranusTexture = createPlanetTexture('#b1e3e3'); // Pale cyan
  const neptuneTexture = createPlanetTexture('#3f54ba'); // Deep blue
  
  // Create the planets with accurate relative sizes and distances 
  // (using scaled values for better visualization)
  // Real values are too extreme to visualize well
  // Mercury (size, texture, distance from sun, rotation speed, orbit speed, axial tilt)
  const mercury = createPlanet(0.38, mercuryTexture, 5.8, 0.01, 0.47, 0.03);
  // Venus
  const venus = createPlanet(0.95, venusTexture, 7.2, 0.004, 0.35, 177);
  // Earth with Moon
  const { earthOrbitGroup, earth, moonOrbitGroup, moon } = createEarthWithMoon(10, earthTexture, moonTexture);
  // Mars
  const mars = createPlanet(0.53, marsTexture, 13, 0.9, 0.24, 25);
  // Jupiter
  const jupiter = createPlanet(2.5, jupiterTexture, 18, 2.0, 0.13, 3.1);
  // Saturn with rings
  const saturn = createPlanet(2.2, saturnTexture, 25, 1.7, 0.09, 26.7, true);
  // Uranus
  const uranus = createPlanet(1.8, uranusTexture, 32, 1.4, 0.07, 97.8, false);
  // Neptune
  const neptune = createPlanet(1.8, neptuneTexture, 39, 1.5, 0.05, 28.3);
  
  // Create asteroid belt between Mars and Jupiter
  const asteroidBelt = useAsteroidBelt(scene, 15, 17, 200);
  
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
    uranus,
    neptune,
    asteroidBelt 
  };
}
