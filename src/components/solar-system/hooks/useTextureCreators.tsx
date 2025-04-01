
import * as THREE from 'three';

export function useTextureCreators() {
  // Function to create planet textures with realistic details
  const createPlanetTexture = (color: string, details: boolean = true): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    const size = 512;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Base color
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, size, size);
      
      if (details) {
        // Add detail patterns
        for (let i = 0; i < 2000; i++) {
          const x = Math.random() * size;
          const y = Math.random() * size;
          const radius = Math.random() * 3 + 1;
          const alpha = Math.random() * 0.2 + 0.1;
          
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.fill();
        }
        
        // Add larger features for more realistic terrain
        for (let i = 0; i < 20; i++) {
          const x = Math.random() * size;
          const y = Math.random() * size;
          const radius = Math.random() * 30 + 5;
          
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 0, 0, 0.15)`;
          ctx.fill();
        }
      }
    }
    
    return new THREE.CanvasTexture(canvas);
  };
  
  // Create Earth texture with continents
  const createEarthTexture = (): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    const size = 1024;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Base ocean color
      ctx.fillStyle = '#2233aa';
      ctx.fillRect(0, 0, size, size);
      
      // Simplified continent shapes (rough approximations)
      const continentsList = [
        // North America
        { points: [[200, 200], [350, 180], [380, 300], [320, 410], [200, 350]], color: '#3d8e33' },
        // South America
        { points: [[320, 410], [380, 490], [330, 600], [270, 550], [280, 450]], color: '#3d8e33' },
        // Europe
        { points: [[500, 200], [600, 180], [620, 280], [520, 330], [480, 260]], color: '#4a7942' },
        // Africa
        { points: [[500, 330], [620, 330], [650, 500], [520, 550], [460, 450]], color: '#c2a678' },
        // Asia
        { points: [[620, 180], [850, 200], [880, 330], [750, 450], [620, 330]], color: '#7d9f35' },
        // Australia
        { points: [[800, 500], [900, 480], [920, 550], [850, 600], [780, 560]], color: '#b97d49' },
        // Antarctica
        { points: [[350, 700], [550, 750], [750, 700], [600, 650], [400, 650]], color: '#e8e8e8' },
      ];
      
      // Draw continents
      continentsList.forEach(continent => {
        ctx.fillStyle = continent.color;
        ctx.beginPath();
        ctx.moveTo(continent.points[0][0], continent.points[0][1]);
        
        for (let i = 1; i < continent.points.length; i++) {
          ctx.lineTo(continent.points[i][0], continent.points[i][1]);
        }
        
        ctx.closePath();
        ctx.fill();
        
        // Add some terrain variation
        ctx.globalAlpha = 0.2;
        for (let i = 0; i < 500; i++) {
          const x = Math.random() * size;
          const y = Math.random() * size;
          const radius = Math.random() * 4 + 1;
          
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#333333';
          ctx.fill();
        }
        ctx.globalAlpha = 1.0;
      });
      
      // Add cloud patterns
      ctx.globalAlpha = 0.3;
      for (let i = 0; i < 40; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const radius = Math.random() * 50 + 20;
        
        const gradient = ctx.createRadialGradient(
          x, y, 0,
          x, y, radius
        );
        
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;
    }
    
    return new THREE.CanvasTexture(canvas);
  };
  
  // Create Moon texture with improved detail
  const createMoonTexture = (): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    const size = 512;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Base color - gray with slight variation
      ctx.fillStyle = '#aaa9ad';
      ctx.fillRect(0, 0, size, size);
      
      // Maria (dark areas) - more accurate positioning
      const maria = [
        { x: 250, y: 250, r: 100 },
        { x: 350, y: 200, r: 80 },
        { x: 180, y: 300, r: 70 },
        { x: 300, y: 350, r: 60 }
      ];
      
      maria.forEach(m => {
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = '#3a3a45';
        ctx.fill();
      });
      
      // Add more realistic craters
      for (let i = 0; i < 1000; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const radius = Math.random() * 8 + 1;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        
        // Crater with shadow and highlight for 3D effect
        const gradient = ctx.createRadialGradient(
          x - radius * 0.3, y - radius * 0.3, 0,
          x, y, radius
        );
        gradient.addColorStop(0, '#d0d0d0');
        gradient.addColorStop(0.8, '#808080');
        gradient.addColorStop(1, '#505050');
        
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }
    
    return new THREE.CanvasTexture(canvas);
  };
  
  return { createPlanetTexture, createEarthTexture, createMoonTexture };
}
