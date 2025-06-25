import type { Input } from "@simochee/passport-mrz-builder";
import { describe, expect, it } from "vitest";
import { renderMRZToCanvas, renderMRZToPNG } from "../index";

describe("index exports", () => {
	const testInput: Input = {
		documentType: "PP",
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

	it("should export renderMRZToCanvas function", () => {
		expect(typeof renderMRZToCanvas).toBe("function");
	});

	it("should export renderMRZToPNG function", () => {
		expect(typeof renderMRZToPNG).toBe("function");
	});

	it("should generate PNG buffer", async () => {
		const buffer = await renderMRZToPNG(testInput);

		expect(buffer).toBeInstanceOf(Buffer);
		expect(buffer.length).toBeGreaterThan(0);

		// PNG署名をチェック (89 50 4E 47)
		expect(buffer[0]).toBe(0x89);
		expect(buffer[1]).toBe(0x50);
		expect(buffer[2]).toBe(0x4e);
		expect(buffer[3]).toBe(0x47);
	});

	it("should generate consistent PNG for same input", async () => {
		const buffer1 = await renderMRZToPNG(testInput);
		const buffer2 = await renderMRZToPNG(testInput);

		expect(buffer1.length).toBe(buffer2.length);
		expect(buffer1.equals(buffer2)).toBe(true);
	});

	it("should generate different PNG for different input", async () => {
		const differentInput: Input = {
			documentType: "PP",
			issuingCountry: "USA",
			surname: "SMITH",
			givenNames: "JOHN",
			documentNumber: "AB9876543",
			nationality: "USA",
			birthDate: "850315",
			sex: "F",
			expiryDate: "351231",
			personalNumber: "987654321098765",
		};

		const buffer1 = await renderMRZToPNG(testInput);
		const buffer2 = await renderMRZToPNG(differentInput);

		expect(buffer1.equals(buffer2)).toBe(false);
	});
});
