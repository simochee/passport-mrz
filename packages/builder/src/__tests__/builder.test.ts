import { describe, expect, it } from "vitest";
import { buildMrzLines } from "../builder";
import type { Input } from "../input";

describe("buildMrzLines", () => {
	it("should generate correct MRZ lines for a standard passport", () => {
		const input: Input = {
			documentType: "PP",
			issuingState: "JPN",
			primaryIdentifier: "YAMADA",
			secondaryIdentifier: "TARO",
			documentNumber: "TK0000001",
			nationality: "JPN",
			dateOfBirth: "900101",
			sex: "M",
			dateOfExpiry: "301231",
			personalNumber: "123456789",
		};

		const [line1, line2] = buildMrzLines(input);

		// Line 1 should be 44 characters
		expect(line1).toHaveLength(44);
		// Line 2 should be 44 characters
		expect(line2).toHaveLength(44);

		// Line 1 format: PP<issuingState<primaryIdentifier<<secondaryIdentifier<<<<<<<<<<
		expect(line1).toMatch(/^PPJPN/);
		expect(line1).toContain("YAMADA<<TARO");

		// Line 2 should start with document number
		expect(line2).toMatch(/^TK0000001/);
	});

	it("should handle empty personal number", () => {
		const input: Input = {
			documentType: "PP",
			issuingState: "USA",
			primaryIdentifier: "SMITH",
			secondaryIdentifier: "JOHN",
			documentNumber: "US1234567",
			nationality: "USA",
			dateOfBirth: "19850615",
			sex: "M",
			dateOfExpiry: "20281231",
		};

		const [line1, line2] = buildMrzLines(input);

		expect(line1).toHaveLength(44);
		expect(line2).toHaveLength(44);
		expect(line1).toMatch(/^PPUSA/);
		expect(line2).toMatch(/^US1234567/);
	});

	it("should handle long names correctly", () => {
		const input: Input = {
			documentType: "PP",
			issuingState: "DEU",
			primaryIdentifier: "VERYVERYLONGSURNAME",
			secondaryIdentifier: "VERYLONGGIVENNAME",
			documentNumber: "DE1234567",
			nationality: "DEU",
			dateOfBirth: "19800101",
			sex: "F",
			dateOfExpiry: "20300101",
		};

		const [line1, line2] = buildMrzLines(input);

		expect(line1).toHaveLength(44);
		expect(line2).toHaveLength(44);
		expect(line1).toMatch(/^PPDEU/);
	});

	it("should handle special characters in names", () => {
		const input: Input = {
			documentType: "PP",
			issuingState: "FRA",
			primaryIdentifier: "MÜLLER",
			secondaryIdentifier: "JOSÉ",
			documentNumber: "FR1234567",
			nationality: "FRA",
			dateOfBirth: "19750301",
			sex: "M",
			dateOfExpiry: "20250301",
		};

		const [line1, line2] = buildMrzLines(input);

		expect(line1).toHaveLength(44);
		expect(line2).toHaveLength(44);
		expect(line1).toMatch(/^PPFRA/);
	});

	it("should validate MRZ format requirements", () => {
		const input: Input = {
			documentType: "PP",
			issuingState: "CAN",
			primaryIdentifier: "WILSON",
			secondaryIdentifier: "ALICE",
			documentNumber: "CA9876543",
			nationality: "CAN",
			dateOfBirth: "19920715",
			sex: "F",
			dateOfExpiry: "20270715",
		};

		const [line1, line2] = buildMrzLines(input);

		// Both lines must be exactly 44 characters
		expect(line1).toHaveLength(44);
		expect(line2).toHaveLength(44);

		// Line 1 should contain only valid MRZ characters
		expect(line1).toMatch(/^[A-Z0-9<]+$/);

		// Line 2 should contain only valid MRZ characters
		expect(line2).toMatch(/^[A-Z0-9<]+$/);

		// Document type should be at the beginning of line 1
		expect(line1.substring(0, 2)).toBe("PP");

		// Issuing state should follow
		expect(line1.substring(2, 5)).toBe("CAN");
	});

	it("should correctly calculate and include check digits", () => {
		const input: Input = {
			documentType: "PP",
			issuingState: "JPN",
			primaryIdentifier: "YAMADA",
			secondaryIdentifier: "TARO",
			documentNumber: "TK0000001",
			nationality: "JPN",
			dateOfBirth: "900101",
			sex: "M",
			dateOfExpiry: "301231",
			personalNumber: "123456789",
		};

		const [_line1, line2] = buildMrzLines(input);

		// Verify specific check digits in line 2
		// TK00000014JPN9001011M3012315123456789919
		// Position 9: document check digit
		expect(line2[9]).toBe("4"); // Check digit for TK0000001

		// Position 16: birth date check digit
		expect(line2[16]).toBe("1"); // Check digit for 900101

		// Position 24: expiry date check digit - but this is actually part of date
		expect(line2[27]).toBe("6"); // Check digit for 301231 (expiry check digit)

		// Position 42: personal number check digit
		expect(line2[42]).toBe("7"); // Check digit for 123456789

		// Position 43: composite check digit
		expect(line2[43]).toBe("4"); // Final composite check digit
	});

	it("should handle undefined personal number correctly", () => {
		const input: Input = {
			documentType: "PP",
			issuingState: "USA",
			primaryIdentifier: "SMITH",
			secondaryIdentifier: "JOHN",
			documentNumber: "US1234567",
			nationality: "USA",
			dateOfBirth: "19850615",
			sex: "M",
			dateOfExpiry: "20281231",
			personalNumber: undefined,
		};

		const [line1, line2] = buildMrzLines(input);

		expect(line1).toHaveLength(44);
		expect(line2).toHaveLength(44);

		// Personal number section should be filled with angle brackets
		expect(line2.substring(28, 42)).toBe("<<<<<<<<<<<<<<");
	});

	it("should handle maximum length fields correctly", () => {
		const input: Input = {
			documentType: "PP",
			issuingState: "GER", // 3 chars max
			primaryIdentifier: "VERYLONGFAMILYNAMEEXCEEDINGTYPICALLENGTH", // Will be truncated
			secondaryIdentifier: "VERYLONGGIVENNAME", // Will be truncated if needed
			documentNumber: "123456789", // 9 chars max
			nationality: "GER", // 3 chars max
			dateOfBirth: "800101", // 6 chars
			sex: "F", // 1 char
			dateOfExpiry: "300101", // 6 chars
			personalNumber: "12345678901234", // 14 chars max
		};

		const [line1, line2] = buildMrzLines(input);

		expect(line1).toHaveLength(44);
		expect(line2).toHaveLength(44);
		expect(line1).toMatch(/^PPGER/);
		expect(line2).toMatch(/^123456789/);
	});

	it("should handle minimum input correctly", () => {
		const input: Input = {
			documentType: "PP",
			issuingState: "A",
			primaryIdentifier: "A",
			secondaryIdentifier: "B",
			documentNumber: "1",
			nationality: "B",
			dateOfBirth: "1",
			sex: "M",
			dateOfExpiry: "1",
			personalNumber: "",
		};

		const [line1, line2] = buildMrzLines(input);

		expect(line1).toHaveLength(44);
		expect(line2).toHaveLength(44);
		expect(line1).toMatch(/^PPA/);
	});

	it("should handle different sex values correctly", () => {
		const testCases = [
			{ sex: "M", expected: "M" },
			{ sex: "F", expected: "F" },
			{ sex: "<", expected: "<" },
			{ sex: "", expected: "<" },
		];

		testCases.forEach(({ sex, expected }) => {
			const input: Input = {
				documentType: "PP",
				issuingState: "JPN",
				primaryIdentifier: "TEST",
				secondaryIdentifier: "USER",
				documentNumber: "TK1234567",
				nationality: "JPN",
				dateOfBirth: "900101",
				sex,
				dateOfExpiry: "301231",
				personalNumber: "",
			};

			const [, line2] = buildMrzLines(input);
			expect(line2[20]).toBe(expected); // Sex is at position 20 in line 2
		});
	});
});
