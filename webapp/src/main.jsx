import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import * as pdfjsLib from 'pdfjs-dist';
import PDFWorker from 'pdfjs-dist/build/pdf.worker.min?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = PDFWorker;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
