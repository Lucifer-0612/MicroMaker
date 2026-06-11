import { PDFDocument, rgb } from 'pdf-lib';
import { computeImposition } from './imposition';
import { PAGE_SIZES } from '../constants/pageSizes';

/**
 * Generate a new PDF document based on the grid imposition layout.
 *
 * @param {ArrayBuffer} inputPdfBytes - The raw bytes of the source PDF.
 * @param {Object} gridConfig - { rows, cols } dimensions of the grid.
 * @param {string} paperSize - The target paper size ('A4' or 'LETTER').
 * @param {boolean} includeBorder - Whether to draw a cut-guide border.
 * @returns {Promise<Uint8Array>} - The generated PDF bytes.
 */
export async function generateImposedPDF(inputPdfBytes, gridConfig, paperSize, includeBorder = false, includePageNumbers = false) {
  // 1. Load the source document
  const srcDoc = await PDFDocument.load(inputPdfBytes);
  const totalPages = srcDoc.getPageCount();

  // 2. Compute the layout
  const layout = computeImposition(totalPages, gridConfig);

  // 3. Create the output document
  const outDoc = await PDFDocument.create();

  // Get paper dimensions (we always use landscape for the output sheet)
  const targetDims = PAGE_SIZES[paperSize].landscape;
  const sheetWidth = targetDims.width;
  const sheetHeight = targetDims.height;

  const { rows, cols } = gridConfig;
  const K = rows * cols;
  const slotWidth = sheetWidth / cols;
  const slotHeight = sheetHeight / rows;

  // 4. Process each sheet in the layout
  for (const sheet of layout) {
    // --- FRONT PAGE ---
    const frontPage = outDoc.addPage([sheetWidth, sheetHeight]);
    for (let i = 0; i < K; i++) {
      const srcPageIndex = sheet.front[i];
      if (srcPageIndex !== null) {
        const r = Math.floor(i / cols);
        const c = i % cols;
        await embedAndDraw(srcDoc, outDoc, frontPage, srcPageIndex, r, c, slotWidth, slotHeight, sheetHeight, includePageNumbers);
      }
    }
    if (includeBorder) {
      drawCutGuides(frontPage, rows, cols, sheetWidth, sheetHeight);
    }

    // --- BACK PAGE ---
    const backPage = outDoc.addPage([sheetWidth, sheetHeight]);
    for (let i = 0; i < K; i++) {
      const srcPageIndex = sheet.back[i];
      if (srcPageIndex !== null) {
        const r = Math.floor(i / cols);
        const c = i % cols;
        await embedAndDraw(srcDoc, outDoc, backPage, srcPageIndex, r, c, slotWidth, slotHeight, sheetHeight, includePageNumbers);
      }
    }
    if (includeBorder) {
      drawCutGuides(backPage, rows, cols, sheetWidth, sheetHeight);
    }
  }

  // 5. Serialize and return
  return await outDoc.save();
}

/**
 * Helper to embed a source page and draw it in the correct slot.
 */
async function embedAndDraw(srcDoc, outDoc, outPage, srcPageIndex, r, c, slotWidth, slotHeight, sheetHeight, includePageNumbers) {
  const [embeddedPage] = await outDoc.embedPdf(srcDoc, [srcPageIndex]);
  const srcDims = embeddedPage.scale(1); // Get natural dimensions

  // Calculate scaling to fit within the slot while preserving aspect ratio
  const scaleX = slotWidth / srcDims.width;
  const scaleY = slotHeight / srcDims.height;
  const scale = Math.min(scaleX, scaleY);

  const scaledWidth = srcDims.width * scale;
  const scaledHeight = srcDims.height * scale;

  // Center within the slot cell
  const xOffset = (c * slotWidth) + (slotWidth - scaledWidth) / 2;
  
  // PDF coordinate system (0,0) is bottom-left!
  // So the top of the sheet is `sheetHeight`.
  // To draw at row `r` (where 0 is top row), we calculate Y from the top.
  const yOffsetFromTop = (r * slotHeight) + (slotHeight - scaledHeight) / 2;
  
  // Convert top-down offset to bottom-up PDF coordinates
  const yOffset = sheetHeight - yOffsetFromTop - scaledHeight;

  outPage.drawPage(embeddedPage, {
    x: xOffset,
    y: yOffset,
    width: scaledWidth,
    height: scaledHeight,
  });

  if (includePageNumbers && srcPageIndex !== null) {
    const fontSize = 8;
    const pageNum = String(srcPageIndex + 1);
    
    outPage.drawText(pageNum, {
      x: xOffset + scaledWidth - (fontSize * 0.6 * pageNum.length) - 6, // 6pt padding from right edge
      y: yOffset + 6, // 6pt padding from bottom edge
      size: fontSize,
      color: rgb(0.5, 0.5, 0.5), // Subtle gray
    });
  }
}

/**
 * Draw straight cut-guide lines dividing the grid across the entire sheet.
 */
function drawCutGuides(page, rows, cols, sheetWidth, sheetHeight) {
  const slotWidth = sheetWidth / cols;
  const slotHeight = sheetHeight / rows;
  const color = rgb(0, 0, 0);

  // Vertical lines
  for (let c = 1; c < cols; c++) {
    const x = c * slotWidth;
    page.drawLine({
      start: { x, y: 0 },
      end: { x, y: sheetHeight },
      thickness: 1,
      color,
    });
  }

  // Horizontal lines
  for (let r = 1; r < rows; r++) {
    const y = r * slotHeight;
    page.drawLine({
      start: { x: 0, y },
      end: { x: sheetWidth, y },
      thickness: 1,
      color,
    });
  }
}
