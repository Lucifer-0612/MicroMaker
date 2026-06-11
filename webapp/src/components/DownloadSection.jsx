import { useState, useEffect } from 'react';
import { generateImposedPDF } from '../lib/pdfCompose';

export function DownloadSection({ pdfFile, gridConfig, paperSize, includeBorder, includePageNumbers, onBack, onRestart }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [blobUrl, setBlobUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Generate the PDF immediately when this component mounts
    const generate = async () => {
      setIsGenerating(true);
      setError(null);
      try {
        const buffer = await pdfFile.arrayBuffer();
        const outputUint8Array = await generateImposedPDF(buffer, gridConfig, paperSize, includeBorder, includePageNumbers);
        const blob = new Blob([outputUint8Array], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
      } catch (err) {
        console.error("PDF generation error:", err);
        setError("Failed to generate the PDF. It might be corrupted or incompatible.");
      } finally {
        setIsGenerating(false);
      }
    };

    if (pdfFile) {
      generate();
    }

    return () => {
      // Cleanup the blob URL when unmounting
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [pdfFile, gridConfig, paperSize, includeBorder, includePageNumbers]);

  return (
    <div className="panel p-12 flex flex-col items-center max-w-2xl mx-auto text-center">

      {isGenerating ? (
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-12 w-12 text-safety-orange mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <h2 className="text-xl font-medium mb-2">Composing Document...</h2>
          <p className="text-sm text-slate-400 font-mono">Running imposition algorithm locally</p>
        </div>
      ) : error ? (
        <div className="w-full text-left">
          <div className="p-4 border border-red-900 bg-red-950/30 text-red-400 font-mono text-sm mb-6">
            ERROR: {error}
          </div>
          <button className="btn-secondary w-full" onClick={onBack}>GO BACK</button>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-safety-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold mb-2">Ready for Print</h2>
          <p className="text-sm text-slate-400 mb-8 max-w-md">
            Your booklet has been structured. Remember to select <span className="text-slate-50 font-bold border-b border-slate-500">Duplex (Short-Edge Bind)</span> in your printer dialog to ensure correct alignment.
          </p>

          <div className="flex flex-col sm:flex-row w-full gap-4">
            <a
              href={blobUrl}
              download={`micro-maker-output-${gridConfig.rows * gridConfig.cols}-in-1.pdf`}
              className="btn-primary flex-1 text-center py-3 text-sm font-bold tracking-widest flex justify-center items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              DOWNLOAD PDF
            </a>

            <button
              className="btn-secondary sm:w-auto px-8 text-sm font-bold tracking-widest"
              onClick={onRestart}
            >
              START NEW
            </button>
          </div>


        </div>
      )}
    </div>
  );
}
