import type { Input } from "passport-mrz-builder";
import {
	calculateCanvasSize,
	DEFAULT_RENDER_CONFIG,
	drawBackground,
	drawMRZText,
	drawTextWithLetterSpacing,
	type RenderConfig,
	registerMRZFont,
	renderMRZToCanvas,
} from "./renderer";

/**
 * Node.js環境用のMRZ PNG生成関数
 * @param input パスポート情報
 * @param config レンダリング設定（オプション）
 * @returns PNG画像のBuffer
 */
const renderMRZToPNG = async (
	input: Input,
	config?: RenderConfig,
): Promise<Buffer> => {
	const canvas = await renderMRZToCanvas(input, config);

	// PNG Bufferを生成
	return canvas.toBuffer("image/png");
};

export {
	renderMRZToCanvas,
	renderMRZToPNG,
	calculateCanvasSize,
	drawBackground,
	drawMRZText,
	drawTextWithLetterSpacing,
	registerMRZFont,
	DEFAULT_RENDER_CONFIG,
	type RenderConfig,
};
