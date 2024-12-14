import React from 'react';
import { Camera, X } from 'lucide-react';

interface ScannerControlsProps {
  isScanning: boolean;
  onStartScan: () => void;
  onStopScan: () => void;
}

export function ScannerControls({ isScanning, onStartScan, onStopScan }: ScannerControlsProps) {
  if (!isScanning) {
    return (
      <button
        onClick={onStartScan}
        className="absolute inset-0 flex flex-col items-center justify-center bg-sage-light/90"
      >
        <Camera className="w-12 h-12 mb-4 text-sage-accent" />
        <p className="text-sage-dark">Tap to start scanning</p>
      </button>
    );
  }

  return (
    <button
      onClick={onStopScan}
      className="absolute top-4 right-4 p-2 bg-sage-dark/50 rounded-full hover:bg-sage-dark/70 transition-colors"
    >
      <X className="w-6 h-6 text-sage-light" />
    </button>
  );
}