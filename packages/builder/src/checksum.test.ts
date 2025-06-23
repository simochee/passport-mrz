import { describe, expect, it } from "vitest";
import { calculateCheckDigit } from "./checksum";

describe("calculateCheckDigit", () => {
	it("should calculate correct check digit for numeric strings", () => {
		// Test with known values
		expect(calculateCheckDigit("123456789")).toBe("7");
		expect(calculateCheckDigit("000000000")).toBe("0");
		expect(calculateCheckDigit("111111111")).toBe("3");
	});

	it("should calculate correct check digit for alphabetic strings", () => {
		expect(calculateCheckDigit("ABC")).toBe("5");
		expect(calculateCheckDigit("XYZ")).toBe("8");
	});

	it("should calculate correct check digit for mixed strings", () => {
		expect(calculateCheckDigit("AB123CD45")).toBe("7");
		expect(calculateCheckDigit("P<JPN")).toBe("8");
	});

	it("should handle empty string", () => {
		expect(calculateCheckDigit("")).toBe("0");
	});

	it("should handle special characters as zero", () => {
		expect(calculateCheckDigit("ABC<<<<")).toBe("5"); // Same as 'ABC000'
		expect(calculateCheckDigit("123<<456")).toBe("3"); // Same as '12300456'
	});

	it("should follow ICAO 9303 weighting pattern", () => {
		// Test with single characters to verify weighting
		expect(calculateCheckDigit("1")).toBe("7"); // 1 * 7 % 10 = 7
		expect(calculateCheckDigit("11")).toBe("0"); // (1*7 + 1*3) % 10 = 0
		expect(calculateCheckDigit("111")).toBe("1"); // (1*7 + 1*3 + 1*1) % 10 = 1
	});

	it("should handle document numbers correctly", () => {
		// Test typical passport document numbers
		expect(calculateCheckDigit("TK0000001")).toBe("4");
		expect(calculateCheckDigit("US1234567")).toBe("2");
		expect(calculateCheckDigit("DE1234567")).toBe("1");
	});

	it("should handle dates correctly", () => {
		// Test typical date formats (YYMMDD)
		expect(calculateCheckDigit("900101")).toBe("1"); // 1990-01-01
		expect(calculateCheckDigit("851215")).toBe("4"); // 1985-12-15
	});

	it("should be consistent with multiple calls", () => {
		const input = "TESTSTRING123";
		const result1 = calculateCheckDigit(input);
		const result2 = calculateCheckDigit(input);
		expect(result1).toBe(result2);
	});
});
