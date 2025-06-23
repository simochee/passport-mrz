import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

// biome-ignore lint: noNonNullAssertion
const rootEl = document.getElementById("root")!;
const root = createRoot(rootEl);

root.render(
  <StrictMode>
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">パスポートMRZシミュレーター</h1>
      <div className="mb-4">
        <p className="font-ocrb text-lg">SAMPLE MRZ TEXT 12345</p>
        <p className="text-sm text-gray-600 mt-2">↑ OCR-B フォントで表示されています</p>
      </div>
      <p>application ready.</p>
    </div>
  </StrictMode>,
);
