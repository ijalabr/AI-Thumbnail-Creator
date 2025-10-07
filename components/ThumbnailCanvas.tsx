
import React, { useRef, useEffect } from 'react';
import { THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT } from '../constants';
import { DownloadIcon, LoaderIcon, ImageIcon } from './Icons';

interface ThumbnailCanvasProps {
  baseImage: string | null;
  title: string;
  setFinalImage: (dataUrl: string | null) => void;
  finalImage: string | null;
  isLoading: boolean;
  error: string | null;
}

export const ThumbnailCanvas: React.FC<ThumbnailCanvasProps> = ({
  baseImage,
  title,
  setFinalImage,
  finalImage,
  isLoading,
  error,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!baseImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = baseImage;

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Text styling
      const uppercaseTitle = title.toUpperCase();
      let fontSize = 110;
      ctx.font = `bold ${fontSize}px Anton, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Adjust font size to fit canvas width
      const maxWidth = canvas.width * 0.9;
      while (ctx.measureText(uppercaseTitle).width > maxWidth) {
        fontSize--;
        ctx.font = `bold ${fontSize}px Anton, sans-serif`;
      }
      
      // Text drawing
      const x = canvas.width / 2;
      const y = canvas.height / 2;
      
      // Add a semi-transparent background for better readability
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      const textMetrics = ctx.measureText(uppercaseTitle);
      const textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
      ctx.fillRect(x - textMetrics.width / 2 - 20, y - textHeight / 2 - 20, textMetrics.width + 40, textHeight + 40);


      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 8;
      ctx.lineJoin = 'round';

      ctx.strokeText(uppercaseTitle, x, y);
      ctx.fillText(uppercaseTitle, x, y);

      setFinalImage(canvas.toDataURL('image/jpeg'));
    };
    
    img.onerror = () => {
        console.error("Failed to load base image for canvas.");
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseImage, title]);

  const handleDownload = () => {
    if (!finalImage) return;
    const link = document.createElement('a');
    link.download = 'youtube-thumbnail.jpg';
    link.href = finalImage;
    link.click();
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <LoaderIcon className="w-16 h-16 animate-spin text-blue-500" />
          <p className="mt-4 text-lg">Generating your masterpiece...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-red-400">
          <p className="text-lg font-semibold">Oops! Something went wrong.</p>
          <p className="mt-2 text-sm text-center max-w-sm">{error}</p>
        </div>
      );
    }
    
    if (!baseImage) {
        return (
             <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <ImageIcon className="w-24 h-24" />
                <p className="mt-4 text-xl">Your thumbnail will appear here</p>
                <p className="text-sm">Fill out the form and click "Generate"</p>
             </div>
        )
    }

    return (
      <img
        src={finalImage || baseImage}
        alt="Generated thumbnail"
        className="object-contain w-full h-full rounded-lg"
      />
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 p-4 rounded-2xl shadow-2xl">
      <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
        {renderContent()}
        <canvas
            ref={canvasRef}
            width={THUMBNAIL_WIDTH}
            height={THUMBNAIL_HEIGHT}
            className="hidden"
          />
      </div>
      <div className="mt-4">
        <button
          onClick={handleDownload}
          disabled={!finalImage || isLoading}
          className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-lg"
        >
          <DownloadIcon className="mr-2 h-5 w-5" />
          Download Thumbnail
        </button>
      </div>
    </div>
  );
};
