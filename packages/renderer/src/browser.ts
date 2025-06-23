import { buildMrzLines, type Input } from "@simochee/passport-mrz-builder";
import type { RenderOptions } from "./types";

/**
 * ブラウザ環境用のMRZ PNG生成関数
 * @param input パスポート情報
 * @param options レンダリングオプション
 * @returns PNG画像のBlob
 */
export async function renderMRZToPNG(
	input: Input,
	options: RenderOptions = {},
): Promise<Blob> {
	const { width = 880 } = options;
	const fontSize = 20;
	const backgroundColor = "#ffffff";
	const textColor = "#000000";
	const lineHeight = 1.2;

	// MRZテキストを生成
	const mrzLines = buildMrzLines(input);

	// キャンバスの高さを計算
	const height = Math.ceil(fontSize * lineHeight * mrzLines.length) + 40;

	// HTMLCanvasElementを作成
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d")!;

	// 背景を描画
	ctx.fillStyle = backgroundColor;
	ctx.fillRect(0, 0, width, height);

	// フォント設定（OCR-Bフォントがロードされていることを前提）
	ctx.fillStyle = textColor;
	ctx.font = `${fontSize}px OCRB, monospace`;
	ctx.textAlign = "center";
	ctx.textBaseline = "top";

	// MRZテキストを描画
	const startY = 20;
	mrzLines.forEach((line, index) => {
		const y = startY + fontSize * lineHeight * index;
		ctx.fillText(line, width / 2, y);
	});

	// PNG Blobを生成
	return new Promise((resolve) => {
		canvas.toBlob((blob) => {
			resolve(blob!);
		}, "image/png");
	});
}

export type { RenderOptions } from "./types";
