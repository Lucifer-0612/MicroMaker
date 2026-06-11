import { useState } from 'react';
import { UploadZone } from './components/UploadZone';
import { LayoutPicker } from './components/LayoutPicker';
import { ImpositionPreview } from './components/ImpositionPreview';
import { DownloadSection } from './components/DownloadSection';
import { useVisitorCount } from './hooks/useVisitorCount';

function App() {
  const [step, setStep] = useState('upload'); // 'upload' | 'configure' | 'generate'

  // File data
  const [pdfFile, setPdfFile] = useState(null);
  const [pageCount, setPageCount] = useState(null);

  // Configuration
  const [gridConfig, setGridConfig] = useState({ rows: 2, cols: 3 }); // default 6-in-1
  const [paperSize, setPaperSize] = useState('A4');
  const [includeBorder, setIncludeBorder] = useState(false);
  const [includePageNumbers, setIncludePageNumbers] = useState(false);

  // Live visitor counter
  const { count: visitorCount, isLoading: countLoading } = useVisitorCount();

  const handleUpload = (file, count) => {
    setPdfFile(file);
    setPageCount(count);
    setStep('configure');
  };

  const handleRestart = () => {
    setPdfFile(null);
    setPageCount(null);
    setStep('upload');
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="w-full max-w-4xl flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4 md:gap-0 mb-8 border-b border-slate-700 pb-4">
        <div className="flex items-center space-x-4">
          <img src="/logo-v3.png" alt="Micro Maker Logo" className="w-24 h-24 flex-shrink-0" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Micro Maker</h1>
            <p className="text-sm text-slate-400 mt-1 font-mono">Precision Strip-Booklet Impositioner</p>
          </div>
        </div>
        <div className="flex flex-col items-start md:items-end space-y-3">
          <div className="flex items-center space-x-2">
            <div className="text-xs font-mono bg-slate-800 border border-slate-700 px-2 py-1">v1.0.0</div>
            {!countLoading && visitorCount !== null && (
              <div className="flex items-center space-x-1.5 text-xs font-mono bg-slate-800 border border-slate-700 px-2 py-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-green-400">{visitorCount.toLocaleString()}</span>
                <span className="text-slate-400">visitors</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <a
              href="https://github.com/Lucifer-0612/MicroMaker"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-2 bg-[#24292e] text-white px-3 py-1.5 rounded-lg font-bold text-sm hover:bg-[#2f363d] transition-colors border border-slate-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              <span className="font-sans">Star on GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/ashutosh-kesarwani-b985aa313/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-2 bg-[#FFDD00] text-black px-3 py-1.5 rounded-lg font-bold text-sm hover:bg-[#ffea4c] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                <line x1="6" y1="1" x2="6" y2="4"></line>
                <line x1="10" y1="1" x2="10" y2="4"></line>
                <line x1="14" y1="1" x2="14" y2="4"></line>
              </svg>
              <span className="font-sans">CONNECT</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-4xl flex-grow">
        {/* Step Indicator */}
        <div className="flex items-center space-x-4 mb-8 font-mono text-sm">
          <div className={`flex items-center space-x-2 ${step === 'upload' ? 'text-safety-orange' : 'text-slate-500'}`}>
            <span className={`border ${step === 'upload' ? 'border-safety-orange' : 'border-slate-500'} px-2 py-0.5`}>1</span>
            <span>UPLOAD</span>
          </div>
          <div className="text-slate-700">/</div>
          <div className={`flex items-center space-x-2 ${step === 'configure' ? 'text-safety-orange' : 'text-slate-500'}`}>
            <span className={`border ${step === 'configure' ? 'border-safety-orange' : 'border-slate-500'} px-2 py-0.5`}>2</span>
            <span>CONFIGURE</span>
          </div>
          <div className="text-slate-700">/</div>
          <div className={`flex items-center space-x-2 ${step === 'generate' ? 'text-safety-orange' : 'text-slate-500'}`}>
            <span className={`border ${step === 'generate' ? 'border-safety-orange' : 'border-slate-500'} px-2 py-0.5`}>3</span>
            <span>GENERATE</span>
          </div>
        </div>

        {/* Dynamic Step Content */}
        {step === 'upload' && (
          <UploadZone onUpload={handleUpload} />
        )}

        {step === 'configure' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <LayoutPicker
                gridConfig={gridConfig}
                onGridChange={setGridConfig}
                paperSize={paperSize}
                onPaperSizeChange={setPaperSize}
                includeBorder={includeBorder}
                onIncludeBorderChange={setIncludeBorder}
                includePageNumbers={includePageNumbers}
                onIncludePageNumbersChange={setIncludePageNumbers}
                onContinue={() => setStep('generate')}
                onBack={handleRestart}
              />
            </div>
            <div className="lg:col-span-2">
              <ImpositionPreview
                pdfFile={pdfFile}
                gridConfig={gridConfig}
                pageCount={pageCount}
                includeBorder={includeBorder}
                includePageNumbers={includePageNumbers}
              />
            </div>
          </div>
        )}

        {step === 'generate' && (
          <DownloadSection
            pdfFile={pdfFile}
            gridConfig={gridConfig}
            paperSize={paperSize}
            includeBorder={includeBorder}
            includePageNumbers={includePageNumbers}
            onBack={() => setStep('configure')}
            onRestart={handleRestart}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl mt-16 pt-8 border-t border-slate-700 text-center text-xs font-mono text-slate-500">
        <p>Zero-backend processing. Your files never leave this browser.</p>
      </footer>
    </div>
  );
}

export default App;
