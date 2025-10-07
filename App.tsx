
import React, { useState, useCallback } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { ThumbnailCanvas } from './components/ThumbnailCanvas';
import { Header } from './components/Header';
import { ThumbnailStyle } from './types';
import { generateImage, editImage } from './services/geminiService';
import { THUMBNAIL_STYLES } from './constants';

export interface UploadedImage {
  data: string; // base64 encoded
  mimeType: string;
}

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('A developer coding on a laptop with glowing keys in a dark room');
  const [title, setTitle] = useState<string>('CODE FASTER WITH AI');
  const [style, setStyle] = useState<ThumbnailStyle>(THUMBNAIL_STYLES[0]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt) return;
    
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    
    try {
      let imageB64: string;
      if (uploadedImage) {
        const imagePart = { inlineData: uploadedImage };
        // The prompt for editing is simpler, as the style is inherent in the image
        const editPrompt = `${prompt}, high quality, professional youtube thumbnail`;
        imageB64 = await editImage(editPrompt, imagePart);
      } else {
        const fullPrompt = `${style.prompt}, ${prompt}, youtube thumbnail`;
        imageB64 = await generateImage(fullPrompt);
      }
      setGeneratedImage(`data:image/jpeg;base64,${imageB64}`);
    } catch (err) {
      console.error(err);
      setError('Failed to process image. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, style, uploadedImage]);

  const handleImageUpload = (image: UploadedImage | null) => {
    setUploadedImage(image);
    setGeneratedImage(null);
    setFinalImage(null);
    setError(null);
    if(image) {
      setPrompt('Add a glowing blue aura around the main subject');
    } else {
      setPrompt('A developer coding on a laptop with glowing keys in a dark room');
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          <div className="lg:col-span-4">
            <ControlPanel
              prompt={prompt}
              setPrompt={setPrompt}
              title={title}
              setTitle={setTitle}
              style={style}
              setStyle={setStyle}
              isLoading={isLoading}
              onGenerate={handleGenerate}
              uploadedImage={uploadedImage}
              setUploadedImage={handleImageUpload}
            />
          </div>
          <div className="lg:col-span-8">
            <ThumbnailCanvas
              baseImage={generatedImage}
              title={title}
              setFinalImage={setFinalImage}
              finalImage={finalImage}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
