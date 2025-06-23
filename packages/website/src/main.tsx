import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "ocrb-webfont";
import "./style.css";
import { App } from "./components/App";

// biome-ignore lint: noNonNullAssertion
const rootEl = document.getElementById("root")!;
const root = createRoot(rootEl);

root.render(
	<StrictMode>
		<App />
	</StrictMode>,
);
