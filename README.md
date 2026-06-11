<div align="center">

# ✂️ Micro Maker

**Precision PDF Impositioner for Strip-Booklets & Mini-Zines**

*Arrange multiple PDF pages onto a single printable sheet — entirely in your browser.*

[![License: MIT](https://img.shields.io/badge/License-MIT-f97316.svg)](LICENSE)
[![Made with React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev)
[![pdf-lib](https://img.shields.io/badge/pdf--lib-powered-blue.svg)](https://pdf-lib.js.org/)

</div>

---

## 🎯 What Is This?

Micro Maker is a **zero-backend, privacy-first** web tool that takes any PDF and rearranges its pages into a grid layout (imposition) for printing mini-booklets, zines, flashcards, or any multi-up format.

Your files **never leave your browser** — all processing happens locally using WebAssembly and JavaScript.

### ✨ Features

- **📄 Grid Imposition** — 4-in-1, 6-in-1, 8-in-1, or fully custom grids (up to 6×6)
- **✂️ Cut-Guide Borders** — Optional printed lines to guide your scissors or paper trimmer
- **🔢 Page Number Stamping** — Subtle page numbers on each mini-page so you never lose order
- **👁️ Live Preview** — See exactly how your pages will be arranged before printing
- **📐 Paper Sizes** — A4 and US Letter support
- **🔒 100% Client-Side** — Zero data leaves your browser. No uploads, no servers, no tracking.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/Lucifer-0612/MicroMaker.git
cd MicroMaker/webapp

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

The output will be in the `webapp/dist/` directory, ready to deploy to any static host (Vercel, Netlify, GitHub Pages, etc.).

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19 + Vite |
| **Styling** | Tailwind CSS v4 |
| **PDF Reading** | pdf.js (Mozilla) |
| **PDF Writing** | pdf-lib |
| **Font** | JetBrains Mono + Inter |

---

## 📁 Project Structure

```
MicroMaker/
├── webapp/
│   ├── public/              # Static assets (favicon, logo, icons)
│   ├── src/
│   │   ├── components/      # React UI components
│   │   │   ├── UploadZone.jsx
│   │   │   ├── LayoutPicker.jsx
│   │   │   ├── ImpositionPreview.jsx
│   │   │   └── DownloadSection.jsx
│   │   ├── lib/             # Core logic
│   │   │   ├── imposition.js    # Layout algorithm
│   │   │   └── pdfCompose.js    # PDF generation engine
│   │   ├── constants/
│   │   │   └── pageSizes.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Ideas for Contributions

- [ ] Drag-and-drop page reordering
- [ ] Saddle-stitch booklet imposition
- [ ] Margin/bleed controls
- [ ] Dark/light theme toggle
- [ ] PWA support for offline use
- [ ] i18n / multi-language support

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Ashutosh Kesarwani**

- LinkedIn: [ashutosh-kesarwani](https://www.linkedin.com/in/ashutosh-kesarwani-b985aa313/)

---

<div align="center">

*Built with ☕ and late-night debugging sessions.*

**If this tool saved you time, consider giving it a ⭐!**

</div>
