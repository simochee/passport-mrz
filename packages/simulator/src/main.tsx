import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import "./i18n/i18n";
import { App } from "./components/App";

// biome-ignore lint: noNonNullAssertion
const rootEl = document.getElementById("root")!;
const root = createRoot(rootEl);

root.render(
	<StrictMode>
		<App />
	</StrictMode>,
);
