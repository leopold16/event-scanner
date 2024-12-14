import React, { useRef, useEffect, useState } from 'react';
import { LoadingOverlay } from './LoadingOverlay';
import { ScannerStatus } from './ScannerStatus';
import { ScannerControls } from './ScannerControls';
import { useScannerState } from '../../hooks/useScannerState';
import { DetectedEvent } from '../../types/event';

interface ScannerProps {
  onEventsDetected: (events: DetectedEvent[]) => void;
  isProcessing: boolean;
}

export default function Scanner({ onEventsDetected, isProcessing }: ScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    isScanning,
    error,
    isAnalyzing,
    startScanning,
    stopScanning,
    processFrame
  } = useScannerState({
    onEventsDetected,
    videoRef,
    canvasRef
  });

  useEffect(() => {
    if (!isScanning || isProcessing || isAnalyzing) return;
    const interval = setInterval(processFrame, 500);
    return () => clearInterval(interval);
  }, [isScanning, isProcessing, isAnalyzing, processFrame]);

  useEffect(() => {
    return () => stopScanning();
  }, []);

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50/90 p-4">
          <p className="text-red-700 text-center">{error}</p>
        </div>
      )}
      
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`w-full h-full object-cover transition-opacity duration-300
          ${isScanning ? 'opacity-100' : 'opacity-0'}
          ${(isProcessing || isAnalyzing) ? 'blur-sm' : ''}`}
      />
      
      <canvas ref={canvasRef} className="hidden" />
      
      <ScannerControls
        isScanning={isScanning}
        onStartScan={startScanning}
        onStopScan={stopScanning}
      />
      
      {(isProcessing || isAnalyzing) && (
        <LoadingOverlay 
          message={isProcessing ? "Processing detected dates..." : "Analyzing image..."}
        />
      )}
      
      <ScannerStatus isScanning={isScanning} />
    </div>
  );
}