
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const AnimatedBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 50;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);
    
    // Create more realistic starfield with proper point sprites
    const createStarField = () => {
      const starCount = 7000;
      
      // Create a custom star texture
      const canvas = document.createElement('canvas');
      const size = 32;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Create radial gradient for the star
        const gradient = ctx.createRadialGradient(
          size / 2, size / 2, 0,
          size / 2, size / 2, size / 2
        );
        
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.4, 'rgba(240, 240, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(220, 220, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);
      }
      
      const starTexture = new THREE.CanvasTexture(canvas);
      
      // Create star vertices for the sphere distribution
      const starGeometry = new THREE.BufferGeometry();
      const starPositions = new Float32Array(starCount * 3);
      const starColors = new Float32Array(starCount * 3);
      const starSizes = new Float32Array(starCount);
      
      for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        
        // Position - create a sphere of stars for more realism
        const radius = 80 + Math.random() * 40;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        starPositions[i3 + 2] = radius * Math.cos(phi);
        
        // Color - more realistic star colors
        const colorChoice = Math.random();
        if (colorChoice > 0.98) {
          // Reddish stars (giants)
          starColors[i3] = 0.9 + Math.random() * 0.1;
          starColors[i3 + 1] = 0.2 + Math.random() * 0.3;
          starColors[i3 + 2] = 0.2;
        } else if (colorChoice > 0.95) {
          // Blue stars (hot stars)
          starColors[i3] = 0.4 + Math.random() * 0.2;
          starColors[i3 + 1] = 0.6 + Math.random() * 0.2;
          starColors[i3 + 2] = 0.9 + Math.random() * 0.1;
        } else if (colorChoice > 0.9) {
          // Yellow stars (like our sun)
          starColors[i3] = 0.9;
          starColors[i3 + 1] = 0.9;
          starColors[i3 + 2] = 0.5 + Math.random() * 0.3;
        } else {
          // White-ish stars with slight variation (most common)
          const value = 0.7 + Math.random() * 0.3;
          starColors[i3] = value;
          starColors[i3 + 1] = value;
          starColors[i3 + 2] = value + (Math.random() * 0.1);
        }
        
        // Size - realistic star size distribution
        const sizeFactor = Math.random();
        if (sizeFactor > 0.99) {
          // Very few large stars
          starSizes[i] = 2 + Math.random() * 1.5;
        } else if (sizeFactor > 0.95) {
          // Some medium stars
          starSizes[i] = 1.2 + Math.random() * 0.8;
        } else {
          // Most stars are small
          starSizes[i] = 0.1 + Math.random() * 0.8;
        }
      }
      
      starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
      starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
      
      const starMaterial = new THREE.PointsMaterial({
        size: 0.3,
        map: starTexture,
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      
      const stars = new THREE.Points(starGeometry, starMaterial);
      scene.add(stars);
      
      return stars;
    };
    
    // Create a realistic sun with corona effect
    const createSun = () => {
      const sunGroup = new THREE.Group();
      
      // Main sun sphere
      const sunGeometry = new THREE.SphereGeometry(10, 64, 64);
      
      // Create sun texture
      const sunCanvas = document.createElement('canvas');
      const sunSize = 128;
      sunCanvas.width = sunSize;
      sunCanvas.height = sunSize;
      const sunCtx = sunCanvas.getContext('2d');
      
      if (sunCtx) {
        // Create radial gradient for the sun
        const gradient = sunCtx.createRadialGradient(
          sunSize/2, sunSize/2, 0, 
          sunSize/2, sunSize/2, sunSize/2
        );
        
        gradient.addColorStop(0, '#fff9e5');
        gradient.addColorStop(0.4, '#ffee99');
        gradient.addColorStop(0.8, '#ff7700');
        gradient.addColorStop(1, '#ff3300');
        
        sunCtx.fillStyle = gradient;
        sunCtx.fillRect(0, 0, sunSize, sunSize);
        
        // Add some random sun spots
        sunCtx.fillStyle = 'rgba(255, 80, 0, 0.7)';
        for (let i = 0; i < 12; i++) {
          const spotSize = 2 + Math.random() * 10;
          const spotX = 20 + Math.random() * (sunSize - 40);
          const spotY = 20 + Math.random() * (sunSize - 40);
          sunCtx.beginPath();
          sunCtx.arc(spotX, spotY, spotSize, 0, Math.PI * 2);
          sunCtx.fill();
        }
      }
      
      const sunTexture = new THREE.CanvasTexture(sunCanvas);
      
      // Use MeshPhongMaterial instead of MeshBasicMaterial for emissive property
      const sunMaterial = new THREE.MeshPhongMaterial({
        map: sunTexture,
        emissive: new THREE.Color('#ffcc33'),
        emissiveIntensity: 0.8
      });
      
      const sun = new THREE.Mesh(sunGeometry, sunMaterial);
      sun.position.set(-35, 15, -40); // Position sun in distance
      
      // Corona effect (outer glow)
      const coronaGeometry = new THREE.SphereGeometry(14, 32, 32);
      const coronaMaterial = new THREE.MeshBasicMaterial({
        color: 0xffdd44,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide
      });
      
      const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
      corona.position.copy(sun.position);
      
      // Outer corona effect
      const outerCoronaGeometry = new THREE.SphereGeometry(20, 32, 32);
      const outerCoronaMaterial = new THREE.MeshBasicMaterial({
        color: 0xffee77,
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide
      });
      
      const outerCorona = new THREE.Mesh(outerCoronaGeometry, outerCoronaMaterial);
      outerCorona.position.copy(sun.position);
      
      // Sun rays (lens flare effect)
      const lensFlareTexture = new THREE.TextureLoader().load(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAkFBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AAAD///////////////////////////////////9tKdXjAAAAMHRSTlMAAwUNCBYRJzE5PExVT2JsboCEiJCVmaKmq6+0t7rBxcnM0NTZ3eDj5+rt8fP3+/0sGpIKAAAG1UlEQVR4Ae3dCXaiQBSF4X/U3hCNBkecB+Lces/+t5diG0SqgEJ5wPtyB/At4AlV6Ic/r/V/dbmspTYxzQpF8VhoXodXzDPH8bJGUXxWlDvnmWKazWOhzWCWBMrJnNIXTOLWKDO3xByr+sW6sJ1m2WFwWqKMrJCdQC9YBdYoG6s7gc5YaJSJ1oygK7uEsnAcQUdsUnruyR3UjekGpbZBNKiX14ayWiA6Bqy9EuVEz4MGrD7KZ4KG4A2lU9hoIGeUS9pBQ2Eh5IJmYE0QXnrQkNggLO2hIYpQJh1ocPsIRT9oQEgKxBp8bPNrGpzuEUJtoSXaYXHpGD5meTxCi7vHwpIlPOm7hd+xQ3hYQZONRXmHXAMfszwKaDLpCvNLx9Dml1hYZgc+ZnmE8Inrw0P1+NspuewMPfEZi5qi4YLnvpdPVQvaxuphQdENnsvHLzyXm+ahHRaxlBG6LuMvpnvoeYVv5eg5+2TuOfuRQ89o4xtlBfQ49pdyBD0Dl2WENnq2U39RWuiJHZZQDNCz2vhK8sPTeImYlh73Z+wDOcXigULRWLfm+kpB2EbjcL+w9NOaJUQwG7PnSQn42vBGIQh1v6KNV9TAL1wvvpv7R3y2YYuErcI5+O1YeTi3DyBL7O8PuvawbhpTv/Wpl/LNBQ8WahHJKKjx5xgc+kxNFMV8Bup+p12SdLLCvFjOYq6+7OJy9O8fXp/qWsGF6jLDXdvf3HI2Yq7N+pNJOCXvyLZGBXKqRp1rRuxLqIMBQr8q1fG+UdqCuqn+hP3tZK0uq4CxPzAVg0MdRpBduhFnDRwzWpfKb6N+CaUGIBg4MrwRiuCJSVsC6XKGkBhJDj4/6Tr8Z6oX73CjJQcGlO/QeTMx1WaXPK1sQ9eUTwW9MfRvZkSZcMmzULk5dN7FiL+0nrLM9XtDL7swhyxTwRYt7mXK7MiZuIQIUBWTUsdS27J5I6F9sIWMVEexEZM3YfgDJ5+5cKBIo+S/qnLzzcLmOBQNu78+mfWp8k4sL0xMmzJDKUXZkHJrPRpMGaSSp0eU/RoK1Q8Vta56Tl3ykK1fNbM5eX6TGOE6LPEXpn69iH6yw4cOSY8Gxa+rrJm8OVhKN2cyWBTZW+ZKmkUkRhD8Af+FtUC8TjqVdKwUXOK/BXl44lJq8u3iWNYFgZaZLKBXtEuSyJiTz96lZrVscrwqGpFDJFPV7L13VmUCyxoHgWSrQH3vYPSqQp7b4x9yJiPXbXn/zW+K5IEpPjkpfz9q6Cn8LHFNsNZklnCdGV38I6Yl4+q5Z5OXJwK1FLFZfEp0KS4T0z97ZnfSfUqZL8jZCHOAKaJZxchb0iMdYxrCfDzLqXJhE5K1SdK07XKQpH2z+cOecUvZUj63Z9iiTOAwHfD/Cw5x3o+aaiqkZDI+gV8W9m3Jtis5HKIZqoL+JJsXoSf5jSuv26iqHzLN9uyJsXxjrPnUdj0TXuLZK6jbWaIAYh1CldGSmEe7bUkRzSHcbW0u+p9Wm8J3Yyv7g9bVHNQN1XXnfGSx6rvQyDZKpM4VmzxXm89g5vCzwwRs9GDNMDfhJ9+gVdEDzZIBbxbGWqRl15S9WFqizW1jtNXbT4Z7IksTxXbL2rY1FW15lB3Iz3LFgCg7xEHJ0ZSkvq9/nzxsHMzEQY5nbYM1DhF0kxgIjf6kxY6bfvT7VcMwl2hBRvkBsvt8UuTY+kOJnU8hQrS3Jky1WzY1l/BVrCVrJEOZMOHE/rTNKz2kqIvqEIswlwkb8YNs5WBmJlvV3bjbGVB2Fx33k4QyL5kl5vYXbIqUl7xoJ51eZzBjrx4y3QnQlwJn9SJM3UgXbvxsqRZaZBa07TLuEcVGtF/qskxTfFxvZNIUsmXeQgykK5dPyLcM+aJi2kj+BH9ZFJsxkS1DtjRt21ixf5NMzCXkaTuxRZjXiJqBhJvQbC/eeJJTCd9p4znUvlPIj9JtlYXCf2HtmUNDPcTJe4p0iUQ/0JTB5gOZKbJ3Ut6g9i+ZM7aMRp/1xjZOkhzFaXZMQUo/gV6RpSXWGpuYjTBa+ZlJuZXsrZTOtG1OWeuuXH8UMbbdFnl6cxn1xU5Bl2lNa0KWZh+Rr5Zq39n+WMZsuMnSVYlW1hZvnKRIfq/UbQ5n7T0YOyTGhEm+rmq53h19dPaP9Ke59P85UzxnlkieAZLuTJa0B0meG6PFD4Ie94Rz7/PdsfAX9k26bRgMjgwAAAAASUVORK5CYII='
      );
      
      const lensFlareSize = 40;
      const lensFlareGeometry = new THREE.PlaneGeometry(lensFlareSize, lensFlareSize);
      const lensFlareMaterial = new THREE.MeshBasicMaterial({
        map: lensFlareTexture,
        transparent: true,
        opacity: 0.4,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      
      const lensFlare = new THREE.Mesh(lensFlareGeometry, lensFlareMaterial);
      lensFlare.position.copy(sun.position);
      
      sunGroup.add(sun);
      sunGroup.add(corona);
      sunGroup.add(outerCorona);
      sunGroup.add(lensFlare);
      
      // Add animation parameters
      sun.userData = {
        rotationSpeed: 0.0005,
        pulsateSpeed: 0.001,
        pulsatePhase: 0
      };
      
      corona.userData = {
        pulsateSpeed: 0.0015,
        pulsatePhase: Math.PI / 3
      };
      
      outerCorona.userData = {
        pulsateSpeed: 0.0008,
        pulsatePhase: Math.PI / 6
      };
      
      scene.add(sunGroup);
      return sunGroup;
    };
    
    // Create an Earth - With more realistic features
    const createEarth = () => {
      const earthGroup = new THREE.Group();
      
      // Create a detailed Earth texture
      const earthRadius = 8;
      const earthGeometry = new THREE.SphereGeometry(earthRadius, 64, 64);
      
      // Creating texture canvas for Earth
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      
      // Define continents data
      const continentsList = [
        // North America
        {
          points: [
            [100, 100], [300, 80], [350, 150], [300, 200], [350, 250],
            [250, 300], [150, 250], [100, 200]
          ],
          color: '#2e7d32' // Green
        },
        // South America
        {
          points: [
            [300, 300], [350, 400], [300, 450], [250, 400], [270, 300]
          ],
          color: '#388e3c' // Slightly different green
        },
        // Europe & Africa
        {
          points: [
            [450, 100], [550, 80], [600, 150], [550, 300], [500, 400],
            [450, 350], [400, 200], [420, 120]
          ],
          color: '#4caf50' // Another green
        },
        // Asia
        {
          points: [
            [600, 100], [800, 120], [850, 200], [750, 300], [650, 250],
            [600, 200]
          ],
          color: '#8d6e63' // Brown
        },
        // Australia
        {
          points: [
            [800, 350], [900, 330], [920, 400], [850, 420], [780, 380]
          ],
          color: '#795548' // Dark brown
        }
      ];
      
      if (ctx) {
        // Ocean base color
        ctx.fillStyle = '#0077be';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw each continent
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
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          for (let i = 0; i < 20; i++) {
            const x = continent.points[0][0] + Math.random() * 100;
            const y = continent.points[0][1] + Math.random() * 100;
            const size = 5 + Math.random() * 20;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
          }
        });
        
        // Add ice caps
        ctx.fillStyle = '#e8e8e8';
        // North pole
        ctx.beginPath();
        ctx.ellipse(canvas.width / 2, 30, 300, 60, 0, 0, Math.PI * 2);
        ctx.fill();
        // South pole
        ctx.beginPath();
        ctx.ellipse(canvas.width / 2, canvas.height - 30, 250, 50, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Add clouds
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        for (let i = 0; i < 20; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const radius = 10 + Math.random() * 40;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
          
          // Make cloud clusters
          for (let j = 0; j < 5; j++) {
            const cloudX = x + (Math.random() * 50 - 25);
            const cloudY = y + (Math.random() * 30 - 15);
            const cloudSize = radius * 0.6 * Math.random();
            ctx.beginPath();
            ctx.arc(cloudX, cloudY, cloudSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      
      // Create bump map for terrain
      const bumpCanvas = document.createElement('canvas');
      bumpCanvas.width = 1024;
      bumpCanvas.height = 512;
      const bumpCtx = bumpCanvas.getContext('2d');
      
      if (bumpCtx) {
        bumpCtx.fillStyle = '#444444';
        bumpCtx.fillRect(0, 0, bumpCanvas.width, bumpCanvas.height);
        
        // Add mountain ranges
        const mountainRanges = [
          {x: 200, y: 150, width: 100, height: 30}, // North America
          {x: 320, y: 350, width: 50, height: 100}, // Andes
          {x: 550, y: 150, width: 80, height: 40},  // Europe
          {x: 700, y: 180, width: 120, height: 50}  // Asia
        ];
        
        mountainRanges.forEach(range => {
          const gradient = bumpCtx.createLinearGradient(
            range.x, range.y, range.x + range.width, range.y + range.height
          );
          gradient.addColorStop(0, '#666666');
          gradient.addColorStop(0.5, '#ffffff');
          gradient.addColorStop(1, '#666666');
          
          bumpCtx.fillStyle = gradient;
          bumpCtx.beginPath();
          bumpCtx.ellipse(
            range.x + range.width / 2, 
            range.y + range.height / 2,
            range.width / 2,
            range.height / 2,
            0, 0, Math.PI * 2
          );
          bumpCtx.fill();
        });
      }
      
      // Create specular map
      const specularCanvas = document.createElement('canvas');
      specularCanvas.width = 1024;
      specularCanvas.height = 512;
      const specularCtx = specularCanvas.getContext('2d');
      
      if (specularCtx) {
        specularCtx.fillStyle = '#111111'; // Mostly non-reflective
        specularCtx.fillRect(0, 0, specularCanvas.width, specularCanvas.height);
        
        // Water is more reflective
        specularCtx.fillStyle = '#444444';
        specularCtx.fillRect(0, 0, specularCanvas.width, specularCanvas.height);
        
        continentsList.forEach(continent => {
          specularCtx.fillStyle = '#111111'; // Land less reflective
          specularCtx.beginPath();
          specularCtx.moveTo(continent.points[0][0], continent.points[0][1]);
          for (let i = 1; i < continent.points.length; i++) {
            specularCtx.lineTo(continent.points[i][0], continent.points[i][1]);
          }
          specularCtx.closePath();
          specularCtx.fill();
        });
        
        // Ice caps are somewhat reflective
        specularCtx.fillStyle = '#333333';
        specularCtx.beginPath();
        specularCtx.ellipse(specularCanvas.width / 2, 30, 300, 60, 0, 0, Math.PI * 2);
        specularCtx.fill();
        specularCtx.beginPath();
        specularCtx.ellipse(specularCanvas.width / 2, specularCanvas.height - 30, 250, 50, 0, 0, Math.PI * 2);
        specularCtx.fill();
      }
      
      // Create Earth textures
      const earthTexture = new THREE.CanvasTexture(canvas);
      const bumpMap = new THREE.CanvasTexture(bumpCanvas);
      const specularMap = new THREE.CanvasTexture(specularCanvas);
      
      // Earth material
      const earthMaterial = new THREE.MeshPhongMaterial({
        map: earthTexture,
        bumpMap: bumpMap,
        bumpScale: 0.05,
        specularMap: specularMap,
        specular: new THREE.Color('#333333'),
        shininess: 15
      });
      
      // Create the Earth mesh
      const earth = new THREE.Mesh(earthGeometry, earthMaterial);
      earth.position.set(20, 0, -15);
      earthGroup.add(earth);
      
      // Add cloud layer
      const cloudGeometry = new THREE.SphereGeometry(earthRadius + 0.2, 32, 32);
      
      // Create cloud texture
      const cloudCanvas = document.createElement('canvas');
      cloudCanvas.width = 1024;
      cloudCanvas.height = 512;
      const cloudCtx = cloudCanvas.getContext('2d');
      
      if (cloudCtx) {
        cloudCtx.fillStyle = 'rgba(0, 0, 0, 0)';
        cloudCtx.fillRect(0, 0, cloudCanvas.width, cloudCanvas.height);
        
        cloudCtx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        for (let i = 0; i < 40; i++) {
          const x = Math.random() * cloudCanvas.width;
          const y = Math.random() * cloudCanvas.height;
          const radius = 5 + Math.random() * 30;
          
          // Create cloud cluster
          for (let j = 0; j < 6; j++) {
            const cloudX = x + (Math.random() * 60 - 30);
            const cloudY = y + (Math.random() * 40 - 20);
            const cloudSize = radius * (0.3 + 0.7 * Math.random());
            cloudCtx.beginPath();
            cloudCtx.arc(cloudX, cloudY, cloudSize, 0, Math.PI * 2);
            cloudCtx.fill();
          }
        }
      }
      
      const cloudTexture = new THREE.CanvasTexture(cloudCanvas);
      const cloudMaterial = new THREE.MeshBasicMaterial({
        map: cloudTexture,
        transparent: true,
        opacity: 0.8,
        depthWrite: false
      });
      
      const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
      clouds.position.copy(earth.position);
      earthGroup.add(clouds);
      
      // Add atmosphere glow
      const atmosphereGeometry = new THREE.SphereGeometry(earthRadius + 0.5, 32, 32);
      const atmosphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x5899e2,
        transparent: true,
        opacity: 0.2,
        side: THREE.BackSide
      });
      
      const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
      atmosphere.position.copy(earth.position);
      earthGroup.add(atmosphere);
      
      // Add animation parameters
      earth.userData = {
        rotationSpeed: 0.005
      };
      
      clouds.userData = {
        rotationSpeed: 0.006
      };
      
      // Moon for Earth
      const moonRadius = earthRadius * 0.27;
      const moonGeometry = new THREE.SphereGeometry(moonRadius, 32, 32);
      
      // Create moon texture
      const moonCanvas = document.createElement('canvas');
      moonCanvas.width = 512;
      moonCanvas.height = 512;
      const moonCtx = moonCanvas.getContext('2d');
      
      if (moonCtx) {
        // Base gray color
        moonCtx.fillStyle = '#aaaaaa';
        moonCtx.fillRect(0, 0, moonCanvas.width, moonCanvas.height);
        
        // Add craters
        for (let i = 0; i < 100; i++) {
          const x = Math.random() * moonCanvas.width;
          const y = Math.random() * moonCanvas.height;
          const radius = 2 + Math.random() * 20;
          
          const gradient = moonCtx.createRadialGradient(
            x, y, 0,
            x, y, radius
          );
          
          if (Math.random() > 0.5) {
            // Darker crater
            gradient.addColorStop(0, '#777777');
            gradient.addColorStop(1, '#aaaaaa');
          } else {
            // Lighter crater
            gradient.addColorStop(0, '#cccccc');
            gradient.addColorStop(1, '#aaaaaa');
          }
          
          moonCtx.beginPath();
          moonCtx.arc(x, y, radius, 0, Math.PI * 2);
          moonCtx.fillStyle = gradient;
          moonCtx.fill();
        }
        
        // Add some darker maria areas
        const mariaAreas = [
          {x: 150, y: 200, radius: 80},
          {x: 300, y: 150, radius: 60},
          {x: 100, y: 350, radius: 70}
        ];
        
        mariaAreas.forEach(area => {
          moonCtx.fillStyle = '#777777';
          moonCtx.beginPath();
          moonCtx.arc(area.x, area.y, area.radius, 0, Math.PI * 2);
          moonCtx.fill();
        });
      }
      
      const moonTexture = new THREE.CanvasTexture(moonCanvas);
      const moonMaterial = new THREE.MeshPhongMaterial({
        map: moonTexture,
        bumpMap: moonTexture,
        bumpScale: 0.02
      });
      
      const moon = new THREE.Mesh(moonGeometry, moonMaterial);
      
      // Create a separate group for the moon's orbit
      const moonOrbit = new THREE.Group();
      moonOrbit.position.copy(earth.position);
      
      // Position the moon in its orbit
      moon.position.set(earthRadius * 2.5, 0, 0);
      moonOrbit.add(moon);
      earthGroup.add(moonOrbit);
      
      moon.userData = {
        rotationSpeed: 0.002
      };
      
      moonOrbit.userData = {
        rotationSpeed: 0.005
      };
      
      scene.add(earthGroup);
      return { earthGroup, earth, clouds, moonOrbit, moon };
    };
    
    // Create rocky planets
    const createRockyPlanet = (radius, position, color, ringOption) => {
      const planetGroup = new THREE.Group();
      
      // Create planet geometry
      const planetGeometry = new THREE.SphereGeometry(radius, 32, 32);
      
      // Create planet texture
      const planetCanvas = document.createElement('canvas');
      planetCanvas.width = 512;
      planetCanvas.height = 512;
      const planetCtx = planetCanvas.getContext('2d');
      
      if (planetCtx) {
        // Base color
        planetCtx.fillStyle = color;
        planetCtx.fillRect(0, 0, planetCanvas.width, planetCanvas.height);
        
        // Add surface details - varies by planet type
        if (color.includes('red') || color.includes('brown')) {
          // Mars-like planet
          for (let i = 0; i < 2000; i++) {
            const x = Math.random() * planetCanvas.width;
            const y = Math.random() * planetCanvas.height;
            const radius = 1 + Math.random() * 10;
            
            // Darker or lighter spot
            if (Math.random() > 0.5) {
              planetCtx.fillStyle = 'rgba(100, 30, 0, 0.3)';
            } else {
              planetCtx.fillStyle = 'rgba(255, 160, 120, 0.3)';
            }
            
            planetCtx.beginPath();
            planetCtx.arc(x, y, radius, 0, Math.PI * 2);
            planetCtx.fill();
          }
          
          // Add a polar cap
          planetCtx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          planetCtx.beginPath();
          planetCtx.ellipse(planetCanvas.width / 2, 30, 150, 40, 0, 0, Math.PI * 2);
          planetCtx.fill();
        } else if (color.includes('orange') || color.includes('gold')) {
          // Jupiter-like gas giant
          // Add bands
          for (let i = 0; i < 10; i++) {
            const y = 50 + i * 40;
            const width = planetCanvas.width;
            const height = 30;
            
            // Alternate band colors
            if (i % 2 === 0) {
              planetCtx.fillStyle = 'rgba(255, 190, 100, 0.5)';
            } else {
              planetCtx.fillStyle = 'rgba(150, 100, 60, 0.5)';
            }
            
            planetCtx.fillRect(0, y, width, height);
          }
          
          // Add the Great Red Spot
          planetCtx.fillStyle = 'rgba(200, 60, 30, 0.7)';
          planetCtx.beginPath();
          planetCtx.ellipse(150, 200, 60, 30, 0, 0, Math.PI * 2);
          planetCtx.fill();
          
        } else {
          // Generic rocky planet
          for (let i = 0; i < 1000; i++) {
            const x = Math.random() * planetCanvas.width;
            const y = Math.random() * planetCanvas.height;
            const radius = 1 + Math.random() * 5;
            
            // Lighter or darker spot
            const brightness = Math.random() > 0.5 ? 50 : -50;
            
            // Extract base color components (very simple approach)
            let r = parseInt(color.slice(1, 3), 16);
            let g = parseInt(color.slice(3, 5), 16);
            let b = parseInt(color.slice(5, 7), 16);
            
            // Adjust brightness
            r = Math.max(0, Math.min(255, r + brightness));
            g = Math.max(0, Math.min(255, g + brightness));
            b = Math.max(0, Math.min(255, b + brightness));
            
            planetCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            planetCtx.beginPath();
            planetCtx.arc(x, y, radius, 0, Math.PI * 2);
            planetCtx.fill();
          }
        }
      }
      
      const planetTexture = new THREE.CanvasTexture(planetCanvas);
      
      // Create a bump map for terrain
      const bumpCanvas = document.createElement('canvas');
      bumpCanvas.width = 512;
      bumpCanvas.height = 512;
      const bumpCtx = bumpCanvas.getContext('2d');
      
      if (bumpCtx) {
        bumpCtx.fillStyle = '#777777';
        bumpCtx.fillRect(0, 0, bumpCanvas.width, bumpCanvas.height);
        
        // Add random bumps
        for (let i = 0; i < 500; i++) {
          const x = Math.random() * bumpCanvas.width;
          const y = Math.random() * bumpCanvas.height;
          const radius = 2 + Math.random() * 10;
          
          const gradient = bumpCtx.createRadialGradient(
            x, y, 0,
            x, y, radius
          );
          
          if (Math.random() > 0.5) {
            // Mountain
            gradient.addColorStop(0, '#ffffff');
            gradient.addColorStop(1, '#777777');
          } else {
            // Crater
            gradient.addColorStop(0, '#333333');
            gradient.addColorStop(1, '#777777');
          }
          
          bumpCtx.beginPath();
          bumpCtx.arc(x, y, radius, 0, Math.PI * 2);
          bumpCtx.fillStyle = gradient;
          bumpCtx.fill();
        }
      }
      
      const bumpMap = new THREE.CanvasTexture(bumpCanvas);
      
      const planetMaterial = new THREE.MeshPhongMaterial({
        map: planetTexture,
        bumpMap: bumpMap,
        bumpScale: 0.05,
        shininess: 5
      });
      
      const planet = new THREE.Mesh(planetGeometry, planetMaterial);
      planet.position.copy(position);
      planetGroup.add(planet);
      
      // Add rings for special planets (like Saturn)
      if (ringOption) {
        const ringGeometry = new THREE.RingGeometry(
          radius * 1.5, 
          radius * 2.2, 
          64
        );
        
        // Create ring texture
        const ringCanvas = document.createElement('canvas');
        ringCanvas.width = 512;
        ringCanvas.height = 128;
        const ringCtx = ringCanvas.getContext('2d');
        
        if (ringCtx) {
          // Create gradient across the ring
          const gradient = ringCtx.createLinearGradient(0, 0, ringCanvas.width, 0);
          
          // Ring color varies by planet type
          if (color.includes('orange') || color.includes('gold')) {
            // Saturn-like rings
            gradient.addColorStop(0, 'rgba(255, 220, 180, 0.1)');
            gradient.addColorStop(0.2, 'rgba(255, 220, 180, 0.5)');
            gradient.addColorStop(0.3, 'rgba(255, 220, 180, 0.2)');
            gradient.addColorStop(0.4, 'rgba(255, 220, 180, 0.6)');
            gradient.addColorStop(0.6, 'rgba(255, 220, 180, 0.3)');
            gradient.addColorStop(0.8, 'rgba(255, 220, 180, 0.5)');
            gradient.addColorStop(1, 'rgba(255, 220, 180, 0.1)');
          } else {
            // Generic rings
            gradient.addColorStop(0, 'rgba(180, 180, 180, 0.1)');
            gradient.addColorStop(0.2, 'rgba(180, 180, 180, 0.3)');
            gradient.addColorStop(0.5, 'rgba(180, 180, 180, 0.5)');
            gradient.addColorStop(0.8, 'rgba(180, 180, 180, 0.3)');
            gradient.addColorStop(1, 'rgba(180, 180, 180, 0.1)');
          }
          
          ringCtx.fillStyle = gradient;
          ringCtx.fillRect(0, 0, ringCanvas.width, ringCanvas.height);
          
          // Add some variation/gaps in the rings
          for (let i = 0; i < 5; i++) {
            const x = Math.random() * ringCanvas.width;
            const width = 10 + Math.random() * 30;
            ringCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ringCtx.fillRect(x, 0, width, ringCanvas.height);
          }
        }
        
        const ringTexture = new THREE.CanvasTexture(ringCanvas);
        
        const ringMaterial = new THREE.MeshBasicMaterial({
          map: ringTexture,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.8
        });
        
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2 + 0.2; // Tilt the rings slightly
        ring.position.copy(position);
        planetGroup.add(ring);
      }
      
      // Add animation parameters
      planet.userData = {
        rotationSpeed: 0.005 * (1 + Math.random())
      };
      
      scene.add(planetGroup);
      return planetGroup;
    };
    
    // Create lights
    const createLights = () => {
      // Ambient light for overall illumination
      const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
      scene.add(ambientLight);
      
      // Directional light to simulate distant star
      const sunLight = new THREE.DirectionalLight(0xffffff, 1);
      sunLight.position.set(50, 30, 20);
      scene.add(sunLight);
      
      // Add some point lights for visual interest
      const colors = [0x3366ff, 0xffff99, 0xff6633];
      const positions = [
        [-30, 15, -20],
        [25, -10, -30],
        [0, 20, -15]
      ];
      
      const pointLights = [];
      for (let i = 0; i < 3; i++) {
        const light = new THREE.PointLight(colors[i], 0.8, 30);
        light.position.set(positions[i][0], positions[i][1], positions[i][2]);
        scene.add(light);
        pointLights.push(light);
      }
      
      return { ambientLight, sunLight, pointLights };
    };
    
    // Create all objects
    const starField = createStarField();
    const cosmicObjects = [];
    
    // Create sun
    const sun = createSun();
    cosmicObjects.push(sun);
    
    // Create Earth
    const earthSystem = createEarth();
    cosmicObjects.push(earthSystem.earthGroup);
    
    // Create other planets
    // Mars-like
    const mars = createRockyPlanet(3, new THREE.Vector3(-25, -5, -30), '#c1440e');
    cosmicObjects.push(mars);
    
    // Saturn-like
    const saturn = createRockyPlanet(6, new THREE.Vector3(-15, 15, -50), '#e6c588', true);
    cosmicObjects.push(saturn);
    
    // Small blue planet
    const bluePlanet = createRockyPlanet(2, new THREE.Vector3(35, -8, -25), '#3366aa');
    cosmicObjects.push(bluePlanet);
    
    // Add lighting
    const lights = createLights();
    
    // Animation loop
    let mouseX = 0;
    let mouseY = 0;
    
    const mouseMoveHandler = (event: MouseEvent) => {
      mouseX = (event.clientX - window.innerWidth / 2) * 0.005;
      mouseY = (event.clientY - window.innerHeight / 2) * 0.005;
    };
    
    document.addEventListener('mousemove', mouseMoveHandler);
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation function
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      
      // Animate the cosmic objects
      if (earthSystem) {
        // Rotate Earth
        earthSystem.earth.rotation.y += earthSystem.earth.userData.rotationSpeed;
        
        // Rotate cloud layer slightly faster
        earthSystem.clouds.rotation.y += earthSystem.clouds.userData.rotationSpeed;
        
        // Rotate moon orbit
        earthSystem.moonOrbit.rotation.y += earthSystem.moonOrbit.userData.rotationSpeed;
        
        // Rotate moon itself
        earthSystem.moon.rotation.y += earthSystem.moon.userData.rotationSpeed;
      }
      
      // Animate other planets
      cosmicObjects.forEach((object) => {
        if (object instanceof THREE.Group) {
          object.children.forEach((child) => {
            if (child.userData && child.userData.rotationSpeed) {
              child.rotation.y += child.userData.rotationSpeed;
              
              // Add pulsating effect if applicable
              if (child.userData.pulsateSpeed) {
                const pulseValue = Math.sin(Date.now() * child.userData.pulsateSpeed + child.userData.pulsatePhase) * 0.2 + 0.8;
                
                if ('material' in child && child.material) {
                  const material = child.material as THREE.Material;
                  if ('opacity' in material && material.opacity !== undefined) {
                    material.opacity = pulseValue * 0.7;
                  }
                }
              }
            }
          });
        }
      });
      
      // Camera movement based on mouse position
      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);
      
      renderer.render(scene, camera);
    };
    
    // Start animation
    const animationId = requestAnimationFrame(animate);
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', mouseMoveHandler);
      cancelAnimationFrame(animationId);
      
      // Properly dispose of THREE.js objects
      renderer.dispose();
      
      // Dispose of geometries and materials
      function disposeObject(obj: THREE.Object3D) {
        if (obj.children.length > 0) {
          // Clone the array because the original will be modified while we remove objects
          const children = [...obj.children];
          for (const child of children) {
            disposeObject(child);
          }
        }
        
        if ('geometry' in obj) {
          const geometry = (obj as any).geometry;
          if (geometry && geometry.dispose) {
            geometry.dispose();
          }
        }
        
        if ('material' in obj) {
          const material = (obj as any).material;
          if (material) {
            if (Array.isArray(material)) {
              material.forEach(m => m.dispose && m.dispose());
            } else if (material.dispose) {
              material.dispose();
            }
          }
        }
        
        obj.removeFromParent();
      }
      
      // Dispose all objects in the scene
      while (scene.children.length > 0) {
        disposeObject(scene.children[0]);
      }
      
      // Remove renderer from DOM
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);
  
  return <div ref={containerRef} className="absolute inset-0" />;
};

export default AnimatedBackground;
