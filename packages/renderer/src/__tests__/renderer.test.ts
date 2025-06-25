import type { Input } from "@simochee/passport-mrz-builder";
import { createCanvas } from "canvas";
import { describe, expect, it } from "vitest";
import {
	calculateCanvasSize,
	DEFAULT_RENDER_CONFIG,
	drawBackground,
	drawMRZText,
	type RenderConfig,
	registerMRZFont,
	renderMRZToCanvas,
} from "../renderer";

describe("renderMRZToCanvas", () => {
	const testInput: Input = {
		documentType: "P",
		issuingCountry: "JPN",
		surname: "YAMADA",
		givenNames: "TARO",
		documentNumber: "XS1234567",
		nationality: "JPN",
		birthDate: "900101",
		sex: "M",
		expiryDate: "301231",
		personalNumber: "123456789012345",
	};

	it("should create a canvas with correct dimensions", () => {
		const canvas = renderMRZToCanvas(testInput);

		expect(canvas).toBeDefined();
		expect(canvas.width).toBeGreaterThan(0);
		expect(canvas.height).toBeGreaterThan(0);

		// MRZは2行なので、高さは適切に計算されている
		expect(canvas.height).toBeGreaterThan(100);
	});

	it("should generate consistent canvas dimensions for same input", () => {
		const canvas1 = renderMRZToCanvas(testInput);
		const canvas2 = renderMRZToCanvas(testInput);

		expect(canvas1.width).toBe(canvas2.width);
		expect(canvas1.height).toBe(canvas2.height);
	});

	it("should handle different input data", () => {
		const differentInput: Input = {
			documentType: "P",
			issuingCountry: "USA",
			surname: "SMITH",
			givenNames: "JOHN MICHAEL",
			documentNumber: "AB9876543",
			nationality: "USA",
			birthDate: "850315",
			sex: "M",
			expiryDate: "351231",
			personalNumber: "987654321098765",
		};

		const canvas = renderMRZToCanvas(differentInput);

		expect(canvas).toBeDefined();
		expect(canvas.width).toBeGreaterThan(0);
		expect(canvas.height).toBeGreaterThan(0);
	});

	it("should create canvas with proper background", () => {
		const canvas = renderMRZToCanvas(testInput);
		const ctx = canvas.getContext("2d");

		// キャンバスの左上の1ピクセルを取得して背景色をチェック
		const imageData = ctx.getImageData(0, 0, 1, 1);
		const [r, g, b, a] = imageData.data;

		// 白い背景 (255, 255, 255, 255) であることを確認
		expect(r).toBe(255);
		expect(g).toBe(255);
		expect(b).toBe(255);
		expect(a).toBe(255);
	});

	it("should handle empty personal number", () => {
		const inputWithoutPersonalNumber: Input = {
			documentType: "P",
			issuingCountry: "JPN",
			surname: "YAMADA",
			givenNames: "TARO",
			documentNumber: "XS1234567",
			nationality: "JPN",
			birthDate: "900101",
			sex: "M",
			expiryDate: "301231",
			personalNumber: "",
		};

		const canvas = renderMRZToCanvas(inputWithoutPersonalNumber);

		expect(canvas).toBeDefined();
		expect(canvas.width).toBeGreaterThan(0);
		expect(canvas.height).toBeGreaterThan(0);
	});

	it("should use custom render config", () => {
		const customConfig: RenderConfig = {
			...DEFAULT_RENDER_CONFIG,
			fontSize: 40,
			padding: 20,
		};

		const canvas = renderMRZToCanvas(testInput, customConfig);

		expect(canvas).toBeDefined();
		expect(canvas.width).toBeGreaterThan(0);
		expect(canvas.height).toBeGreaterThan(0);

		// カスタムconfigを使用した場合、サイズが異なる
		const defaultCanvas = renderMRZToCanvas(testInput);
		expect(canvas.width).not.toBe(defaultCanvas.width);
		expect(canvas.height).not.toBe(defaultCanvas.height);
	});
});

describe("calculateCanvasSize", () => {
	it("should calculate correct canvas size for 2 lines", () => {
		const mrzLines = ["LINE1", "LINE2"];
		const size = calculateCanvasSize(mrzLines, DEFAULT_RENDER_CONFIG);

		expect(size.width).toBeGreaterThan(0);
		expect(size.height).toBeGreaterThan(0);

		// 2行の場合の高さチェック
		const expectedHeight = Math.ceil(
			DEFAULT_RENDER_CONFIG.fontSize * DEFAULT_RENDER_CONFIG.lineHeight * 2 +
				DEFAULT_RENDER_CONFIG.padding * 2,
		);
		expect(size.height).toBe(expectedHeight);
	});

	it("should calculate different sizes for different configs", () => {
		const mrzLines = ["LINE1", "LINE2"];
		const size1 = calculateCanvasSize(mrzLines, DEFAULT_RENDER_CONFIG);

		const customConfig: RenderConfig = {
			...DEFAULT_RENDER_CONFIG,
			fontSize: 80,
			padding: 60,
		};
		const size2 = calculateCanvasSize(mrzLines, customConfig);

		expect(size2.width).toBeGreaterThan(size1.width);
		expect(size2.height).toBeGreaterThan(size1.height);
	});
});

describe("drawBackground", () => {
	it("should draw background with correct color", () => {
		const canvas = createCanvas(100, 100);
		const ctx = canvas.getContext("2d");

		drawBackground(ctx, 100, 100, "#ff0000");

		// 左上の1ピクセルを取得して赤色であることを確認
		const imageData = ctx.getImageData(0, 0, 1, 1);
		const [r, g, b, a] = imageData.data;

		expect(r).toBe(255);
		expect(g).toBe(0);
		expect(b).toBe(0);
		expect(a).toBe(255);
	});
});

describe("drawMRZText", () => {
	it("should draw text without errors", () => {
		const canvas = createCanvas(200, 100);
		const ctx = canvas.getContext("2d");
		const mrzLines = ["TEST LINE"];

		// 背景を白に設定
		drawBackground(ctx, 200, 100, "#ffffff");

		// テキストを描画（エラーが発生しないことを確認）
		expect(() => {
			drawMRZText(ctx, mrzLines, DEFAULT_RENDER_CONFIG, 200);
		}).not.toThrow();

		// キャンバスのデータが存在することを確認
		const imageData = ctx.getImageData(0, 0, 200, 100);
		expect(imageData.data.length).toBe(200 * 100 * 4); // RGBA
	});
});

describe("registerMRZFont", () => {
	it("should not throw error when calling registerMRZFont", () => {
		expect(() => registerMRZFont()).not.toThrow();
	});
});

describe("DEFAULT_RENDER_CONFIG", () => {
	it("should have expected default values", () => {
		expect(DEFAULT_RENDER_CONFIG.fontSize).toBe(60);
		expect(DEFAULT_RENDER_CONFIG.backgroundColor).toBe("#ffffff");
		expect(DEFAULT_RENDER_CONFIG.textColor).toBe("#000000");
		expect(DEFAULT_RENDER_CONFIG.lineHeight).toBe(1.2);
		expect(DEFAULT_RENDER_CONFIG.padding).toBe(48);
		expect(DEFAULT_RENDER_CONFIG.fontFamily).toBe("OCRB, monospace");
	});
});
