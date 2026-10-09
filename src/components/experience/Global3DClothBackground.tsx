import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Global3DClothBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = window.innerWidth;
    const height = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    container.appendChild(renderer.domElement);

    // 2. Luminous Golden & Champagne Lighting (Light & radiant, never dark)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.25);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffae8, 2.5);
    keyLight.position.set(3.5, 4.5, 3.5);
    scene.add(keyLight);

    const goldFillLight = new THREE.DirectionalLight(0xd4af37, 1.8);
    goldFillLight.position.set(-3.5, -2.5, 2.5);
    scene.add(goldFillLight);

    const interactiveCursorLight = new THREE.PointLight(0xffe6a3, 2.8, 8);
    interactiveCursorLight.position.set(0, 0, 2.5);
    scene.add(interactiveCursorLight);

    // 3. 3D Cloth Mesh Plane Geometry
    const segmentsX = 84;
    const segmentsY = 64;
    const clothWidth = 7.5;
    const clothHeight = 5.6;

    const geometry = new THREE.PlaneGeometry(clothWidth, clothHeight, segmentsX, segmentsY);
    const posAttr = geometry.attributes.position;
    const originalPositions = posAttr.array.slice() as Float32Array;

    // Displacement & velocity buffers for spring physics
    const vertexVelocities = new Float32Array(posAttr.count);
    const vertexDisplacements = new Float32Array(posAttr.count);

    // Light Champagne Gold Silk Material (Luminous, delicate gold sheen, not dark)
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xfcf6e8), // Soft luxury champagne ivory
      roughness: 0.3,
      metalness: 0.32,
      side: THREE.DoubleSide,
      wireframe: false,
    });

    const clothMesh = new THREE.Mesh(geometry, material);
    clothMesh.rotation.x = -0.12;
    clothMesh.rotation.y = 0.04;
    scene.add(clothMesh);

    // 4. Interactive Physics State (Scroll velocity, touch/pointer ripples, pop-up impulses)
    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      vx: 0,
      vy: 0,
      isDown: false,
      popUpPulse: 0,
    };

    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;

    // Track pointer and touch movement globally across window
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      // Convert to normalized coordinates (-1 to 1)
      const nx = (clientX / window.innerWidth) * 2 - 1;
      const ny = -(clientY / window.innerHeight) * 2 + 1;

      mouse.vx = nx - mouse.targetX;
      mouse.vy = ny - mouse.targetY;
      mouse.targetX = nx;
      mouse.targetY = ny;
    };

    const handlePointerDown = () => {
      mouse.isDown = true;
      // Touch / Click causes a smooth forward pop-up impulse
      mouse.popUpPulse = 1.0;
    };

    const handlePointerUp = () => {
      mouse.isDown = false;
    };

    // Track scroll velocity for scroll wave lift
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY;
      scrollVelocity += Math.abs(diff) * 0.015;
      lastScrollY = currentScrollY;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('mousedown', handlePointerDown, { passive: true });
    window.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('mouseup', handlePointerUp, { passive: true });
    window.addEventListener('touchend', handlePointerUp, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Window resize handler
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 5. 60FPS Fluid Animation & Simulation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const positions = geometry.attributes.position;

      // Smooth pointer interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;
      mouse.vx *= 0.92;
      mouse.vy *= 0.92;

      // Smooth scroll velocity decay
      scrollVelocity *= 0.91;
      mouse.popUpPulse *= 0.92;

      // Position the interactive cursor light
      interactiveCursorLight.position.x = mouse.x * (clothWidth * 0.45);
      interactiveCursorLight.position.y = mouse.y * (clothHeight * 0.45);
      interactiveCursorLight.position.z = 1.8 + mouse.popUpPulse * 0.8;

      // Gentle overall cloth tilt based on cursor position
      clothMesh.rotation.y = THREE.MathUtils.lerp(clothMesh.rotation.y, mouse.x * 0.08, 0.04);
      clothMesh.rotation.x = THREE.MathUtils.lerp(clothMesh.rotation.x, -0.12 - mouse.y * 0.06, 0.04);

      const cursorSpeed = Math.sqrt(mouse.vx * mouse.vx + mouse.vy * mouse.vy);
      const scrollImpulse = Math.min(scrollVelocity, 0.6);

      // Deform cloth vertices
      for (let i = 0; i < positions.count; i++) {
        const u = (i % (segmentsX + 1)) / segmentsX;
        const v = Math.floor(i / (segmentsX + 1)) / segmentsY;

        const origX = originalPositions[i * 3];
        const origY = originalPositions[i * 3 + 1];

        // 1. Natural silk ambient waves (flowing draped waves)
        const wave1 = Math.sin(u * 3.8 + elapsedTime * 1.3) * Math.cos(v * 2.8 + elapsedTime * 0.9) * 0.22;
        const wave2 = Math.sin((u + v) * 4.2 + elapsedTime * 1.6) * 0.14;
        const wave3 = Math.cos(u * 6.5 - elapsedTime * 0.8) * 0.08;
        const naturalZ = wave1 + wave2 + wave3;

        // 2. Interactive Cursor / Touch Distance Calculation
        const worldX = (u - 0.5) * clothWidth;
        const worldY = (v - 0.5) * clothHeight;
        const cursorWorldX = mouse.x * (clothWidth * 0.45);
        const cursorWorldY = mouse.y * (clothHeight * 0.45);

        const dx = worldX - cursorWorldX;
        const dy = worldY - cursorWorldY;
        const distSq = dx * dx + dy * dy;

        let touchForce = 0;
        if (distSq < 2.5) {
          const proximity = Math.max(0, 1 - distSq / 2.5);
          // Pop-up impulse on touch/press + dynamic drag ripple
          touchForce = Math.sin(proximity * Math.PI) * (0.28 + cursorSpeed * 2.2 + mouse.popUpPulse * 0.45);
          vertexVelocities[i] += touchForce * 0.06;
        }

        // 3. Scroll Lift (Pops up cloth waves when user scrolls the page)
        const scrollWave = Math.sin(v * 6.0 + elapsedTime * 4.0) * scrollImpulse * 0.35;
        vertexVelocities[i] += scrollWave * 0.05;

        // 4. Spring integration with gentle damping for silk softness
        vertexVelocities[i] += -vertexDisplacements[i] * 0.07;
        vertexVelocities[i] *= 0.89;
        vertexDisplacements[i] += vertexVelocities[i];

        // 5. Final vertex displacement
        const finalZ = naturalZ + vertexDisplacements[i] + touchForce * 0.15;
        positions.setZ(i, finalZ);

        // Subtle lateral stretching for elastic textile feel
        positions.setX(i, origX + finalZ * 0.05 * (u - 0.5));
        positions.setY(i, origY - Math.abs(finalZ * 0.03));
      }

      positions.needsUpdate = true;
      geometry.computeVertexNormals();

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchend', handlePointerUp);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-90 select-none"
      style={{
        background: 'radial-gradient(ellipse at 50% 30%, #FFFDF9 0%, #FAF4E6 60%, #F5ECDB 100%)',
      }}
    />
  );
};
