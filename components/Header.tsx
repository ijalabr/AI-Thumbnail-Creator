
import React from 'react';
import { SparklesIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 shadow-lg sticky top-0 z-10">
      <div className="container mx-auto px-4 lg:px-8 py-4 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <SparklesIcon className="w-8 h-8 text-blue-400" />
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            AI YouTube Thumbnail Creator
          </h1>
        </div>
      </div>
    </header>
  );
};
