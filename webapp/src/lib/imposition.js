/**
 * Compute the imposition layout for grid-based booklet printing.
 *
 * @param {number} totalInputPages - Number of pages in the source PDF
 * @param {Object} gridConfig      - { rows, cols } dimensions of the grid
 * @returns {Array<{front: (number|null)[], back: (number|null)[]}>}
 *          Each element is one output sheet.
 *          front[i] = source page index for front-side slot i
 *          back[i]  = source page index for back-side slot i
 *          null     = blank slot (padding)
 */
export function computeImposition(totalInputPages, { rows, cols }) {
  const K = rows * cols; // Slots per side
  const N = 2 * K;       // Total source pages that fit on one physical sheet (front + back)
  const sheetsNeeded = Math.ceil(totalInputPages / N);
  const layout = [];

  for (let s = 0; s < sheetsNeeded; s++) {
    const front = new Array(K).fill(null);
    const back = new Array(K).fill(null);

    for (let i = 0; i < K; i++) {
      // Find row and column for the current slot index `i`
      const r = Math.floor(i / cols);
      const c = i % cols;

      // Front side: odd-position pages (0-indexed: 0, 2, 4...)
      const fPage = s * N + 2 * i;
      front[i] = fPage < totalInputPages ? fPage : null;

      // Back side:
      // For a Duplex (Short-Edge Bind) on a Landscape sheet, the physical flip is left-to-right.
      // Therefore, the slot directly behind (r, c) is located at (r, cols - 1 - c).
      const backIndex = r * cols + (cols - 1 - c);
      
      // The page number for the back side of slot `i` is the next sequential page (+1)
      const bPage = s * N + 2 * i + 1;
      back[backIndex] = bPage < totalInputPages ? bPage : null;
    }

    layout.push({ front, back });
  }

  return layout;
}
