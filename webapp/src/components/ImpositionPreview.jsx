import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { computeImposition } from '../lib/imposition';

export function ImpositionPreview({ pdfFile, gridConfig, pageCount, includeBorder, includePageNumbers }) {
  const [layout, setLayout] = useState([]);
  const [pdfDoc, setPdfDoc] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (pageCount && gridConfig) {
      setLayout(computeImposition(pageCount, gridConfig));
    }
  }, [pageCount, gridConfig]);

  useEffect(() => {
    if (pdfFile) {
      const loadPdf = async () => {
        try {
          const buffer = await pdfFile.arrayBuffer();
          const loadingTask = pdfjsLib.getDocument({ data: buffer });
          const doc = await loadingTask.promise;
          setPdfDoc(doc);
        } catch (err) {
          console.error("Preview load error:", err);
        }
      };
      loadPdf();
    }
  }, [pdfFile]);

  useEffect(() => {
    if (!pdfDoc || layout.length === 0 || !canvasRef.current) return;

    const renderPreview = async () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // We only render the first sheet (front and back) for the preview
      const firstSheet = layout[0];
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const padding = 10;
      const { rows, cols } = gridConfig;
      const K = rows * cols;
      
      // Calculate drawing dimensions
      const sheetWidth = (canvas.width - padding * 3) / 2; // Two sheets (front & back) side by side
      const sheetHeight = canvas.height - padding * 2;
      
      const slotWidth = sheetWidth / cols;
      const slotHeight = sheetHeight / rows;

      const drawSide = async (sideArray, startX, title) => {
        // Draw sheet background
        ctx.fillStyle = '#141a24'; // slate-800
        ctx.fillRect(startX, padding, sheetWidth, sheetHeight);
        ctx.strokeStyle = '#3d4a5c'; // slate-600
        ctx.strokeRect(startX, padding, sheetWidth, sheetHeight);

        // Draw title
        ctx.fillStyle = '#e8ecf1';
        ctx.font = '12px "JetBrains Mono"';
        ctx.fillText(title, startX, padding - 4);

        for (let i = 0; i < K; i++) {
          const r = Math.floor(i / cols);
          const c = i % cols;
          const pageIndex = sideArray[i];

          const x = startX + (c * slotWidth);
          const y = padding + (r * slotHeight);

          // Draw slot border (highlight in solid black if includeBorder is true)
          ctx.strokeStyle = includeBorder ? '#000000' : '#2a3444'; 
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, slotWidth, slotHeight);

          if (pageIndex !== null) {
            try {
              // PDF pages are 1-indexed
              const page = await pdfDoc.getPage(pageIndex + 1);
              const viewport = page.getViewport({ scale: 1 });
              
              const scale = Math.min(
                (slotWidth - 4) / viewport.width,
                (slotHeight - 4) / viewport.height
              );
              
              const scaledViewport = page.getViewport({ scale });
              
              // Create a temporary canvas for this page
              const tempCanvas = document.createElement('canvas');
              const tempCtx = tempCanvas.getContext('2d');
              tempCanvas.width = scaledViewport.width;
              tempCanvas.height = scaledViewport.height;

              const renderContext = {
                canvasContext: tempCtx,
                viewport: scaledViewport
              };
              
              await page.render(renderContext).promise;
              
              // Center it in the slot
              const drawX = x + (slotWidth - scaledViewport.width) / 2;
              const drawY = y + (slotHeight - scaledViewport.height) / 2;
              
              ctx.drawImage(tempCanvas, drawX, drawY);

              // Draw page number overlay
              if (includePageNumbers) {
                // Subtle bottom-right for actual printed page numbers
                ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
                ctx.fillRect(drawX + scaledViewport.width - 24, drawY + scaledViewport.height - 24, 24, 24);
                ctx.fillStyle = '#ffffff';
                ctx.font = '10px "JetBrains Mono"';
                ctx.textAlign = 'center';
                ctx.fillText(`${pageIndex + 1}`, drawX + scaledViewport.width - 12, drawY + scaledViewport.height - 8);
                ctx.textAlign = 'left'; // reset
              } else {
                // Bright top-left for debugging layout
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                ctx.fillRect(drawX, drawY, 24, 24);
                ctx.fillStyle = '#f97316'; // safety orange
                ctx.font = 'bold 12px "JetBrains Mono"';
                ctx.fillText(`${pageIndex + 1}`, drawX + 6, drawY + 16);
              }

            } catch (err) {
              console.error("Error rendering page preview:", err);
            }
          } else {
             // Draw blank indicator
             ctx.fillStyle = '#2a3444';
             ctx.font = '10px "JetBrains Mono"';
             ctx.fillText('BLANK', x + slotWidth/2 - 15, y + slotHeight/2);
          }
        }
      };

      await drawSide(firstSheet.front, padding, "SHEET 1 - FRONT");
      await drawSide(firstSheet.back, padding * 2 + sheetWidth, "SHEET 1 - BACK (PRINT SHORT-EDGE)");
    };

    renderPreview();
  }, [pdfDoc, layout, gridConfig, includeBorder, includePageNumbers]);

  return (
    <div className="panel p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
         <h3 className="text-xs font-bold font-mono text-slate-400 tracking-widest uppercase">Layout Preview</h3>
         <span className="text-xs font-mono bg-slate-900 border border-slate-700 px-2 py-1 text-safety-orange">
           {layout.length} Output {layout.length === 1 ? 'Sheet' : 'Sheets'} Required
         </span>
      </div>
      
      <div className="flex-grow bg-slate-900 border border-slate-700 flex items-center justify-center p-4 min-h-[400px]">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={500} 
          className="w-full h-auto max-h-[500px] object-contain"
        />
      </div>
    </div>
  );
}
