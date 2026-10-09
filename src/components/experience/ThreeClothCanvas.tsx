import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { soundManager } from './SoundManager';

export type FabricType = 'silk' | 'denim' | 'gold' | 'noir' | 'white';

interface ThreeClothCanvasProps {
  fabric?: FabricType;
  interactive?: boolean;
  className?: string;
  theme?: 'light' | 'dark';
  onFabricClick?: () => void;
  accentText?: string;
}

const FABRIC_CONFIGS: Record<
  FabricType,
  {
    name: string;
    sub: string;
    color: number;
    specular: number;
    roughness: number;
    metalness: number;
    wireframe?: boolean;
    waveSpeed: number;
    waveAmplitude: number;
  }
> = {
  silk: {
    name: 'Egyptian Double-Ply Silk',
    sub: '120s thread count · Shimmering Mother-of-Pearl Sheen',
    color: 0xfaf4e6, // Soft luxury champagne ivory
    specular: 0xd4af37,
    roughness: 0.28,
    metalness: 0.2,
    waveSpeed: 1.4,
    waveAmplitude: 0.22,
  },
  white: {
    name: 'Pure White Egyptian Linen',
    sub: '140s double-twist long staple · Radiant Alabaster Sheen',
    color: 0xffffff, // Pure White
    specular: 0xd4af37,
    roughness: 0.22,
    metalness: 0.12,
    waveSpeed: 1.3,
    waveAmplitude: 0.24,
  },
  gold: {
    name: 'Liquid 24K Gold Lamé',
    sub: 'High-Luster Metallurgical Textile · Fluid Gold Draping',
    color: 0xd4af37, // Polished Gold
    specular: 0xfff4cc,
    roughness: 0.18,
    metalness: 0.85,
    waveSpeed: 1.6,
    waveAmplitude: 0.26,
  },
  denim: {
    name: 'Raw Selvedge Denim',
    sub: '14.5oz Japanese Kurabo Shuttle Loom · Antique Brass Weft',
    color: 0x1a2b4c, // Deep Raw Indigo
    specular: 0x587399,
    roughness: 0.72,
    metalness: 0.05,
    waveSpeed: 0.9,
    waveAmplitude: 0.16,
  },
  noir: {
    name: 'Obsidian Midnight Velvet',
    sub: 'Sculpted Tuscan Calfskin & Matte Black Silk Weft',
    color: 0x141417, // Noir
    specular: 0x8a7f70,
    roughness: 0.45,
    metalness: 0.35,
    waveSpeed: 1.1,
    waveAmplitude: 0.18,
  },
};

