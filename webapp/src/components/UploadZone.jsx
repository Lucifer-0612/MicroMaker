import { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

export function UploadZone({ onUpload }) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = async (file) => {
    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      
      // Parse with PDF.js to get page count
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const pageCount = pdf.numPages;

      if (pageCount < 2) {
        setError('The PDF must have at least 2 pages to create a booklet.');
        setIsProcessing(false);
        return;
      }

      onUpload(file, pageCount);
    } catch (err) {
      console.error(err);
      setError('This PDF appears to be corrupted or password-protected.');
      setIsProcessing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div 
        className={`panel flex flex-col items-center justify-center p-16 border-2 border-dashed transition-colors ${
          isDragging ? 'border-safety-orange bg-slate-800/80' : 'border-slate-600 hover:border-slate-500'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-500 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        
        <h2 className="text-xl font-medium mb-2">Drop your PDF here</h2>
        <p className="text-sm text-slate-400 mb-8 font-mono">Max size: Unlimited (Processed locally)</p>
        
        <button 
          className="btn-primary"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
        >
          {isProcessing ? 'PROCESSING...' : 'BROWSE FILES'}
        </button>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="application/pdf" 
          className="hidden" 
        />
      </div>
      
      {error && (
        <div className="mt-4 p-4 border border-red-900 bg-red-950/30 text-red-400 font-mono text-sm">
          ERROR: {error}
        </div>
      )}
    </div>
  );
}
