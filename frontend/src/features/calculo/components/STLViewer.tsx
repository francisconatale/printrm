import React, { useEffect, useRef } from 'react';
import { Camera, Play, Pause } from 'lucide-react';
import { useTheme } from '../../../providers/ThemeProvider';
import { STLModelViewer } from '../../../components/ui/stl-model-viewer';

interface STLViewerProps {
  file: File | null;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  onInitialCapture?: (dataUrl: string) => void;
}

const COLORS = [
  { name: 'Ink', value: '#1d1d1f' },
  { name: 'Slate', value: '#7a7a7a' },
  { name: 'Chalk', value: '#ffffff' },
  { name: 'Action', value: '#0066cc' },
];

const isPresetColor = (color: string) => COLORS.some(c => c.value.toUpperCase() === color.toUpperCase());

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
  const colourInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
      {/* Color Selector */}
      <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-background/40 backdrop-blur-lg border border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
        {COLORS.map((c) => (
          <button
            key={c.value}
            onClick={() => onColorChange(c.value)}
            className={`size-4 rounded-full border transition-all hover:scale-125 active:scale-95 ${activeColor === c.value ? 'border-black/40 scale-110 shadow-sm' : 'border-black/5'}`}
            style={{ backgroundColor: c.value }}
            title={c.name}
          />
        ))}
        <div className="w-px h-4 bg-black/10" />
        <button
          onClick={() => colourInputRef.current?.click()}
          className={`size-4 rounded-full border transition-all hover:scale-125 active:scale-95 flex items-center justify-center ${
            !isPresetColor(activeColor)
              ? 'border-black/40 scale-110 shadow-sm'
              : 'border-dashed border-black/10 hover:border-black/30'
          }`}
          style={!isPresetColor(activeColor) ? { backgroundColor: activeColor } : {}}
          title="Color personalizado"
        >
          {isPresetColor(activeColor) && (
            <span className="text-[7px] font-bold text-black/30">+</span>
          )}
        </button>
        <input
          ref={colourInputRef}
          type="color"
          value={isPresetColor(activeColor) ? '#1d1d1f' : activeColor}
          onChange={(e) => onColorChange(e.target.value)}
          className="hidden"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5">
        <button 
          onClick={onToggleRotate}
          className="size-10 rounded-full bg-background/40 backdrop-blur-lg border border-white/20 flex items-center justify-center text-foreground hover:bg-background/90 transition-all active:scale-90 shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
          title={isAutoRotate ? "Pausar Rotación" : "Activar Rotación"}
        >
          {isAutoRotate ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button 
          onClick={onScreenshot}
          className="size-10 rounded-full bg-background/40 backdrop-blur-lg border border-white/20 flex items-center justify-center text-foreground hover:bg-background/90 transition-all active:scale-90 shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
          title="Capturar Render"
        >
          <Camera size={16} />
        </button>
      </div>
    </div>
  );
};

export const STLViewer: React.FC<STLViewerProps> = ({ file, canvasRef, onInitialCapture }) => {
  const { isDark } = useTheme();
  const canvasBg = isDark ? '#1c1c1e' : '#f5f5f7';
  const localCanvasRef = useRef<HTMLCanvasElement>(null);
  const activeCanvasRef = canvasRef || localCanvasRef;
  const [isLoading, setIsLoading] = React.useState(true);
  const [blobUrl, setBlobUrl] = React.useState<string | null>(null);
  const [activeColor, setActiveColor] = React.useState(COLORS[0].value);
  const [autoRotate, setAutoRotate] = React.useState(true);

  useEffect(() => {
    if (!file) {
      setBlobUrl(null);
      return;
    }
    if (file.size === 0) {
      // It's a placeholder file from the library, load directly from backend URL
      const backendUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/v1/biblioteca/files/${file.name}`;
      setBlobUrl(backendUrl);
      setIsLoading(true);
      return;
    }
    const url = URL.createObjectURL(file);
    setBlobUrl(url);
    setIsLoading(true);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleScreenshot = () => {
    const canvas = activeCanvasRef.current;
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
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 pointer-events-none" style={{ backgroundColor: canvasBg }}>
          <div className="size-8 border-2 border-foreground/10 border-t-foreground rounded-full animate-spin" />
          <p className="studio-caption text-muted-foreground">Renderizando...</p>
        </div>
      )}

      <ViewerControls 
        onScreenshot={handleScreenshot} 
        onToggleRotate={handleToggleRotate} 
        isAutoRotate={autoRotate}
        activeColor={activeColor}
        onColorChange={setActiveColor}
      />

      <STLModelViewer
        ref={activeCanvasRef}
        url={blobUrl}
        color={activeColor}
        autoRotate={autoRotate}
        enableControls={true}
        onLoaded={() => setIsLoading(false)}
        preserveDrawingBuffer={true}
        backgroundColor={canvasBg}
        showEnvironment={true}
        onInitialCapture={onInitialCapture}
      />
    </div>
  );
};
