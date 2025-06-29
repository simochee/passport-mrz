import { buildMrzLines, type Input } from "@passport-mrz/builder";
import {
	type Canvas,
	type CanvasRenderingContext2D,
	createCanvas,
	registerFont,
	type TextMetrics,
} from "canvas";

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
	letterSpacing: number; // 文字間隔（px）
}

/**
 * デフォルトのレンダリング設定
 */
export const DEFAULT_RENDER_CONFIG: RenderConfig = {
	fontSize: 64,
	backgroundColor: "#ffffff",
	textColor: "#000000",
	lineHeight: 1,
	padding: 0, // 動的に計算されるため初期値は0
	fontFamily: "OCRB, monospace",
	letterSpacing: 0, // 動的に計算されるため初期値は0（実際は fontSize * -0.018）
};

/**
 * キャンバスサイズを計算する関数（measureTextを使用した実測値ベース）
 * @param mrzLines MRZ行の配列
 * @param config レンダリング設定
 * @returns 計算されたキャンバスサイズ
 */
export async function calculateCanvasSize(
	mrzLines: string[],
	config: RenderConfig,
): Promise<{ width: number; height: number }> {
	// フォントを登録
	await registerMRZFont();

	// 一時的なキャンバスを作成してテキストサイズを測定
	const tempCanvas = createCanvas(1, 1);
	const tempCtx = tempCanvas.getContext("2d");

	// 動的letterSpacing計算：フォントサイズの-1.8%
	const dynamicLetterSpacing = config.letterSpacing || config.fontSize * -0.018;

	// フォント設定（描画時と同じ設定）
	tempCtx.font = `${config.fontSize}px ${config.fontFamily}`;
	// tempCtx.letterSpacing = "-1.8%"; // Node.js canvasでは未サポート

	// 各行のテキストサイズを測定して最大幅を取得
	let maxWidth = 0;
	const lineMetrics: TextMetrics[] = [];

	mrzLines.slice(0, 2).forEach((line) => {
		try {
			// 文字間隔を考慮した幅を計算
			let lineWidth = 0;
			for (let i = 0; i < line.length; i++) {
				const char = line[i];
				const charMetrics = tempCtx.measureText(char);
				lineWidth += charMetrics.width;
				if (i < line.length - 1) {
					lineWidth += dynamicLetterSpacing;
				}
			}

			// 高さ計算用に最初の文字のメトリクスを保存
			const firstCharMetrics = tempCtx.measureText(line[0] || "M");
			lineMetrics.push(firstCharMetrics);
			maxWidth = Math.max(maxWidth, lineWidth);
		} catch (error) {
			console.warn("measureTextでエラーが発生しました:", error);
			// フォールバック: 理論値を使用
			const charWidth = config.fontSize * 0.7;
			const lineWidth =
				line.length * charWidth + (line.length - 1) * dynamicLetterSpacing;
			maxWidth = Math.max(maxWidth, lineWidth);
			// 空のメトリクスを追加（フォールバック用）
			lineMetrics.push({
				width: charWidth,
				actualBoundingBoxAscent: config.fontSize * 0.8,
				actualBoundingBoxDescent: config.fontSize * 0.2,
				fontBoundingBoxAscent: config.fontSize * 0.8,
				fontBoundingBoxDescent: config.fontSize * 0.2,
			} as TextMetrics);
		}
	});

	// 実際のテキスト高さを計算（描画ロジックと一致させる）
	let totalHeight = 0;
	if (lineMetrics.length > 0) {
		const firstMetrics = lineMetrics[0];
		// 1行目の上端から下端まで
		const firstLineAscent = Math.max(
			firstMetrics.actualBoundingBoxAscent || config.fontSize * 0.8,
			firstMetrics.fontBoundingBoxAscent || config.fontSize * 0.8,
		);
		const firstLineDescent =
			firstMetrics.actualBoundingBoxDescent || config.fontSize * 0.2;

		totalHeight = firstLineAscent + firstLineDescent;

		if (lineMetrics.length > 1) {
			// 2行目がある場合：行間（フォントサイズと同じ）+ 2行目の高さを追加
			const secondMetrics = lineMetrics[1];
			const secondLineAscent = Math.max(
				secondMetrics.actualBoundingBoxAscent || config.fontSize * 0.8,
				secondMetrics.fontBoundingBoxAscent || config.fontSize * 0.8,
			);
			const secondLineDescent =
				secondMetrics.actualBoundingBoxDescent || config.fontSize * 0.2;

			totalHeight += config.fontSize + secondLineAscent + secondLineDescent;
		}
	}

	// 動的padding計算：フォントサイズの半分
	const dynamicPadding = config.fontSize / 2;

	// 余白を含めたキャンバスサイズ
	const width = Math.ceil(maxWidth + dynamicPadding * 2);
	const height = Math.ceil(totalHeight + dynamicPadding * 2);

	// サイズが0以下の場合はエラーを防ぐため最小サイズを設定
	const safeWidth = Math.max(width, 1);
	const safeHeight = Math.max(height, 1);

	return { width: safeWidth, height: safeHeight };
}

