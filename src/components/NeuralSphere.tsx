import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface NeuralSphereProps {
  size?: number;
  interactive?: boolean;
  pulsingIntensity?: number;
  onClick?: () => void;
  className?: string;
}

export const NeuralSphere: React.FC<NeuralSphereProps> = ({
  size = 320,
  interactive = true,
  pulsingIntensity = 1,
  onClick,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Dark Core Inner Sphere (Glassy/Metallic Black)
    const innerGeo = new THREE.SphereGeometry(1.22, 64, 64);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x08090d,
      roughness: 0.15,
      metalness: 0.85,
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    rootGroup.add(innerCore);

    // 2. Glowing Red Neural Wireframe (Icosahedron / Polyhedron Lattice)
    const wireGeo = new THREE.IcosahedronGeometry(1.28, 2);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xee3248,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    rootGroup.add(wireMesh);

    // Secondary finer wireframe
    const wireGeo2 = new THREE.IcosahedronGeometry(1.36, 1);
    const wireMat2 = new THREE.MeshBasicMaterial({
      color: 0xff6677,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const wireMesh2 = new THREE.Mesh(wireGeo2, wireMat2);
    rootGroup.add(wireMesh2);

    // 3. Neural Nodes (Points on Vertices)
    const posAttribute = wireGeo.getAttribute('position');
    const verticesCount = posAttribute.count;
    const nodeParticlesGeo = new THREE.BufferGeometry();
    const nodePositions = new Float32Array(verticesCount * 3);

    for (let i = 0; i < verticesCount * 3; i++) {
      nodePositions[i] = posAttribute.array[i];
    }
    nodeParticlesGeo.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));

    // Custom Canvas Texture for glowing circular particles
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.2, 'rgba(255, 60, 80, 0.9)');
      grad.addColorStop(0.6, 'rgba(235, 40, 60, 0.3)');
      grad.addColorStop(1, 'rgba(235, 40, 60, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
    }
    const particleTex = new THREE.CanvasTexture(canvas);

    const nodeParticlesMat = new THREE.PointsMaterial({
      size: 0.12,
      map: particleTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const nodePoints = new THREE.Points(nodeParticlesGeo, nodeParticlesMat);
    rootGroup.add(nodePoints);

    // 4. Ambient Floating Dust Sparks (Constellations)
    const dustCount = 90;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      const r = 1.35 + Math.random() * 0.45;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      dustPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      dustPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      dustPos[i * 3 + 2] = r * Math.cos(phi);
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.07,
      map: particleTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.8,
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    rootGroup.add(dustPoints);

    // 5. Central Reactor Red Glow (Point Light & Ambient)
    const coreLight = new THREE.PointLight(0xff3344, 4 * pulsingIntensity, 10);
    coreLight.position.set(0, 0, 0.4);
    scene.add(coreLight);

    const rimLight = new THREE.DirectionalLight(0xff7788, 1.5);
    rimLight.position.set(3, 4, 5);
    scene.add(rimLight);

    const ambientLight = new THREE.AmbientLight(0x221118, 1.5);
    scene.add(ambientLight);

    // Mouse Interaction
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mousePos.current.targetX = x * 0.4;
      mousePos.current.targetY = y * 0.4;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // Animation Loop
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth inertia rotation following mouse
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.05;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.05;

      rootGroup.rotation.y = elapsed * 0.22 + mousePos.current.x;
      rootGroup.rotation.x = Math.sin(elapsed * 0.15) * 0.1 + mousePos.current.y;
      wireMesh2.rotation.y = -elapsed * 0.18;
      dustPoints.rotation.y = elapsed * 0.08;

      // Pulsing heartbeat effect
      const pulse = 1 + Math.sin(elapsed * 2.5) * 0.03 * pulsingIntensity;
      wireMesh.scale.set(pulse, pulse, pulse);
      nodePoints.scale.set(pulse, pulse, pulse);
      coreLight.intensity = (3.5 + Math.sin(elapsed * 3.5) * 1.8) * pulsingIntensity;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      renderer.dispose();
      particleTex.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      wireGeo2.dispose();
      wireMat2.dispose();
      dustGeo.dispose();
      dustMat.dispose();
    };
  }, [size, interactive, pulsingIntensity]);

  return (
    <div
      ref={mountRef}
      onClick={onClick}
      className={`relative cursor-pointer select-none flex items-center justify-center transition-transform hover:scale-[1.02] active:scale-[0.98] ${className}`}
      style={{ width: size, height: size }}
    />
  );
};
