import { buildMrzLines, type Input } from "@simochee/passport-mrz-builder";
import type { CanvasLike } from "./canvas";
import type { RenderOptions } from "./types";

/**
 * キャンバスにMRZを描画する共通関数
 * @param input パスポート情報
 * @param canvas キャンバス
 * @param options レンダリングオプション
 */
export function renderMRZToCanvas(
	input: Input,
	canvas: CanvasLike,
	options: RenderOptions = {},
): void {
	const { width = 880 } = options;
	const fontSize = 20;
	const backgroundColor = "#ffffff";
	const textColor = "#000000";
	const lineHeight = 1.2;

	// MRZテキストを生成
	const mrzLines = buildMrzLines(input);

	// キャンバスの高さを計算
	const height = Math.ceil(fontSize * lineHeight * mrzLines.length) + 40;

	// キャンバスのサイズを設定
	canvas.width = width;
	canvas.height = height;

	const ctx = canvas.getContext("2d");
	if (!ctx) {
		throw new Error("Canvas context not available");
	}

	// 背景を描画
	ctx.fillStyle = backgroundColor;
	ctx.fillRect(0, 0, width, height);

	// フォント設定
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
}

/**
 * MRZ描画に必要なキャンバスサイズを計算
 * @param input パスポート情報
 * @param options レンダリングオプション
 */
export function calculateCanvasSize(
	input: Input,
	options: RenderOptions = {},
): { width: number; height: number } {
	const { width = 880 } = options;
	const fontSize = 20;
	const lineHeight = 1.2;

	const mrzLines = buildMrzLines(input);
	const height = Math.ceil(fontSize * lineHeight * mrzLines.length) + 40;

	return { width, height };
}
