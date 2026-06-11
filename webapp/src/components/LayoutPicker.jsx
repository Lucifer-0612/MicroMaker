export function LayoutPicker({
  gridConfig,
  onGridChange,
  paperSize,
  onPaperSizeChange,
  includeBorder,
  onIncludeBorderChange,
  includePageNumbers,
  onIncludePageNumbersChange,
  onContinue,
  onBack
}) {
  const is4in1 = gridConfig.rows === 2 && gridConfig.cols === 2;
  const is6in1 = gridConfig.rows === 2 && gridConfig.cols === 3;
  const is8in1 = gridConfig.rows === 2 && gridConfig.cols === 4;
  const isCustom = !is4in1 && !is6in1 && !is8in1;

  return (
    <div className="flex flex-col space-y-6">
      <div className="panel p-6">
        <h3 className="text-xs font-bold font-mono text-slate-400 mb-4 tracking-widest uppercase">Layout Config</h3>

        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 border ${is4in1 ? 'bg-safety-orange border-safety-orange' : 'border-slate-500 group-hover:border-slate-400'}`}></div>
              <span className="font-mono text-sm">4-in-1 (2x2 grid)</span>
            </div>
            <input type="radio" name="grid" className="hidden" checked={is4in1} onChange={() => onGridChange({ rows: 2, cols: 2 })} />
          </label>

          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 border ${is6in1 ? 'bg-safety-orange border-safety-orange' : 'border-slate-500 group-hover:border-slate-400'}`}></div>
              <span className="font-mono text-sm">6-in-1 (2x3 grid)</span>
            </div>
            <input type="radio" name="grid" className="hidden" checked={is6in1} onChange={() => onGridChange({ rows: 2, cols: 3 })} />
          </label>

          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 border ${is8in1 ? 'bg-safety-orange border-safety-orange' : 'border-slate-500 group-hover:border-slate-400'}`}></div>
              <span className="font-mono text-sm">8-in-1 (2x4 grid)</span>
            </div>
            <input type="radio" name="grid" className="hidden" checked={is8in1} onChange={() => onGridChange({ rows: 2, cols: 4 })} />
          </label>

          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 border ${isCustom ? 'bg-safety-orange border-safety-orange' : 'border-slate-500 group-hover:border-slate-400'}`}></div>
              <span className="font-mono text-sm">Custom</span>
            </div>
            <input 
              type="radio" 
              name="grid" 
              className="hidden" 
              checked={isCustom} 
              onChange={() => onGridChange({ rows: 3, cols: 3 })} 
            />
          </label>

          {isCustom && (
            <div className="ml-7 p-3 bg-slate-900 border border-slate-700 rounded-md">
              <div className="flex items-center space-x-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Rows</label>
                  <input 
                    type="number" 
                    min="1" max="6"
                    className="w-16 bg-slate-800 border border-slate-600 text-white font-mono px-2 py-1 focus:outline-none focus:border-safety-orange text-sm"
                    value={gridConfig.rows}
                    onChange={(e) => {
                      const val = Math.max(1, Math.min(6, parseInt(e.target.value) || 1));
                      onGridChange({ rows: val, cols: gridConfig.cols });
                    }}
                  />
                </div>
                <div className="text-slate-500 font-bold mt-4">×</div>
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Cols</label>
                  <input 
                    type="number" 
                    min="1" max="6"
                    className="w-16 bg-slate-800 border border-slate-600 text-white font-mono px-2 py-1 focus:outline-none focus:border-safety-orange text-sm"
                    value={gridConfig.cols}
                    onChange={(e) => {
                      const val = Math.max(1, Math.min(6, parseInt(e.target.value) || 1));
                      onGridChange({ rows: gridConfig.rows, cols: val });
                    }}
                  />
                </div>
                <div className="mt-4 text-xs font-mono text-slate-400">
                  = {gridConfig.rows * gridConfig.cols} per side
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="panel p-6">
        <h3 className="text-xs font-bold font-mono text-slate-400 mb-4 tracking-widest uppercase">Target Paper</h3>

        <div className="flex space-x-4">
          <button
            className={`flex-1 py-2 font-mono text-sm border ${paperSize === 'A4' ? 'bg-slate-700 border-safety-orange text-safety-orange' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'}`}
            onClick={() => onPaperSizeChange('A4')}
          >
            A4
          </button>
          <button
            className={`flex-1 py-2 font-mono text-sm border ${paperSize === 'LETTER' ? 'bg-slate-700 border-safety-orange text-safety-orange' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'}`}
            onClick={() => onPaperSizeChange('LETTER')}
          >
            LETTER
          </button>
        </div>
      </div>

      <div className="panel p-6">
        <h3 className="text-xs font-bold font-mono text-slate-400 mb-4 tracking-widest uppercase">Options</h3>

        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 border ${includeBorder ? 'bg-safety-orange border-safety-orange' : 'border-slate-500 group-hover:border-slate-400'} flex items-center justify-center`}>
                {includeBorder && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                )}
              </div>
              <span className="font-mono text-sm">Draw Cut-Guide Borders</span>
            </div>
            <input type="checkbox" className="hidden" checked={includeBorder} onChange={(e) => onIncludeBorderChange(e.target.checked)} />
          </label>

          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 border ${includePageNumbers ? 'bg-safety-orange border-safety-orange' : 'border-slate-500 group-hover:border-slate-400'} flex items-center justify-center`}>
                {includePageNumbers && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                )}
              </div>
              <span className="font-mono text-sm">Stamp Page Numbers</span>
            </div>
            <input type="checkbox" className="hidden" checked={includePageNumbers} onChange={(e) => onIncludePageNumbersChange(e.target.checked)} />
          </label>
        </div>
      </div>

      <div className="flex flex-col space-y-3 pt-4">
        <button className="btn-primary w-full py-3 text-sm font-bold tracking-widest" onClick={onContinue}>
          CONFIRM & CONTINUE
        </button>
        <button className="btn-secondary w-full py-3 text-sm font-bold tracking-widest" onClick={onBack}>
          CANCEL
        </button>
      </div>
    </div>
  );
}
