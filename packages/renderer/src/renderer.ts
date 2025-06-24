import { buildMrzLines, type Input } from "@simochee/passport-mrz-builder";
import { type Canvas, createCanvas, registerFont } from "canvas";

/**
 * MRZを描画したキャンバスを生成する関数
 * @param input パスポート情報
 * @returns 描画済みのキャンバス
 */
export function renderMRZToCanvas(input: Input): Canvas {
	const fontSize = 60;
	const backgroundColor = "#ffffff";
	const textColor = "#000000";
	const lineHeight = 1.2;
	const padding = 48;

	// MRZテキストを生成
	const mrzLines = buildMrzLines(input);

	// 理論値でキャンバスサイズを計算
	// OCR-Bフォントの文字幅は約0.7倍
	const charWidth = fontSize * 0.7;
	const textWidth = 44 * charWidth; // MRZは44文字固定
	const textHeight = fontSize * lineHeight * mrzLines.length;

	// 四方に16pxの余白を付けたキャンバスサイズ
	const width = Math.ceil(textWidth + padding * 2);
	const height = Math.ceil(textHeight + padding * 2);

	if (typeof registerFont === "function") {
		registerFont("./assets/OCRB.ttf", { family: "OCRB" });
	}

	// キャンバスを生成
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
	const startY = padding;
	mrzLines.forEach((line, index) => {
		const y = startY + fontSize * lineHeight * index;
		ctx.fillText(line, width / 2, y);
	});

	return canvas;
}
