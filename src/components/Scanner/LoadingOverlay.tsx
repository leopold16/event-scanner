import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  message: string;
}

export function LoadingOverlay({ message }: LoadingOverlayProps) {
  return (
    <div className="absolute inset-0 bg-sage-dark/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 shadow-lg flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-sage-accent animate-spin" />
        <p className="text-sage-dark text-center">{message}</p>
      </div>
    </div>
  );
}