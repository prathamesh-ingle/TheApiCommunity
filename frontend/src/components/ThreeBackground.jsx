// frontend/src/components/ThreeBackground.jsx
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const ParticleUniverse = () => {
  const ref = useRef();

  // Generate 2000 particles in a spherical distribution
  const [positions, colors] = useMemo(() => {
    const particleCount = 3000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Your brand colors
    const colorPalette = [
      new THREE.Color('#0A7294'), // Dark Teal
      new THREE.Color('#22B3AD'), // Cyan
      new THREE.Color('#FF9A3D'), // Orange
    ];

    for (let i = 0; i < particleCount; i++) {
      // Create a 3D sphere distribution
      const r = 12 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Assign a random brand color to each particle
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return [positions, colors];
  }, []);

  // Animate the 3D space on every frame
  useFrame((state) => {
    // 1. Slow continuous ambient rotation
    ref.current.rotation.y = state.clock.elapsedTime * 0.05;
    ref.current.rotation.x = state.clock.elapsedTime * 0.02;
    
    // 2. Smooth Interactive Mouse Parallax
    // The universe slightly tilts toward wherever the user moves their mouse
    const targetX = (state.pointer.x * Math.PI) / 8;
    const targetY = (state.pointer.y * Math.PI) / 8;
    
    // Lerp (smoothly interpolate) current rotation to target rotation
    ref.current.rotation.y += 0.05 * (targetX - ref.current.rotation.y);
    ref.current.rotation.x += 0.05 * (targetY - ref.current.rotation.x);
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.06}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending} // Makes overlapping particles glow brighter
      />
    </Points>
  );
};

export default function ThreeBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-60 mix-blend-multiply">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        {/* Soft ambient light */}
        <ambientLight intensity={0.5} />
        <ParticleUniverse />
      </Canvas>
    </div>
  );
}