export const ThreeClothCanvas: React.FC<ThreeClothCanvasProps> = ({
  fabric = 'silk',
  interactive = true,
  className = '',
  theme = 'light',
  onFabricClick,
  accentText,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0, vx: 0, vy: 0, isDown: false });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.2);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xd4af37, 1.4);
    fillLight.position.set(-3, -2, 2);
    scene.add(fillLight);

    const cursorLight = new THREE.PointLight(0xffffff, 2.0, 6);
    cursorLight.position.set(0, 0, 2);
    scene.add(cursorLight);

    // 3. Parametric 3D Cloth Mesh
    const segmentsX = 72;
    const segmentsY = 72;
    const clothWidth = 3.8;
    const clothHeight = 2.6;

    const geometry = new THREE.PlaneGeometry(clothWidth, clothHeight, segmentsX, segmentsY);
    const posAttr = geometry.attributes.position;
    const originalPositions = posAttr.array.slice() as Float32Array;

    // Dynamic wave / ripple displacement data
    const vertexVelocities = new Float32Array(posAttr.count);
    const vertexDisplacements = new Float32Array(posAttr.count);

    const currentConfig = FABRIC_CONFIGS[fabric];

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(currentConfig.color),
      roughness: currentConfig.roughness,
      metalness: currentConfig.metalness,
      side: THREE.DoubleSide,
      wireframe: false,
    });

    const clothMesh = new THREE.Mesh(geometry, material);
    clothMesh.rotation.x = -0.15;
    clothMesh.rotation.y = 0.05;
    scene.add(clothMesh);

    // 4. Subtle Gold Edge / Selvedge Line Indicator (for authentic tailoring flair)
    const selvedgeGeo = new THREE.BufferGeometry();
    const selvedgePoints: number[] = [];
    for (let i = 0; i <= segmentsY; i++) {
      const y = (i / segmentsY - 0.5) * clothHeight;
      selvedgePoints.push(-clothWidth / 2, y, 0.02);
    }
    selvedgeGeo.setAttribute('position', new THREE.Float32BufferAttribute(selvedgePoints, 3));
    const selvedgeMat = new THREE.LineBasicMaterial({
      color: fabric === 'denim' ? 0xd4af37 : 0xffffff,
      linewidth: 2,
      transparent: true,
      opacity: 0.6,
    });
    const selvedgeLine = new THREE.Line(selvedgeGeo, selvedgeMat);
    clothMesh.add(selvedgeLine);

    // 5. Animation & Physics Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const cfg = FABRIC_CONFIGS[fabric];
      const positions = geometry.attributes.position;

      // Update cursor light
      cursorLight.position.x = mouseRef.current.x * 2.2;
      cursorLight.position.y = mouseRef.current.y * 1.5;

      // Mouse drag damping
      mouseRef.current.vx *= 0.92;
      mouseRef.current.vy *= 0.92;

      // Subtle cloth tilt tracking cursor
      clothMesh.rotation.y = THREE.MathUtils.lerp(clothMesh.rotation.y, mouseRef.current.x * 0.12, 0.05);
      clothMesh.rotation.x = THREE.MathUtils.lerp(clothMesh.rotation.x, -0.15 - mouseRef.current.y * 0.08, 0.05);

      // Deform cloth vertices with organic fluid billows and cursor physics
      for (let i = 0; i < positions.count; i++) {
        const u = (i % (segmentsX + 1)) / segmentsX;
        const v = Math.floor(i / (segmentsX + 1)) / segmentsY;

        const origX = originalPositions[i * 3];
        const origY = originalPositions[i * 3 + 1];

        // 1. Natural Ambient Wind Waves (Breathing drapery)
        const wave1 = Math.sin(u * 4.5 + elapsedTime * cfg.waveSpeed) * Math.cos(v * 3.5 + elapsedTime * (cfg.waveSpeed * 0.7));
        const wave2 = Math.sin((u + v) * 5.0 + elapsedTime * (cfg.waveSpeed * 1.2)) * 0.45;
        const wave3 = Math.cos(u * 8.0 - elapsedTime * cfg.waveSpeed * 0.5) * 0.2;

        const naturalZ = (wave1 + wave2 + wave3) * cfg.waveAmplitude;

        // 2. Cursor Force Ripple
        const dx = (u - 0.5) * clothWidth - mouseRef.current.x * 2.5;
        const dy = (v - 0.5) * clothHeight - mouseRef.current.y * 1.8;
        const distSq = dx * dx + dy * dy;

        let mouseForce = 0;
        if (distSq < 1.4) {
          const proximity = Math.max(0, 1 - distSq / 1.4);
          const cursorVelocityMagnitude = Math.sqrt(
            mouseRef.current.vx * mouseRef.current.vx + mouseRef.current.vy * mouseRef.current.vy
          );

          mouseForce = Math.sin(proximity * Math.PI) * (0.35 + cursorVelocityMagnitude * 1.8);

          // Spring ripple damping
          vertexVelocities[i] += mouseForce * 0.05;
        }

        // Spring integration
        vertexVelocities[i] += -vertexDisplacements[i] * 0.08; // Hooke's spring force
        vertexVelocities[i] *= 0.88; // Damping
        vertexDisplacements[i] += vertexVelocities[i];

        // Final vertex positions with natural organic drape
        const finalZ = naturalZ + vertexDisplacements[i] + mouseForce * 0.2;

        positions.setZ(i, finalZ);

        // Subtle lateral stretching when pulled
        positions.setX(i, origX + (finalZ * 0.08 * (u - 0.5)));
        positions.setY(i, origY - Math.abs(finalZ * 0.05));
      }

      positions.needsUpdate = true;
      geometry.computeVertexNormals();

      renderer.render(scene, camera);
    };

    animate();

    // 6. Interactive Event Handlers
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      mouseRef.current.vx = x - mouseRef.current.prevX;
      mouseRef.current.vy = y - mouseRef.current.prevY;
      mouseRef.current.prevX = x;
      mouseRef.current.prevY = y;
      mouseRef.current.x = x;
      mouseRef.current.y = y;

      const speed = Math.abs(mouseRef.current.vx) + Math.abs(mouseRef.current.vy);
      if (speed > 0.04) {
        soundManager.playFabricRustle(speed * 3);
      }
    };

    const handleMouseDown = () => {
      mouseRef.current.isDown = true;
      setIsInteracting(true);
      soundManager.playFabricRustle(0.7);
    };

    const handleMouseUp = () => {
      mouseRef.current.isDown = false;
      setIsInteracting(false);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      const rect = container.getBoundingClientRect();
      const touch = e.touches[0];
      const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((touch.clientY - rect.top) / rect.height) * 2 - 1);

      mouseRef.current.vx = x - mouseRef.current.prevX;
      mouseRef.current.vy = y - mouseRef.current.prevY;
      mouseRef.current.prevX = x;
      mouseRef.current.prevY = y;
      mouseRef.current.x = x;
      mouseRef.current.y = y;

      soundManager.playFabricRustle(0.4);
    };

    if (interactive) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);
      container.addEventListener('touchmove', handleTouchMove, { passive: true });
    }

    // 7. Responsive Resizing
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (interactive) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
        container.removeEventListener('touchmove', handleTouchMove);
      }
      window.removeEventListener('resize', handleResize);

      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [fabric, interactive]);

  const cfg = FABRIC_CONFIGS[fabric];

  return (
    <div
      ref={containerRef}
      onClick={onFabricClick}
      className={`relative w-full h-full overflow-hidden select-none cursor-grab active:cursor-grabbing ${className}`}
    >
      {/* Floating Textile Technical Spec pill in bottom corner */}
      <div
        className={`absolute bottom-5 left-5 z-10 pointer-events-none px-4 py-2.5 rounded-2xl shadow-xl transition-all backdrop-blur-md border ${
          theme === 'light'
            ? 'bg-white/90 border-[#D4AF37]/50 text-[#111111] shadow-[0_4px_20px_rgba(212,175,55,0.18)]'
            : 'bg-black/70 border-white/20 text-white'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
          <span
            className={`text-[10px] uppercase font-mono font-bold tracking-widest ${
              theme === 'light' ? 'text-[#8C6D1F]' : 'text-[#E5D7B7]'
            }`}
          >
            3D REAL-TIME TEXTILE WEAVE
          </span>
        </div>
        <p
          className={`font-bodoni text-xs sm:text-sm font-bold mt-0.5 tracking-wider ${
            theme === 'light' ? 'text-[#111111]' : 'text-white'
          }`}
        >
          {cfg.name}
        </p>
        <p
          className={`text-[9px] font-mono tracking-wide mt-0.5 ${
            theme === 'light' ? 'text-[#6B5E4E]' : 'text-gray-400'
          }`}
        >
          {cfg.sub}
        </p>
      </div>

      {/* Subtle Drag Prompt */}
      {interactive && (
        <div
          className={`absolute top-5 right-5 z-10 pointer-events-none transition-opacity duration-300 text-right ${
            isInteracting ? 'opacity-20' : 'opacity-85'
          }`}
        >
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] shadow-xs backdrop-blur-xs border ${
              theme === 'light'
                ? 'bg-white/90 border-[#D4AF37]/60 text-[#8C6D1F] font-bold'
                : 'bg-white/10 border-white/20 text-[#E5D7B7]'
            }`}
          >
            Drag Cursor · Feel Texture
          </span>
          {accentText && (
            <p
              className={`text-[9px] tracking-wider mt-1 font-mono uppercase ${
                theme === 'light' ? 'text-[#7A6C58]' : 'text-gray-400'
              }`}
            >
              {accentText}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
