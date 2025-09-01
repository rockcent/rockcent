import React, { useState, useCallback } from 'react';
import ImageUploader from './components/ImageUploader';
import AdFormatSelector from './components/AdFormatSelector';
import GeneratedImageView from './components/GeneratedImageView';
import ToggleSwitch from './components/ToggleSwitch';
import { generateAdImage } from './services/geminiService';
import { AD_FORMATS } from './constants';
import type { AdFormat } from './types';
import { ResetIcon } from './components/icons/AdIcons';

const App: React.FC = () => {
  const [productImages, setProductImages] = useState<Array<{ base64: string; mimeType: string; }>>([]);
  const [selectedAdFormat, setSelectedAdFormat] = useState<AdFormat | null>(null);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [productDescription, setProductDescription] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [imageUploaderKey, setImageUploaderKey] = useState(Date.now());
  const [isHighRes, setIsHighRes] = useState<boolean>(false);

  const handleImageAdd = (base64: string, mimeType: string) => {
    setProductImages(prevImages => [...prevImages, { base64, mimeType }]);
    setValidationError(null);
  };

  const handleImageRemove = (indexToRemove: number) => {
    setProductImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
  };

  const handleAdFormatSelect = (format: AdFormat) => {
    setSelectedAdFormat(format);
    setCustomPrompt(format.prompt);
    setValidationError(null);
  };

  const handleReset = useCallback(() => {
    setProductImages([]);
    setSelectedAdFormat(null);
    setGeneratedImage(null);
    setGeneratedText(null);
    setError(null);
    setValidationError(null);
    setIsLoading(false);
    setImageUploaderKey(Date.now());
    setCustomPrompt('');
    setProductDescription('');
    setIsHighRes(false);
  }, []);

  const handleGenerateClick = useCallback(async () => {
    if (productImages.length === 0) {
      setValidationError("请至少上传一张产品图片。");
      return;
    }
    if (!selectedAdFormat) {
      setValidationError("请选择一个广告格式。");
      return;
    }
     if (!customPrompt.trim()) {
      setValidationError("提示词不能为空。");
      return;
    }

    setValidationError(null);
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setGeneratedText(null);

    try {
      const result = await generateAdImage(
        productImages,
        customPrompt,
        productDescription,
        isHighRes
      );
      setGeneratedImage(result.imageUrl);
      setGeneratedText(result.text);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "发生未知错误，请检查控制台。");
    } finally {
      setIsLoading(false);
    }
  }, [productImages, selectedAdFormat, customPrompt, productDescription, isHighRes]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
            广告魔术手
          </h1>
          <p className="mt-2 text-lg text-slate-400">
            上传您的产品，选择一个场景，见证 AI 的魔法。
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-8 p-6 bg-slate-800/50 rounded-2xl border border-slate-700 shadow-lg">
            <div>
              <h2 className="text-2xl font-bold mb-1 text-slate-200">1. 上传您的产品</h2>
              <p className="text-slate-400 mb-4">上传一张或多张背景透明或简洁的清晰产品图片。</p>
              <ImageUploader
                key={imageUploaderKey}
                images={productImages}
                onImageAdd={handleImageAdd}
                onImageRemove={handleImageRemove}
              />
              {productImages.length > 0 && (
                <div className="mt-4">
                    <label htmlFor="product-description" className="block text-sm font-medium text-slate-300 mb-2">
                        描述您的产品 (可选)
                    </label>
                    <input
                        id="product-description"
                        type="text"
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-200 text-slate-200 placeholder-slate-500"
                        placeholder="例如：一双红色跑鞋，帮助 AI 更好地识别"
                        aria-describedby="product-description-helper"
                    />
                    <p id="product-description-helper" className="mt-2 text-xs text-slate-500">
                        提供简短描述可以提升生成图片的准确性。
                    </p>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-1 text-slate-200">2. 选择广告格式</h2>
              <p className="text-slate-400 mb-4">选择您希望产品广告出现的场景。</p>
              <AdFormatSelector
                formats={AD_FORMATS}
                selectedFormatId={selectedAdFormat?.id ?? null}
                onSelect={handleAdFormatSelect}
              />
            </div>
            
            {selectedAdFormat && (
                <div>
                    <h2 className="text-2xl font-bold mb-1 text-slate-200">3. 微调提示词 (可选)</h2>
                    <p className="text-slate-400 mb-4">您可以修改 AI 提示词以获得更精确的效果。</p>
                    <textarea
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        rows={5}
                        className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-200 text-slate-200 placeholder-slate-500"
                        placeholder="例如：'将产品放在沙滩上，背景是日落'..."
                    />
                </div>
            )}

            <div className="mt-auto pt-4">
                <div className="mb-4">
                    <ToggleSwitch
                        label="高清模式"
                        description="生成更高分辨率的图片 (可能稍慢)"
                        enabled={isHighRes}
                        onChange={setIsHighRes}
                    />
                </div>
                <div className="flex items-stretch gap-3">
                    <button
                    onClick={handleGenerateClick}
                    disabled={isLoading}
                    className="flex-grow py-3 px-6 text-lg font-bold text-white rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-indigo-500/50"
                    >
                    {isLoading ? '生成中...' : '✨ 生成广告'}
                    </button>
                    <button
                        onClick={handleReset}
                        disabled={(productImages.length === 0 && !selectedAdFormat) || isLoading}
                        aria-label="重置选择"
                        title="重置选择"
                        className="flex-shrink-0 px-4 py-3 rounded-lg bg-slate-600 hover:bg-slate-500 text-white transition-colors duration-200 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed"
                    >
                        <ResetIcon />
                    </button>
                </div>
                {validationError && (
                    <p className="text-red-500 text-sm mt-2 text-center">{validationError}</p>
                )}
            </div>
          </div>

          <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700 shadow-lg flex flex-col">
            <h2 className="text-2xl font-bold mb-4 text-slate-200">4. 查看您的模型</h2>
            <GeneratedImageView
              generatedImage={generatedImage}
              generatedText={generatedText}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </main>

         <footer className="text-center mt-12 text-slate-500 text-sm">
            <p>由 Google Gemini 2.5 Flash 驱动。图片由 AI 生成，可能不完美。</p>
        </footer>
      </div>
    </div>
  );
};

export default App;