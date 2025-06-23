import type { Input } from "@simochee/passport-mrz-builder";
import { renderMRZToCanvas } from "./canvas-renderer";
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
	// HTMLCanvasElementを作成
	const canvas = document.createElement("canvas");

	// 共通ロジックでMRZを描画（サイズ設定込み）
	renderMRZToCanvas(input, canvas, options);

	// PNG Blobを生成
	return new Promise((resolve) => {
		canvas.toBlob((blob) => {
			resolve(blob!);
		}, "image/png");
	});
}

export type { RenderOptions } from "./types";
