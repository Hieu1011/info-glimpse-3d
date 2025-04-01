
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { MutableRefObject } from 'react';

export function useSceneSetup(containerRef: MutableRefObject<HTMLDivElement | null>) {
  // Create scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  
  // Create camera with better angle
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  // Position camera to see the whole solar system but not too far
  camera.position.set(30, 15, 30);
  
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
  controls.minDistance = 10;
  controls.maxDistance = 60;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.1;
  controls.target.set(0, 0, 0);
  
  // Add ambient light for base illumination
  const ambientLight = new THREE.AmbientLight(0x333333);
  scene.add(ambientLight);
  
  return { scene, camera, renderer, controls };
}
