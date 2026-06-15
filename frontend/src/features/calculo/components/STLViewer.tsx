import React, { Suspense, useMemo, useEffect, useRef, Component } from 'react';
import * as THREE from 'three';
import { Canvas, useLoader, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Center, Environment } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { Camera, Play, Pause } from 'lucide-react';

interface STLViewerProps {
  file: File | null;
}

const COLORS = [
  { name: 'Ink', value: '#1d1d1f' },
  { name: 'Slate', value: '#7a7a7a' },
  { name: 'Chalk', value: '#ffffff' },
  { name: 'Action', value: '#0066cc' },
];

class STLErrorBoundary extends Component<
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

function Model({ url, onLoaded, color }: { url: string; onLoaded: () => void, color: string }) {
  const geometry = useLoader(STLLoader, url);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { onLoaded(); }, [geometry]);

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

const ViewerControls = ({ 
  onScreenshot, 
  onToggleRotate, 
  isAutoRotate,
  activeColor, 
  onColorChange 
}: { 
  onScreenshot: () => void, 
  onToggleRotate: () => void,
  isAutoRotate: boolean,
  activeColor: string,
  onColorChange: (color: string) => void
}) => {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
      {/* Color Selector */}
      <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/40 backdrop-blur-lg border border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
        {COLORS.map((c) => (
          <button
            key={c.value}
            onClick={() => onColorChange(c.value)}
            className={`size-4 rounded-full border transition-all hover:scale-125 active:scale-95 ${activeColor === c.value ? 'border-black/40 scale-110 shadow-sm' : 'border-black/5'}`}
            style={{ backgroundColor: c.value }}
            title={c.name}
          />
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5">
        <button 
          onClick={onToggleRotate}
          className="size-10 rounded-full bg-white/40 backdrop-blur-lg border border-white/20 flex items-center justify-center text-[#1d1d1f] hover:bg-white/90 transition-all active:scale-90 shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
          title={isAutoRotate ? "Pausar Rotación" : "Activar Rotación"}
        >
          {isAutoRotate ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button 
          onClick={onScreenshot}
          className="size-10 rounded-full bg-white/40 backdrop-blur-lg border border-white/20 flex items-center justify-center text-[#1d1d1f] hover:bg-white/90 transition-all active:scale-90 shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
          title="Capturar Render"
        >
          <Camera size={16} />
        </button>
      </div>
    </div>
  );
};

export const STLViewer: React.FC<STLViewerProps> = ({ file }) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [blobUrl, setBlobUrl] = React.useState<string | null>(null);
  const [activeColor, setActiveColor] = React.useState(COLORS[0].value);
  const [autoRotate, setAutoRotate] = React.useState(true);

  useEffect(() => {
    if (!file) {
      setBlobUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setBlobUrl(url);
    setIsLoading(true);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleScreenshot = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.setAttribute('download', `render-${file?.name || 'modelo'}.png`);
      link.setAttribute('href', canvas.toDataURL('image/png'));
      link.click();
    }
  };

  const handleToggleRotate = () => {
    setAutoRotate(!autoRotate);
  };

  if (!file || !blobUrl) return null;

  return (
    <div className="w-full h-full relative group">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#f5f5f7] pointer-events-none">
          <div className="size-8 border-2 border-[#1d1d1f]/10 border-t-[#1d1d1f] rounded-full animate-spin" />
          <p className="studio-caption text-[#7a7a7a]">Renderizando...</p>
        </div>
      )}

      <ViewerControls 
        onScreenshot={handleScreenshot} 
        onToggleRotate={handleToggleRotate} 
        isAutoRotate={autoRotate}
        activeColor={activeColor}
        onColorChange={setActiveColor}
      />

      <STLErrorBoundary>
        <Canvas
          gl={{ antialias: true, preserveDrawingBuffer: true }}
          camera={{ position: [0, 0, 5], fov: 45 }}
          style={{ width: '100%', height: '100%' }}
        >
          <color attach="background" args={['#f5f5f7']} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          
          <Suspense fallback={null}>
            <Model url={blobUrl} color={activeColor} onLoaded={() => setIsLoading(false)} />
            <Environment preset="studio" />
          </Suspense>
          
          <OrbitControls
            ref={controlsRef}
            autoRotate={autoRotate}
            autoRotateSpeed={0.8}
            enableDamping
            enablePan={false}
            enableZoom={true}
            minDistance={2}
            maxDistance={500}
          />
        </Canvas>
      </STLErrorBoundary>
    </div>
  );
};
