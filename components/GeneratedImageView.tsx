import React, { useState, useEffect } from 'react';
import { SparklesIcon, DownloadIcon } from './icons/AdIcons';

interface GeneratedImageViewProps {
  generatedImage: string | null;
  generatedText: string | null;
  isLoading: boolean;
  error: string | null;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full">
        <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-slate-400">正在生成您的杰作...</p>
        <p className="text-sm text-slate-500">这可能需要一些时间。</p>
    </div>
);

const GeneratedImageView: React.FC<GeneratedImageViewProps> = ({ generatedImage, generatedText, isLoading, error }) => {
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (generatedImage) {
      setShowSuccess(true);
    }
    if (isLoading) {
      setShowSuccess(false);
    }
  }, [generatedImage, isLoading]);

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'ad-mockup-magic.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowSuccess(false);
  };

  return (
    <div className="flex-grow flex items-center justify-center w-full h-full min-h-[300px] bg-slate-900/50 rounded-lg p-4">
      {isLoading && <LoadingSpinner />}
      
      {!isLoading && error && (
        <div className="text-center text-red-400">
          <h3 className="font-bold text-lg">生成失败</h3>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {!isLoading && !error && !generatedImage && (
        <div className="text-center text-slate-500">
          <SparklesIcon />
          <h3 className="font-bold text-lg mt-2">您的广告模型将在此处显示</h3>
          <p className="text-sm">请完成左侧的步骤以开始。</p>
        </div>
      )}

      {!isLoading && !error && generatedImage && (
        <div className="w-full flex flex-col items-center">
            <img 
              src={generatedImage} 
              alt="AI 生成的广告模型图" 
              loading="lazy"
              className="w-full h-auto object-contain rounded-md shadow-2xl" 
            />
            {generatedText && <p className="text-sm text-slate-400 mt-4 p-3 bg-slate-800 rounded-md w-full">{generatedText}</p>}
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                 <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-2 py-2 px-6 text-sm font-bold text-white rounded-lg bg-emerald-600 hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105"
                >
                    <DownloadIcon />
                    下载图片
                </button>
                {showSuccess && (
                    <p className="text-sm text-emerald-400">
                        已成功生成并可下载！
                    </p>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default GeneratedImageView;