/**
 * フォントを登録する関数
 */
export async function registerMRZFont(): Promise<void> {
	if (typeof registerFont === "function") {
		const { fileURLToPath } = await import("node:url");

		const fontPath = fileURLToPath(
			new URL("../assets/OCRB.ttf", import.meta.url),
		);
		try {
			registerFont(fontPath, { family: "OCRB" });
		} catch (error) {
			console.warn("フォントの読み込みに失敗しました:", error);
			// フォントが読み込めない場合でもエラーで停止させない
		}
	}
}

/**
 * 文字間隔を考慮してテキストを描画する関数
 * @param ctx キャンバスコンテキスト
 * @param text 描画するテキスト
 * @param x 開始X座標
 * @param y Y座標
 * @param letterSpacing 文字間隔（px）
 * @returns 描画後の次のX座標
 */
export function drawTextWithLetterSpacing(
	ctx: CanvasRenderingContext2D,
	text: string,
	x: number,
	y: number,
	letterSpacing: number,
): number {
	let currentX = x;

	for (let i = 0; i < text.length; i++) {
		const char = text[i];
		ctx.fillText(char, currentX, y);

		// 文字幅を測定して次の位置を計算
		const charMetrics = ctx.measureText(char);
		currentX += charMetrics.width + letterSpacing;
	}

	return currentX;
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
	ctx.textBaseline = "alphabetic"; // alphabeticベースラインを使用

	// 文字間隔を-1.8%に設定 (Node.js canvasでは未サポートのためコメントアウト)
	// ctx.letterSpacing = "-1.8%";

	// 動的padding計算：フォントサイズの半分
	const dynamicPadding = config.fontSize / 2;

	// 動的letterSpacing計算：フォントサイズの-1.8%
	const dynamicLetterSpacing = config.letterSpacing || config.fontSize * -0.018;

	// MRZテキストを描画（2行のみ）
	const startX = dynamicPadding; // 左余白を追加

	// 最初の行のメトリクスを取得してベースライン位置を決定
	let firstLineMetrics: TextMetrics;
	let baselineY: number;

	try {
		firstLineMetrics = ctx.measureText(mrzLines[0]);
		baselineY =
			dynamicPadding +
			Math.max(
				firstLineMetrics.actualBoundingBoxAscent || config.fontSize * 0.8,
				firstLineMetrics.fontBoundingBoxAscent || config.fontSize * 0.8,
			);
	} catch (error) {
		console.warn("描画時のmeasureTextでエラーが発生しました:", error);
		// フォールバック: フォントサイズベースの値を使用
		baselineY = dynamicPadding + config.fontSize * 0.8;
		firstLineMetrics = {
			actualBoundingBoxAscent: config.fontSize * 0.8,
			actualBoundingBoxDescent: config.fontSize * 0.2,
			fontBoundingBoxAscent: config.fontSize * 0.8,
			fontBoundingBoxDescent: config.fontSize * 0.2,
		} as TextMetrics;
	}

	mrzLines.slice(0, 2).forEach((line, index) => {
		if (index === 0) {
			// 1行目: ベースライン位置に配置（文字間隔付き）
			drawTextWithLetterSpacing(
				ctx,
				line,
				startX,
				baselineY,
				dynamicLetterSpacing,
			);
		} else {
			// 2行目: 1行目のベースライン + 1行目の下端 + 行間（フォントサイズと同じ）+ 2行目の上端
			let secondLineAscent = config.fontSize * 0.8;
			try {
				const secondLineMetrics = ctx.measureText(line[0] || "M");
				secondLineAscent = Math.max(
					secondLineMetrics.actualBoundingBoxAscent || config.fontSize * 0.8,
					secondLineMetrics.fontBoundingBoxAscent || config.fontSize * 0.8,
				);
			} catch (error) {
				console.warn("2行目のmeasureTextでエラーが発生しました:", error);
			}

			const firstLineDescent =
				firstLineMetrics.actualBoundingBoxDescent || config.fontSize * 0.2;
			const y =
				baselineY + firstLineDescent + config.fontSize + secondLineAscent;
			// 2行目も文字間隔付きで描画
			drawTextWithLetterSpacing(ctx, line, startX, y, dynamicLetterSpacing);
		}
	});
}

/**
 * MRZを描画したキャンバスを生成する関数
 * @param input パスポート情報
 * @param config レンダリング設定（オプション）
 * @returns 描画済みのキャンバス
 */
export async function renderMRZToCanvas(
	input: Input,
	config: RenderConfig = DEFAULT_RENDER_CONFIG,
): Promise<Canvas> {
	// MRZテキストを生成
	const mrzLines = buildMrzLines(input);

	// キャンバスサイズを計算
	const { width, height } = await calculateCanvasSize(mrzLines, config);

	// フォントを登録
	await registerMRZFont();

	// キャンバスを生成
	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext("2d");

	// 背景を描画
	drawBackground(ctx, width, height, config.backgroundColor);

	// MRZテキストを描画
	drawMRZText(ctx, mrzLines, config, width);

	return canvas;
}
