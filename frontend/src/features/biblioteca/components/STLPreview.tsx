import React from 'react';
import { STLModelViewer } from '../../../components/ui/stl-model-viewer';

interface STLPreviewProps {
  url: string;
  color?: string;
}

export const STLPreview: React.FC<STLPreviewProps> = ({ url, color }) => {
  return (
    <div className="w-full h-full bg-muted rounded-xl overflow-hidden">
      <STLModelViewer 
        url={url} 
        color={color} 
        autoRotate={true} 
        enableControls={false} 
        ambientIntensity={0.8}
      />
    </div>
  );
};
