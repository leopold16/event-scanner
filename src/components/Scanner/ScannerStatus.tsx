import React from 'react';

interface ScannerStatusProps {
  isScanning: boolean;
}

export function ScannerStatus({ isScanning }: ScannerStatusProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
      <p className="text-sage-light text-sm text-center">
        {isScanning ? 'Point camera at text containing dates' : 'Scanner ready'}
      </p>
    </div>
  );
}