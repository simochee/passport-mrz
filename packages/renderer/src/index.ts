import type { Input } from "@simochee/passport-mrz-builder";
import { createCanvas, registerFont } from "canvas";
import fontPath from "ocrb-webfont/OCRB.ttf";
import { renderMRZToCanvas } from "./renderer";
import type { RenderOptions } from "./types";

/**
 * Node.js環境用のMRZ PNG生成関数
 * @param input パスポート情報
 * @param options レンダリングオプション
 * @returns PNG画像のBuffer
 */
export async function renderMRZToPNG(
	input: Input,
	options: RenderOptions = {},
): Promise<Buffer> {
	// OCR-Bフォントを登録
	try {
		registerFont(fontPath, { family: "OCRB" });
	} catch (_error) {
		console.warn("OCR-B font not found, using default font");
	}

	// キャンバスを作成（サイズは共通ロジックで設定される）
	const canvas = createCanvas(1, 1); // 初期値、後で上書きされる

	// 共通ロジックでMRZを描画（サイズ設定込み）
	renderMRZToCanvas(input, canvas, options);

	// PNG Bufferを生成
	return canvas.toBuffer("image/png");
}

export type { RenderOptions } from "./types";
