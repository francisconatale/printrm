import React, { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useLoader, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Center, Environment } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

interface STLModelViewerProps {
  url: string;
  color?: string;
  autoRotate?: boolean;
  enableControls?: boolean;
  onLoaded?: () => void;
  preserveDrawingBuffer?: boolean;
  backgroundColor?: string;
  ambientIntensity?: number;
  showEnvironment?: boolean;
}

class STLErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-red-50 rounded-2xl p-6 text-center">
          <p className="text-red-600 font-semibold studio-body-strong">Error al cargar el modelo</p>
          <p className="text-red-400 text-xs font-mono">{(this.state.error as Error).message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

function CameraRig({ geometry }: { geometry: THREE.BufferGeometry }) {
  const { camera } = useThree();
  const fitted = useRef(false);

  useFrame(() => {
    if (fitted.current) return;
    geometry.computeBoundingBox();
    const box = geometry.boundingBox as THREE.Box3;
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = (camera as THREE.PerspectiveCamera).fov * (Math.PI / 180);
    const dist = Math.abs(maxDim / (2 * Math.tan(fov / 2))) * 2.2;
    camera.position.set(center.x + dist * 0.5, center.y + dist * 0.5, center.z + dist);
    camera.lookAt(center);
    camera.updateProjectionMatrix();
    fitted.current = true;
  });

  return null;
}

function Model({ url, onLoaded, color = '#7a7a7a' }: { url: string; onLoaded?: () => void, color?: string }) {
  const geometry = useLoader(STLLoader, url);

  useEffect(() => {
    if (onLoaded) onLoaded();
  }, [geometry, onLoaded]);

  return (
    <>
      <Center>
        <mesh geometry={geometry}>
          <meshStandardMaterial 
            color={color} 
            metalness={0.6} 
            roughness={0.4} 
          />
        </mesh>
      </Center>
      <CameraRig geometry={geometry} />
    </>
  );
}

export const STLModelViewer = React.forwardRef<HTMLCanvasElement, STLModelViewerProps>(({
  url,
  color = '#7a7a7a',
  autoRotate = true,
  enableControls = true,
  onLoaded,
  preserveDrawingBuffer = false,
  backgroundColor,
  ambientIntensity = 0.5,
  showEnvironment = false
}, ref) => {
  return (
    <div className="w-full h-full relative">
      <STLErrorBoundary>
        <Canvas
          ref={ref}
          gl={{ antialias: true, preserveDrawingBuffer }}
          camera={{ position: [0, 0, 100], fov: 45 }}
          style={{ width: '100%', height: '100%' }}
        >
          {backgroundColor && <color attach="background" args={[backgroundColor]} />}
          <ambientLight intensity={ambientIntensity} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          
          <Suspense fallback={null}>
            <Model url={url} color={color} onLoaded={onLoaded} />
            {showEnvironment && <Environment preset="studio" />}
          </Suspense>
          
          <OrbitControls
            autoRotate={autoRotate}
            autoRotateSpeed={0.8}
            enableDamping
            enablePan={false}
            enableZoom={enableControls}
            enableRotate={enableControls}
            minDistance={2}
            maxDistance={500}
          />
        </Canvas>
      </STLErrorBoundary>
    </div>
  );
});

STLModelViewer.displayName = 'STLModelViewer';
