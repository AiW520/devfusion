"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Text } from "@react-three/drei";
import * as THREE from "three";

interface Track {
  id: string;
  name: string;
  slug: string;
  color: string;
  techStack: string;
}

function OrbitingParticles({ tracks }: { tracks: Track[] }) {
  const groupRef = useRef<THREE.Group>(null);

  const orbits = useMemo(() => {
    return tracks.map((track, i) => {
      const radius = 3 + i * 1.5;
      const particleCount = 120;
      const particles: { position: [number, number, number]; color: string }[] =
        [];
      for (let j = 0; j < particleCount; j++) {
        const angle = (j / particleCount) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (Math.random() - 0.5) * 0.3;
        particles.push({ position: [x, y, z], color: track.color });
      }
      return { radius, particles, track, speed: 0.1 + i * 0.05 };
    });
  }, [tracks]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      const orbit = orbits[i];
      if (orbit) {
        child.rotation.y += orbit.speed * delta;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {orbits.map((orbit, i) => (
        <group key={i}>
          {/* Ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[orbit.radius, 0.01, 16, 200]} />
            <meshBasicMaterial
              color={orbit.track.color}
              transparent
              opacity={0.15}
            />
          </mesh>
          {/* Particles */}
          {orbit.particles.map((p, j) => (
            <mesh key={j} position={p.position}>
              <sphereGeometry args={[0.03, 8, 8]} />
              <meshBasicMaterial color={p.color} transparent opacity={0.7} />
            </mesh>
          ))}
          {/* Label */}
          <Text
            position={[orbit.radius + 0.5, 0, 0]}
            fontSize={0.2}
            color={orbit.track.color}
            anchorX="left"
          >
            {orbit.track.name}
          </Text>
        </group>
      ))}
    </group>
  );
}

export function StarOrbitCanvas({ tracks }: { tracks: Track[] }) {
  return (
    <Canvas
      camera={{ position: [0, 6, 12], fov: 50 }}
      style={{ position: "absolute", inset: 0, zIndex: 0 }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#3B82F6" />
      <Stars
        radius={50}
        depth={50}
        count={1000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />
      <OrbitingParticles tracks={tracks} />
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.3}
        maxPolarAngle={Math.PI / 2}
        minDistance={5}
        maxDistance={20}
      />
    </Canvas>
  );
}
