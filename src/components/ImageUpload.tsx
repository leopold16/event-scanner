import React, { useRef } from 'react';
import { Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { extractDateFromImage } from '../utils/openai';

interface ImageUploadProps {
  onImageUpload: (file: File | null) => void;
  onDateExtracted: (date: string | null) => void;
  currentImage: File | null;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, onDateExtracted, currentImage }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
      setIsAnalyzing(true);
      try {
        const extractedDate = await extractDateFromImage(file);
        onDateExtracted(extractedDate);
      } catch (error) {
        console.error('Error analyzing image:', error);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const handleClearImage = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onImageUpload(null);
    onDateExtracted(null);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-sage-dark">Event Image (optional)</label>
      <div className="relative">
        <div
          className={cn(
            "w-full h-32 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition-colors",
            "hover:border-sage-accent hover:bg-sage-accent/5",
            currentImage ? "border-sage-accent" : "border-sage-accent/20"
          )}
          onClick={() => inputRef.current?.click()}
        >
          {currentImage ? (
            <div className="relative w-full h-full p-2">
              <img
                src={URL.createObjectURL(currentImage)}
                alt="Preview"
                className="w-full h-full object-contain rounded"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearImage();
                }}
                className="absolute top-1 right-1 p-1 bg-sage-dark/50 rounded-full hover:bg-sage-dark/70 transition-colors"
              >
                <X className="w-4 h-4 text-sage-light" />
              </button>
              {isAnalyzing && (
                <div className="absolute inset-0 bg-sage-dark/50 flex items-center justify-center rounded">
                  <Loader2 className="w-6 h-6 text-sage-light animate-spin" />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <ImageIcon className="w-8 h-8 mx-auto mb-2 text-sage-accent" />
              <p className="text-sm text-sage-dark">
                Click to upload an image
              </p>
              <p className="text-xs text-sage-dark/70 mt-1">
                We'll try to extract any dates from the image
              </p>
            </div>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ImageUpload;