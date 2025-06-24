import type { Input } from "@simochee/passport-mrz-builder";
import { renderMRZToCanvas } from "./renderer";

/**
 * Node.js環境用のMRZ PNG生成関数
 * @param input パスポート情報
 * @returns PNG画像のBuffer
 */
const renderMRZToPNG = async (input: Input): Promise<Buffer> => {
	const canvas = renderMRZToCanvas(input);

	// PNG Bufferを生成
	return canvas.toBuffer("image/png");
};

export { renderMRZToCanvas, renderMRZToPNG };
