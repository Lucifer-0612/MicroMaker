import { describe, it, expect } from 'vitest';
import { computeImposition } from './imposition';

describe('Imposition Engine', () => {
  describe('computeImposition', () => {
    it('should correctly calculate the total number of printed sheets required', () => {
      // 20 source pages, 4-in-1 grid (8 pages per sheet duplex)
      const result1 = computeImposition(20, { rows: 2, cols: 2 });
      expect(result1.length).toBe(3); // 2 full sheets (16 pages) + 1 partial sheet (4 pages)

      // 10 source pages, 6-in-1 grid (12 pages per sheet duplex)
      const result2 = computeImposition(10, { rows: 2, cols: 3 });
      expect(result2.length).toBe(1); // Fits on 1 sheet
    });

    it('should assign correct front and back slots for duplex printing (Short-edge binding)', () => {
      // 6-in-1 grid (12 pages total per sheet). Let's test just exactly 12 pages.
      const sheets = computeImposition(12, { rows: 2, cols: 3 });
      const sheet = sheets[0];
      
      expect(sheet.front).toBeDefined();
      expect(sheet.back).toBeDefined();
      
      // Expected logic:
      // Front slot 0 -> page 0, Back slot 2 -> page 1
      // Front slot 1 -> page 2, Back slot 1 -> page 3
      // Front slot 2 -> page 4, Back slot 0 -> page 5
      // Front slot 3 -> page 6, Back slot 5 -> page 7
      // Front slot 4 -> page 8, Back slot 4 -> page 9
      // Front slot 5 -> page 10, Back slot 3 -> page 11
      
      expect(sheet.front).toEqual([0, 2, 4, 6, 8, 10]);
      expect(sheet.back).toEqual([5, 3, 1, 11, 9, 7]);
    });

    it('should handle uneven page counts with null padding', () => {
      // 5 source pages, 4-in-1 grid (8 pages per sheet duplex)
      const sheets = computeImposition(5, { rows: 2, cols: 2 });
      const sheet = sheets[0];

      // Total K = 4. N = 8.
      // Expected front: [0, 2, 4, null]
      // Expected back: [3, 1, null, null]  (wait, page 5 is null, page 6 is null, page 7 is null)
      // Slot 0 (TL): front=0, back[1]=1
      // Slot 1 (TR): front=2, back[0]=3
      // Slot 2 (BL): front=4, back[3]=5 (which is null, since total=5)
      // Slot 3 (BR): front=6 (null), back[2]=7 (null)
      
      expect(sheet.front).toEqual([0, 2, 4, null]);
      expect(sheet.back).toEqual([3, 1, null, null]);
    });

    it('should work with massive custom grids', () => {
      // Custom 6x6 grid = 36 slots per side = 72 pages per sheet
      const sheets = computeImposition(150, { rows: 6, cols: 6 });
      
      expect(sheets.length).toBe(3); // 72 + 72 + 6 = 150
      expect(sheets[0].front.length).toBe(36);
      expect(sheets[0].back.length).toBe(36);
      
      // Third sheet should have 6 total pages. 3 on front, 3 on back!
      // Since pages are distributed (front, back, front, back...)
      // The 6 remaining pages are distributed as:
      // slot 0: front=page144, back=page145
      // slot 1: front=page146, back=page147
      // slot 2: front=page148, back=page149
      const lastSheet = sheets[2];
      const validPages = lastSheet.front.filter(p => p !== null).length;
      expect(validPages).toBe(3);
      
      const validBackPages = lastSheet.back.filter(p => p !== null).length;
      expect(validBackPages).toBe(3);
    });
  });
});
