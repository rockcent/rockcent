import React, { useCallback } from 'react';
import { UploadIcon, CloseIcon } from './icons/AdIcons';

interface ImageUploaderProps {
  images: Array<{ base64: string, mimeType: string }>;
  onImageAdd: (base64: string, mimeType: string) => void;
  onImageRemove: (index: number) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ images, onImageAdd, onImageRemove }) => {
  const [error, setError] = React.useState<string | null>(null);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    setError(null);

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        setError("检测到无效文件类型。仅支持图片。");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        onImageAdd(base64String, file.type);
      };
      reader.onerror = () => {
        setError(`读取文件 ${file.name} 失败。`);
      };
      reader.readAsDataURL(file);
    });
  }, [onImageAdd]);

  const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };
  
  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="flex flex-col gap-4">
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {images.map((image, index) => (
            <div key={index} className="relative group aspect-square">
              <img
                src={`data:${image.mimeType};base64,${image.base64}`}
                alt={`产品预览 ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                onClick={() => onImageRemove(index)}
                className="absolute top-1 right-1 bg-black/50 hover:bg-black/80 text-white rounded-full p-1 transition-opacity opacity-0 group-hover:opacity-100"
                aria-label={`移除图片 ${index + 1}`}
              >
                <CloseIcon />
              </button>
            </div>
          ))}
        </div>
      )}

      <div>
        <label 
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer bg-slate-800 hover:bg-slate-700 transition-colors"
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-400">
              <UploadIcon />
              <p className="mb-2 text-sm"><span className="font-semibold">添加更多图片</span> 或拖放文件</p>
              <p className="text-xs">支持 PNG, JPG, WEBP</p>
           </div>
          <input 
            id="dropzone-file" 
            type="file" 
            className="hidden" 
            accept="image/png, image/jpeg, image/webp"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>
        {error && <p className="mt-2 text-sm text-red-500 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default ImageUploader;