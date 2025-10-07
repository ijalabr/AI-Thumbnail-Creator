
import React, { useRef } from 'react';
import { THUMBNAIL_STYLES } from '../constants';
import { ThumbnailStyle } from '../types';
import { MagicWandIcon, LoaderIcon, UploadIcon, XCircleIcon } from './Icons';
import { UploadedImage } from '../App';

interface ControlPanelProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  title: string;
  setTitle: (title: string) => void;
  style: ThumbnailStyle;
  setStyle: (style: ThumbnailStyle) => void;
  isLoading: boolean;
  onGenerate: () => void;
  uploadedImage: UploadedImage | null;
  setUploadedImage: (image: UploadedImage | null) => void;
}

const fileToBase64 = (file: File): Promise<UploadedImage> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      resolve({ data: base64Data, mimeType: file.type });
    };
    reader.onerror = (error) => reject(error);
  });


export const ControlPanel: React.FC<ControlPanelProps> = ({
  prompt,
  setPrompt,
  title,
  setTitle,
  style,
  setStyle,
  isLoading,
  onGenerate,
  uploadedImage,
  setUploadedImage
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStyle = THUMBNAIL_STYLES.find(s => s.name === e.target.value);
    if (selectedStyle) {
      setStyle(selectedStyle);
    }
  };
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const image = await fileToBase64(file);
        setUploadedImage(image);
      } catch (error) {
        console.error("Error converting file to base64", error);
        setUploadedImage(null);
      }
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setUploadedImage(null);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl h-full flex flex-col space-y-6">
      <h2 className="text-xl font-bold text-center text-blue-300">Thumbnail Settings</h2>
      
      <div className="space-y-2">
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-300">
          1. {uploadedImage ? 'Describe Your Edits' : 'Describe Your Thumbnail'}
        </label>
        <textarea
          id="prompt"
          rows={3}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 placeholder:text-gray-500"
          placeholder={uploadedImage ? "e.g., Make the background cinematic" : "e.g., A robot holding a red skateboard."}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>

      <div className="flex items-center">
          <div className="flex-grow border-t border-gray-600"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-xs font-semibold">OR</span>
          <div className="flex-grow border-t border-gray-600"></div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          2. Upload an Image to Edit
        </label>
        {uploadedImage ? (
          <div className="flex items-center space-x-3 bg-gray-900 border border-gray-700 rounded-lg p-2">
            <img src={`data:${uploadedImage.mimeType};base64,${uploadedImage.data}`} alt="upload preview" className="w-12 h-12 object-cover rounded-md" />
            <p className="text-sm text-gray-300 flex-grow truncate">Image ready to edit</p>
            <button onClick={handleRemoveImage} className="p-1 text-gray-400 hover:text-white transition-colors">
              <XCircleIcon className="w-6 h-6" />
            </button>
          </div>
        ) : (
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/jpeg, image/webp"
            />
            <button onClick={handleUploadClick} className="w-full flex items-center justify-center border-2 border-dashed border-gray-600 hover:border-blue-500 text-gray-400 hover:text-blue-400 font-bold py-3 px-4 rounded-lg transition duration-300">
              <UploadIcon className="mr-2 h-5 w-5" />
              Click to upload
            </button>
          </>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium text-gray-300">
          3. Add Overlay Text
        </label>
        <input
          type="text"
          id="title"
          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 placeholder:text-gray-500"
          placeholder="e.g., MY NEW SKILLS"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="style" className="block text-sm font-medium text-gray-300">
          4. Choose a Style (for new images)
        </label>
        <select
          id="style"
          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          value={style.name}
          onChange={handleStyleChange}
          disabled={!!uploadedImage}
        >
          {THUMBNAIL_STYLES.map((s) => (
            <option key={s.name} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="pt-2 flex-grow flex items-end">
        <button
          onClick={onGenerate}
          disabled={isLoading || !prompt}
          className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-lg transform hover:scale-105 disabled:scale-100"
        >
          {isLoading ? (
            <>
              <LoaderIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              Processing...
            </>
          ) : (
            <>
              <MagicWandIcon className="mr-2 h-5 w-5" />
              {uploadedImage ? 'Edit & Create Thumbnail' : 'Generate Thumbnail'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};
