import { describe, expect, it } from "vitest";
import { buildMrzLines } from "./builder";
import type { Input } from "./types";

describe("buildMrzLines", () => {
	it("should generate correct MRZ lines for a standard passport", () => {
		const input: Input = {
			documentType: "P",
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

		// Line 1 format: P<issuingState<primaryIdentifier<<secondaryIdentifier<<<<<<<<<<
		expect(line1).toMatch(/^P<JPN/);
		expect(line1).toContain("YAMADA<<TARO");

		// Line 2 should start with document number
		expect(line2).toMatch(/^TK0000001/);
	});

	it("should handle empty personal number", () => {
		const input: Input = {
			documentType: "P",
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
		expect(line1).toMatch(/^P<USA/);
		expect(line2).toMatch(/^US1234567/);
	});

	it("should handle long names correctly", () => {
		const input: Input = {
			documentType: "P",
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
		expect(line1).toMatch(/^P<DEU/);
	});

	it("should handle special characters in names", () => {
		const input: Input = {
			documentType: "P",
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
		expect(line1).toMatch(/^P<FRA/);
	});

	it("should validate MRZ format requirements", () => {
		const input: Input = {
			documentType: "P",
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
		expect(line1[0]).toBe("P");

		// Issuing state should follow
		expect(line1.substring(2, 5)).toBe("CAN");
	});
});
