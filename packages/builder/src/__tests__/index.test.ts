import { describe, expect, it } from "vitest";
import type { Input } from "../index";
import { buildMrzLines } from "../index";

describe("index exports", () => {
	it("should export buildMrzLines function", () => {
		expect(typeof buildMrzLines).toBe("function");
	});

	it("should work with exported function", () => {
		const input: Input = {
			documentType: "PP",
			issuingState: "JPN",
			primaryIdentifier: "TEST",
			secondaryIdentifier: "USER",
			documentNumber: "TK1234567",
			nationality: "JPN",
			dateOfBirth: "19900101",
			sex: "M",
			dateOfExpiry: "20301231",
		};

		const [line1, line2] = buildMrzLines(input);

		expect(line1).toHaveLength(44);
		expect(line2).toHaveLength(44);
		expect(line1).toMatch(/^PPJPN/);
		expect(line2).toMatch(/^TK1234567/);
	});
});
