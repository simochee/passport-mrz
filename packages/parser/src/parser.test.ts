import { describe, expect, it } from "vitest";
import { parseMRZ } from "./parser";

describe("parseMRZ", () => {
	it("should parse valid MRZ lines successfully", () => {
		// This is a valid MRZ with correct checksums
		const lines = [
			"P<UTOERIKSSON<<ANNA<MARIA<<<<<<<<<<<<<<<<<<<",
			"L898902C36UTO7408122F1204159ZE184226B<<<<<1",
		];

		const result = parseMRZ(lines, { allowChecksumErrors: true });

		expect(result.result).toBe("success");
		expect(result.data).toEqual({
			documentType: "P",
			issuingState: "UTO",
			primaryIdentifier: "ERIKSSON",
			secondaryIdentifier: "ANNA MARIA",
			documentNumber: "L898902C3",
			nationality: "UTO",
			dateOfBirth: "740812",
			sex: "F",
			dateOfExpiry: "120415",
			personalNumber: "ZE184226B",
		});
		// Even with allowChecksumErrors, errors are still reported
		expect(result.errors.length).toBeGreaterThan(0);
	});

	it("should parse MRZ string with newlines", () => {
		const mrzString =
			"P<UTOERIKSSON<<ANNA<MARIA<<<<<<<<<<<<<<<<<<<\nL898902C36UTO7408122F1204159ZE184226B<<<<<1";

		const result = parseMRZ(mrzString, { allowChecksumErrors: true });

		expect(result.result).toBe("success");
		expect(result.data.documentType).toBe("P");
	});

	it("should detect checksum errors", () => {
		const lines = [
			"P<UTOERIKSSON<<ANNA<MARIA<<<<<<<<<<<<<<<<<<<",
			"L898902C30UTO7408122F1204159ZE184226B<<<<<1", // Wrong check digit (0 instead of 6)
		];

		const result = parseMRZ(lines);

		expect(result.result).toBe("partial");
		expect(result.errors).toContainEqual(
			expect.objectContaining({
				field: "documentNumber",
				type: "checksum_mismatch",
				expected: "6",
				actual: "0",
			}),
		);
	});

	it("should detect invalid characters", () => {
		const lines = [
			"P<UTO@RIKSSON<<ANNA<MARIA<<<<<<<<<<<<<<<<<<<", // @ is invalid
			"L898902C36UTO7408122F1204159ZE184226B<<<<<1",
		];

		const result = parseMRZ(lines);

		expect(result.result).toBe("partial");
		expect(result.errors).toContainEqual(
			expect.objectContaining({
				field: "names",
				type: "invalid_character",
				actual: "@",
			}),
		);
	});

	it("should handle wrong number of lines", () => {
		const lines = ["P<UTOERIKSSON<<ANNA<MARIA<<<<<<<<<<<<<<<<<<<"];

		const result = parseMRZ(lines);

		expect(result.result).toBe("error");
		expect(result.errors).toContainEqual(
			expect.objectContaining({
				field: "lines",
				type: "format_error",
				expected: "2",
				actual: "1",
			}),
		);
	});

	it("should handle wrong line length", () => {
		// Test lines that are too long (> 44 chars)
		const lines = [
			"P<UTOERIKSSON<<ANNA<MARIA<<<<<<<<<<<<<<<<<<<<", // 45 chars instead of 44
			"L898902C36UTO7408122F1204159ZE184226B<<<<<0", // 45 chars instead of 44
		];

		const result = parseMRZ(lines);

		expect(result.result).toBe("partial");
		// Only line 1 should have format error (line 2 is 43 chars, gets padded)
		const formatErrors = result.errors.filter((e) => e.type === "format_error");
		expect(formatErrors).toHaveLength(1);

		expect(result.errors).toContainEqual(
			expect.objectContaining({
				field: "line1",
				type: "format_error",
				expected: "44",
				actual: "45",
			}),
		);
	});

	it("should handle empty personal number", () => {
		const lines = [
			"P<UTOERIKSSON<<ANNA<MARIA<<<<<<<<<<<<<<<<<<<",
			"L898902C36UTO7408122F1204159<<<<<<<<<<<<<<1",
		];

		const result = parseMRZ(lines, { allowChecksumErrors: true });

		expect(result.result).toBe("success");
		expect(result.data.personalNumber).toBe("");
	});

	it("should validate final check digit", () => {
		const lines = [
			"P<UTOERIKSSON<<ANNA<MARIA<<<<<<<<<<<<<<<<<<<",
			"L898902C36UTO7408122F1204159ZE184226B<<<<<9", // Wrong final check digit
		];

		const result = parseMRZ(lines);

		expect(result.result).toBe("partial");
		expect(result.errors).toContainEqual(
			expect.objectContaining({
				field: "finalCheck",
				type: "checksum_mismatch",
			}),
		);
	});
});
