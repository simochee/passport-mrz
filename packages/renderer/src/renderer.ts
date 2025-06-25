import { buildMrzLines, type Input } from "@simochee/passport-mrz-builder";
import { type Canvas, createCanvas, registerFont } from "canvas";

/**
 * レンダリング設定の型定義
 */
export interface RenderConfig {
	fontSize: number;
	backgroundColor: string;
	textColor: string;
	lineHeight: number;
	padding: number;
	fontFamily: string;
}

/**
 * デフォルトのレンダリング設定
 */
export const DEFAULT_RENDER_CONFIG: RenderConfig = {
	fontSize: 60,
	backgroundColor: "#ffffff",
	textColor: "#000000",
	lineHeight: 1,
	padding: 0,
	fontFamily: "OCRB, monospace",
};

/**
 * キャンバスサイズを計算する関数
 * @param mrzLines MRZ行の配列
 * @param config レンダリング設定
 * @returns 計算されたキャンバスサイズ
 */
export function calculateCanvasSize(
	_mrzLines: string[],
	config: RenderConfig,
): { width: number; height: number } {
	// OCR-Bフォントの文字幅は約0.7倍
	const charWidth = config.fontSize * 0.7;
	const textWidth = 44 * charWidth; // MRZは44文字固定
	const textHeight = config.fontSize * config.lineHeight * 2; // 2行固定

	// 余白なしのキャンバスサイズ
	const width = Math.ceil(textWidth + config.padding * 2);
	const height = Math.ceil(textHeight + config.padding * 2);

	return { width, height };
}

/**
 * フォントを登録する関数
 */
export function registerMRZFont(): void {
	if (typeof registerFont === "function") {
		registerFont("./assets/OCRB.ttf", { family: "OCRB" });
	}
}

/**
 * キャンバスに背景を描画する関数
 * @param ctx キャンバスコンテキスト
 * @param width キャンバス幅
 * @param height キャンバス高さ
 * @param backgroundColor 背景色
 */
export function drawBackground(
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	backgroundColor: string,
): void {
	ctx.fillStyle = backgroundColor;
	ctx.fillRect(0, 0, width, height);
}

/**
 * MRZテキストをキャンバスに描画する関数
 * @param ctx キャンバスコンテキスト
 * @param mrzLines MRZ行の配列
 * @param config レンダリング設定
 * @param canvasWidth キャンバス幅
 */
export function drawMRZText(
	ctx: CanvasRenderingContext2D,
	mrzLines: string[],
	config: RenderConfig,
	_canvasWidth: number,
): void {
	// フォント設定
	ctx.fillStyle = config.textColor;
	ctx.font = `${config.fontSize}px ${config.fontFamily}`;
	ctx.textAlign = "left";
	ctx.textBaseline = "top";

	// 文字間隔を-1.8%に設定
	ctx.letterSpacing = "-1.8%";

	// MRZテキストを描画（2行のみ）
	const startY = 0;
	const startX = 0;
	mrzLines.slice(0, 2).forEach((line, index) => {
		const y = startY + config.fontSize * config.lineHeight * index;

		// テキストを描画
		ctx.fillText(line, startX, y);
	});
}

/**
 * MRZを描画したキャンバスを生成する関数
 * @param input パスポート情報
 * @param config レンダリング設定（オプション）
 * @returns 描画済みのキャンバス
 */
export function renderMRZToCanvas(
	input: Input,
	config: RenderConfig = DEFAULT_RENDER_CONFIG,
): Canvas {
	// MRZテキストを生成
	const mrzLines = buildMrzLines(input);

	// キャンバスサイズを計算
	const { width, height } = calculateCanvasSize(mrzLines, config);

	// フォントを登録
	registerMRZFont();

	// キャンバスを生成
	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext("2d");

	// 背景を描画
	drawBackground(ctx, width, height, config.backgroundColor);

	// MRZテキストを描画
	drawMRZText(ctx, mrzLines, config, width);

	return canvas;
}
