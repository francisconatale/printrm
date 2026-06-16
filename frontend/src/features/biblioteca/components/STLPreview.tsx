import React, { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { Center } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

interface STLPreviewProps {
  url: string;
  color?: string;
}

function Model({ url, color = '#7a7a7a' }: { url: string; color?: string }) {
  const geometry = useLoader(STLLoader, url);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <Center>
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial 
          color={color} 
          metalness={0.4} 
          roughness={0.6} 
        />
      </mesh>
    </Center>
  );
}

export const STLPreview: React.FC<STLPreviewProps> = ({ url, color }) => {
  return (
    <div className="w-full h-full bg-[#f9f9fb] rounded-xl overflow-hidden">
      <Canvas
        shadows
        camera={{ position: [0, 0, 100], fov: 45 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[100, 100, 100]} intensity={1} />
        <Suspense fallback={null}>
          <Model url={url} color={color} />
        </Suspense>
      </Canvas>
    </div>
  );
};
