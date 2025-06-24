import type { Input } from "@simochee/passport-mrz-builder";
import { registerFont } from "canvas";
import { renderMRZToCanvas } from "./renderer";

/**
 * Node.js環境用のMRZ PNG生成関数
 * @param input パスポート情報
 * @returns PNG画像のBuffer
 */
export async function renderMRZToPNG(input: Input): Promise<Buffer> {
	// OCR-Bフォントを登録
	try {
		registerFont("./assets/OCRB.ttf", { family: "OCRB" });
	} catch (_error) {
		console.log(_error);
		console.warn("OCR-B font not found, using default font");
	}

	// MRZを描画したキャンバスを生成
	const canvas = renderMRZToCanvas(input);

	// PNG Bufferを生成
	return canvas.toBuffer("image/png");
}
