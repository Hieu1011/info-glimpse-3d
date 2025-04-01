
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { MutableRefObject } from 'react';

export function useSceneSetup(containerRef: MutableRefObject<HTMLDivElement | null>) {
  // Create scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  
  // Create camera with better angle for viewing the solar system
  const camera = new THREE.PerspectiveCamera(
    50, // Narrower FOV for better depth perception
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  // Position camera to see the inner solar system, not too far away
  camera.position.set(20, 10, 20);
  
  // Create renderer
  const renderer = new THREE.WebGLRenderer({ 
    alpha: true, 
    antialias: true 
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 1);
  renderer.shadowMap.enabled = true;
  if (containerRef.current) {
    containerRef.current.appendChild(renderer.domElement);
  }
  
  // Add orbit controls for better user interaction
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 8; // Don't allow zooming too close
  controls.maxDistance = 40; // Don't allow zooming too far
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.15; // Slightly faster rotation for better view
  controls.target.set(0, 0, 0);
  
  // Add ambient light for base illumination
  const ambientLight = new THREE.AmbientLight(0x333333);
  scene.add(ambientLight);
  
  return { scene, camera, renderer, controls };
}
