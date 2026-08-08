// ============================================================
// LOADING SCREEN COMPONENT
// ============================================================

import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  progress: number;
  currentStep: string;
}

export const LoadingScreen = ({ progress, currentStep }: LoadingScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center space-y-8 p-8">
        {/* Logo Animation */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center animate-pulse">
            <span className="text-4xl">🧠</span>
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          </div>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            AI Mutual Fund Engine PRO
          </h1>
          <p className="text-purple-300 text-lg">
            Enterprise Investment Intelligence
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-80 mx-auto">
          <div className="flex justify-between text-sm text-purple-300 mb-2">
            <span>{currentStep}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-3 gap-4 text-xs text-purple-400">
          <div className={`p-2 rounded ${progress >= 20 ? 'text-green-400' : ''}`}>
            {progress >= 20 ? '✓' : '○'} NAV Data
          </div>
          <div className={`p-2 rounded ${progress >= 45 ? 'text-green-400' : ''}`}>
            {progress >= 45 ? '✓' : '○'} Returns
          </div>
          <div className={`p-2 rounded ${progress >= 65 ? 'text-green-400' : ''}`}>
            {progress >= 65 ? '✓' : '○'} AI Analysis
          </div>
        </div>

        {/* Fund Count */}
        <div className="text-purple-400 text-sm">
          Processing <span className="text-white font-bold">15</span> curated funds
        </div>
      </div>
    </div>
  );
};
