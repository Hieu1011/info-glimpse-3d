
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { MutableRefObject } from 'react';

export function useSceneSetup(containerRef: MutableRefObject<HTMLDivElement | null>) {
  // Create scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050520); // Dark blue background for better visibility
  
  // Create camera with better angle for viewing the solar system
  const camera = new THREE.PerspectiveCamera(
    45, // Slightly wider FOV for better view
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  // Position camera to see the inner solar system better
  camera.position.set(15, 12, 15);
  
  // Create renderer
  const renderer = new THREE.WebGLRenderer({ 
    alpha: true, 
    antialias: true 
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x050520, 1); // Match scene background
  renderer.shadowMap.enabled = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  
  if (containerRef.current) {
    containerRef.current.appendChild(renderer.domElement);
  }
  
  // Add orbit controls for better user interaction
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 7; // Don't allow zooming too close
  controls.maxDistance = 30; // Limit maximum zoom distance for better view
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.2; // Slower rotation to better observe the planets
  controls.target.set(0, 0, 0);
  
  // Add ambient light for base illumination
  const ambientLight = new THREE.AmbientLight(0x333333);
  scene.add(ambientLight);
  
  return { scene, camera, renderer, controls };
}
