import { useState, useCallback, RefObject } from 'react';
import { extractDateFromImage } from '../utils/openai';
import { DetectedEvent } from '../types/event';

interface UseScannerStateProps {
  onEventsDetected: (events: DetectedEvent[]) => void;
  videoRef: RefObject<HTMLVideoElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
}

export function useScannerState({
  onEventsDetected,
  videoRef,
  canvasRef
}: UseScannerStateProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastProcessedTime, setLastProcessedTime] = useState<number>(0);

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

  const stopScanning = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsScanning(false);
    }
  }, []);

  const processFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || isAnalyzing) return;

    const now = Date.now();
    if (now - lastProcessedTime < 2000) return;

    try {
      setIsAnalyzing(true);
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
        setLastProcessedTime(now);
        onEventsDetected(events);
      }
    } catch (err) {
      console.error('Error processing frame:', err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [lastProcessedTime, isAnalyzing, onEventsDetected]);

  return {
    isScanning,
    error,
    isAnalyzing,
    startScanning,
    stopScanning,
    processFrame
  };
}