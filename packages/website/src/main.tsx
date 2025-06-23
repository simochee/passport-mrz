import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// biome-ignore lint: noNonNullAssertion
const rootEl = document.getElementById("root")!;
const root = createRoot(rootEl);

root.render(
  <StrictMode>
    <p>application ready.</p>
  </StrictMode>,
);
