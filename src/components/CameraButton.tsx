import React from 'react';
import { Camera } from 'lucide-react';

interface CameraButtonProps {
  isProcessing: boolean;
  onCapture: (file: File) => void;
}

export function CameraButton({ isProcessing, onCapture }: CameraButtonProps) {
  return (
    <label className="block">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => e.target.files?.[0] && onCapture(e.target.files[0])}
        className="hidden"
      />
      <div 
        className={`
          w-full aspect-square rounded-2xl border-2 border-dashed
          border-sage-accent/20 flex flex-col items-center justify-center
          cursor-pointer transition-all duration-200
          hover:border-sage-accent hover:bg-sage-accent/5
          ${isProcessing ? 'bg-sage-accent/5' : 'bg-white'}
        `}
      >
        <Camera 
          className={`
            w-12 h-12 mb-4 transition-all duration-200
            ${isProcessing ? 'text-sage-accent animate-pulse' : 'text-sage-accent/50'}
          `}
        />
        <p className="text-sage-dark/80 text-sm">
          {isProcessing ? 'Processing image...' : 'Tap to take photo'}
        </p>
      </div>
    </label>
  );
}