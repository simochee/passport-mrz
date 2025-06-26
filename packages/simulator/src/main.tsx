import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/ibm-plex-sans-jp/japanese-400.css";
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
