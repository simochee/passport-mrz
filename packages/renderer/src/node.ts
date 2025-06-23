import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildMrzLines, type Input } from "@simochee/passport-mrz-builder";
import { createCanvas, registerFont } from "canvas";
import type { RenderOptions } from "./types";

const __dirname = dirname(fileURLToPath(import.meta.url));

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
	const { width = 880 } = options;
	const fontSize = 20;
	const backgroundColor = "#ffffff";
	const textColor = "#000000";
	const lineHeight = 1.2;

	// OCR-Bフォントを登録
	try {
		const fontPath = join(__dirname, "../../ocrb-webfont/assets/OCRB.woff2");
		const fontBuffer = readFileSync(fontPath);
		registerFont(fontBuffer, { family: "OCRB" });
	} catch (_error) {
		console.warn("OCR-B font not found, using default font");
	}

	// MRZテキストを生成
	const mrzLines = buildMrzLines(input);

	// キャンバスの高さを計算
	const height = Math.ceil(fontSize * lineHeight * mrzLines.length) + 40; // パディング追加

	// キャンバスを作成
	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext("2d");

	// 背景を描画
	ctx.fillStyle = backgroundColor;
	ctx.fillRect(0, 0, width, height);

	// フォント設定
	ctx.fillStyle = textColor;
	ctx.font = `${fontSize}px OCRB, monospace`;
	ctx.textAlign = "center";
	ctx.textBaseline = "top";

	// MRZテキストを描画
	const startY = 20; // 上部パディング
	mrzLines.forEach((line, index) => {
		const y = startY + fontSize * lineHeight * index;
		ctx.fillText(line, width / 2, y);
	});

	// PNG Bufferを生成
	return canvas.toBuffer("image/png");
}

export type { RenderOptions } from "./types";
