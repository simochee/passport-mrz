import { describe, expect, it } from "vitest";
import { buildMrzLines } from "../builder";
import { calculateCheckDigit } from "../checksum";
import { formatDate, formatField, formatName } from "../formatter";
import type { Input } from "../input";

describe("Boundary Conditions", () => {
	describe("formatField boundary tests", () => {
		it("should handle zero length", () => {
			expect(formatField("test", 0)).toBe("");
			expect(formatField("", 0)).toBe("");
		});

		it("should handle very large lengths", () => {
			const result = formatField("A", 100);
			expect(result).toHaveLength(100);
			expect(result[0]).toBe("A");
			expect(result[99]).toBe(" ");
		});

		it("should handle null and undefined consistently", () => {
			expect(formatField(null, 5)).toBe("     ");
			expect(formatField(undefined, 5)).toBe("     ");
			expect(formatField("", 5)).toBe("     ");
		});
	});

	describe("formatName boundary tests", () => {
		it("should handle empty strings", () => {
			expect(formatName("", "")).toHaveLength(39);
			expect(formatName("", "")).toBe(
				"                                       ",
			);
		});

		it("should handle exactly 39 character primary name", () => {
			const name39 = "A".repeat(39);
			const result = formatName(name39, "");
			expect(result).toHaveLength(39);
			expect(result).toBe(name39);
		});

		it("should handle 40+ character primary name", () => {
			const name40 = "A".repeat(40);
			const result = formatName(name40, "");
			expect(result).toHaveLength(39);
			expect(result).toBe("A".repeat(39));
		});

		it("should handle maximum secondary with minimum primary", () => {
			const result = formatName("A", "B".repeat(35));
			expect(result).toHaveLength(39);
			expect(result).toBe(`A  ${"B".repeat(35)} `);
		});

		it("should prioritize secondary identifier space allocation", () => {
			// With 39 total chars: primary + 2 spaces + secondary
			// If secondary needs space, primary gets truncated
			const longPrimary = "P".repeat(30);
			const longSecondary = "S".repeat(20);
			const result = formatName(longPrimary, longSecondary);

			expect(result).toHaveLength(39);
			expect(result).toContain("SS"); // Secondary should be present
		});
	});

	describe("formatDate boundary tests", () => {
		it("should handle exactly 6 characters", () => {
			expect(formatDate("123456")).toBe("123456");
			expect(formatDate("ABCDEF")).toBe("ABCDEF");
		});

		it("should handle more than 6 characters", () => {
			expect(formatDate("1234567890")).toBe("123456");
			expect(formatDate("ABCDEFGHIJ")).toBe("ABCDEF");
		});

		it("should handle less than 6 characters", () => {
			expect(formatDate("12")).toBe("12    ");
			expect(formatDate("ABC")).toBe("ABC   ");
		});

		it("should handle special character patterns", () => {
			expect(formatDate("12-34-56")).toBe("123456");
			expect(formatDate("1!2@3#4$5%6")).toBe("123456");
		});
	});

	describe("calculateCheckDigit boundary tests", () => {
		it("should handle single character", () => {
			expect(calculateCheckDigit("0")).toBe("0"); // 0 * 7 = 0
			expect(calculateCheckDigit("1")).toBe("7"); // 1 * 7 = 7
			expect(calculateCheckDigit("9")).toBe("3"); // 9 * 7 = 63, 63 % 10 = 3
			expect(calculateCheckDigit("A")).toBe("0"); // 10 * 7 = 70, 70 % 10 = 0
			expect(calculateCheckDigit("Z")).toBe("5"); // 35 * 7 = 245, 245 % 10 = 5
		});

		it("should handle maximum realistic MRZ length", () => {
			// MRZ lines are 44 chars, so test with that length
			const maxString = "A".repeat(44);
			const result = calculateCheckDigit(maxString);
			expect(result).toMatch(/^[0-9]$/);
		});

		it("should verify weighting cycle consistency", () => {
			// Test that positions 0, 3, 6... all use weight 7
			expect(calculateCheckDigit("1000")).toBe("7"); // Only position 0 contributes: 1*7=7
			expect(calculateCheckDigit("0001000")).toBe("7"); // Only position 3 contributes: 1*7=7
			expect(calculateCheckDigit("000000100000")).toBe("7"); // Only position 6 contributes: 1*7=7
		});
	});

	describe("buildMrzLines boundary tests", () => {
		it("should handle all fields at maximum length", () => {
			const input: Input = {
				documentType: "PP",
				issuingState: "ABC", // 3 chars
				primaryIdentifier: "A".repeat(50), // Very long
				secondaryIdentifier: "B".repeat(50), // Very long
				documentNumber: "1".repeat(20), // Very long
				nationality: "XYZ", // 3 chars
				dateOfBirth: "1".repeat(20), // Very long
				sex: "M",
				dateOfExpiry: "2".repeat(20), // Very long
				personalNumber: "3".repeat(30), // Very long
			};

			const [line1, line2] = buildMrzLines(input);

			expect(line1).toHaveLength(44);
			expect(line2).toHaveLength(44);

			// Verify all characters are valid MRZ characters
			expect(line1).toMatch(/^[A-Z0-9<]+$/);
			expect(line2).toMatch(/^[A-Z0-9<]+$/);
		});

		it("should handle all fields at minimum length", () => {
			const input: Input = {
				documentType: "",
				issuingState: "",
				primaryIdentifier: "",
				secondaryIdentifier: "",
				documentNumber: "",
				nationality: "",
				dateOfBirth: "",
				sex: "",
				dateOfExpiry: "",
				personalNumber: "",
			};

			const [line1, line2] = buildMrzLines(input);

			expect(line1).toHaveLength(44);
			expect(line2).toHaveLength(44);
		});

		it("should handle mixed empty and filled fields", () => {
			const input: Input = {
				documentType: "PP",
				issuingState: "",
				primaryIdentifier: "SMITH",
				secondaryIdentifier: "",
				documentNumber: "123456789",
				nationality: "",
				dateOfBirth: "900101",
				sex: "",
				dateOfExpiry: "",
				personalNumber: undefined,
			};

			const [line1, line2] = buildMrzLines(input);

			expect(line1).toHaveLength(44);
			expect(line2).toHaveLength(44);

			// Should contain the filled fields
			expect(line1).toContain("SMITH");
			expect(line2).toContain("123456789");
		});
	});

	describe("Performance boundary tests", () => {
		it("should handle large inputs efficiently", () => {
			const largeInput: Input = {
				documentType: "PP",
				issuingState: "TEST",
				primaryIdentifier: "A".repeat(1000),
				secondaryIdentifier: "B".repeat(1000),
				documentNumber: "1".repeat(1000),
				nationality: "TEST",
				dateOfBirth: "900101",
				sex: "M",
				dateOfExpiry: "301231",
				personalNumber: "9".repeat(1000),
			};

			const start = Date.now();
			const [line1, line2] = buildMrzLines(largeInput);
			const duration = Date.now() - start;

			expect(line1).toHaveLength(44);
			expect(line2).toHaveLength(44);
			expect(duration).toBeLessThan(100); // Should complete in under 100ms
		});

		it("should handle repeated calculations consistently", () => {
			const input: Input = {
				documentType: "PP",
				issuingState: "JPN",
				primaryIdentifier: "TEST",
				secondaryIdentifier: "USER",
				documentNumber: "TK1234567",
				nationality: "JPN",
				dateOfBirth: "900101",
				sex: "M",
				dateOfExpiry: "301231",
				personalNumber: "123456789",
			};

			// Run multiple times to ensure consistency
			const results: string[][] = [];
			for (let i = 0; i < 10; i++) {
				results.push(buildMrzLines(input));
			}

			// All results should be identical
			for (let i = 1; i < results.length; i++) {
				expect(results[i][0]).toBe(results[0][0]);
				expect(results[i][1]).toBe(results[0][1]);
			}
		});
	});
});
