import React, { useState, useRef } from 'react';
import { UploadCloud, Image, X, AlertCircle } from 'lucide-react';

const ScreenshotUploader = ({ file, onFileSelect, onFileRemove }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleFile = (selectedFile) => {
    setError(null);
    if (!selectedFile) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Invalid file format. Please upload a PNG, JPG, or WebP image.');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size exceeds the 5MB maximum limit.');
      return;
    }

    const previewUrl = URL.createObjectURL(selectedFile);
    setPreview(previewUrl);
    onFileSelect(selectedFile);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
    onFileRemove();
  };

  return (
    <div className="w-full">
      {!preview ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-cyan-400 bg-cyan-950/20'
              : 'border-slate-700/80 hover:border-cyan-500/50 bg-slate-900/50'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            className="hidden"
            onChange={handleChange}
          />
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="p-3 rounded-full bg-slate-800 text-cyan-400 border border-slate-700">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">
                <span className="text-cyan-400 underline decoration-cyan-400/50">Click to upload</span> or drag and drop screenshot
              </p>
              <p className="text-xs text-slate-400 mt-1">
                PNG, JPG, or WebP (max. 5MB)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative rounded-xl border border-slate-700 bg-slate-900/80 p-3 overflow-hidden">
          <div className="flex items-center space-x-3">
            <div className="h-16 w-24 rounded-lg bg-slate-950 overflow-hidden flex-shrink-0 border border-slate-800">
              <img
                src={preview}
                alt="Upload preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-200 truncate">
                {file?.name || 'Evidence Screenshot'}
              </p>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {file ? (file.size / (1024 * 1024)).toFixed(2) + ' MB' : ''}
              </p>
              <span className="inline-block text-[10px] text-emerald-400 font-medium mt-1">
                ✓ Ready for submission
              </span>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950/80 hover:text-red-400 text-slate-400 transition-colors"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-2 text-xs text-red-400 flex items-center space-x-1">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default ScreenshotUploader;
