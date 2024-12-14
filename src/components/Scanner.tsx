import React, { useRef, useEffect, useState } from 'react';
import { Camera, X } from 'lucide-react';
import { extractDateFromImage } from '../utils/openai';
import { DetectedEvent } from '../types/event';

interface ScannerProps {
  onEventsDetected: (events: DetectedEvent[]) => void;
  isProcessing: boolean;
}

export default function Scanner({ onEventsDetected, isProcessing }: ScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>('');
  const [showDetectedAnimation, setShowDetectedAnimation] = useState(false);
  const lastProcessedTimeRef = useRef<number>(0);
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
        setError('');
      }
    } catch (err) {
      setError('Unable to access camera. Please ensure you have granted camera permissions.');
      console.error('Error accessing camera:', err);
    }
  };

  const stopScanning = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsScanning(false);
    }
  };

  const captureFrame = async () => {
    if (!isScanning || isProcessing || !videoRef.current || !canvasRef.current) return;

    const now = Date.now();
    const timeSinceLastProcess = now - lastProcessedTimeRef.current;
    
    // Prevent processing if we're within the cooldown period
    if (timeSinceLastProcess < 2000) return;

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (!context) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise<Blob>((resolve) => 
        canvas.toBlob(blob => resolve(blob!), 'image/jpeg', 0.8)
      );
      
      const file = new File([blob], 'scan.jpg', { type: 'image/jpeg' });
      const events = await extractDateFromImage(file);
      
      if (events && events.length > 0) {
        // Show "Dates Detected" animation
        setShowDetectedAnimation(true);
        lastProcessedTimeRef.current = now;
        
        // Clear any existing timeout
        if (processingTimeoutRef.current) {
          clearTimeout(processingTimeoutRef.current);
        }
        
        // Set a timeout to hide the animation
        processingTimeoutRef.current = setTimeout(() => {
          setShowDetectedAnimation(false);
        }, 2000);
        
        onEventsDetected(events);
      }
    } catch (err) {
      console.error('Error processing frame:', err);
    }
  };

  useEffect(() => {
    if (!isScanning) return;
    const interval = setInterval(captureFrame, 500);
    return () => clearInterval(interval);
  }, [isScanning, isProcessing]);

  useEffect(() => {
    return () => {
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
      stopScanning();
    };
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
        className={`w-full h-full object-cover transition-all duration-300
          ${isProcessing || showDetectedAnimation ? 'blur-sm' : ''}`}
      />
      
      <canvas ref={canvasRef} className="hidden" />
      
      {!isScanning ? (
        <button
          onClick={startScanning}
          className="absolute inset-0 flex flex-col items-center justify-center bg-sage-light/90"
        >
          <Camera className="w-12 h-12 mb-4 text-sage-accent" />
          <p className="text-sage-dark">Tap to start scanning</p>
        </button>
      ) : (
        <button
          onClick={stopScanning}
          className="absolute top-4 right-4 p-2 bg-sage-dark/50 rounded-full"
        >
          <X className="w-6 h-6 text-sage-light" />
        </button>
      )}
      
      {showDetectedAnimation && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-sage-dark/90 px-6 py-3 rounded-full animate-bounce">
            <p className="text-sage-light font-medium">Dates Detected!</p>
          </div>
        </div>
      )}
      
      {isProcessing && (
        <div className="absolute inset-0 bg-sage-dark/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <p className="text-sage-dark">Processing detected text...</p>
          </div>
        </div>
      )}
      
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
        <p className="text-sage-light text-sm text-center">
          {isScanning ? 'Point camera at text containing dates' : 'Scanner ready'}
        </p>
      </div>
    </div>
  );
}