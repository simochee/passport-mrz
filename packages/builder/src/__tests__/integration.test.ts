import { describe, expect, it } from "vitest";
import { buildMrzLines } from "../builder";
import { calculateCheckDigit } from "../checksum";
import { formatDate, formatField, formatName } from "../formatter";
import type { Input } from "../input";

describe("Integration Tests", () => {
	it("should generate real-world passport MRZ correctly", () => {
		const input: Input = {
			documentType: "PP",
			issuingState: "JPN",
			primaryIdentifier: "YAMADA",
			secondaryIdentifier: "TARO",
			documentNumber: "XS1234567",
			nationality: "JPN",
			dateOfBirth: "900101",
			sex: "M",
			dateOfExpiry: "301231",
			personalNumber: "123456789012345",
		};

		const [line1, line2] = buildMrzLines(input);

		// Expected format verification
		expect(line1).toBe("PPJPNYAMADA<<TARO<<<<<<<<<<<<<<<<<<<<<<<<<<<");
		expect(line2).toBe("XS12345673JPN9001011M30123161234567890123452");

		// Verify total length
		expect(line1).toHaveLength(44);
		expect(line2).toHaveLength(44);
	});

	it("should handle complex name formatting scenarios", () => {
		const input: Input = {
			documentType: "PP",
			issuingState: "DEU",
			primaryIdentifier: "VON-MÜLLER-SCHMIDT",
			secondaryIdentifier: "ANNA-MARIA JOSÉ",
			documentNumber: "DE1234567",
			nationality: "DEU",
			dateOfBirth: "851215",
			sex: "F",
			dateOfExpiry: "301215",
		};

		const [line1, line2] = buildMrzLines(input);

		expect(line1).toHaveLength(44);
		expect(line2).toHaveLength(44);

		// Verify special characters are cleaned
		expect(line1).not.toContain("-");
		expect(line1).not.toContain("Ü");
		expect(line1).not.toContain("É");
	});

	it("should validate end-to-end MRZ components individually", () => {
		const input: Input = {
			documentType: "PP",
			issuingState: "USA",
			primaryIdentifier: "SMITH",
			secondaryIdentifier: "JOHN MICHAEL",
			documentNumber: "US9876543",
			nationality: "USA",
			dateOfBirth: "800701",
			sex: "M",
			dateOfExpiry: "350701",
			personalNumber: "987654321",
		};

		// Test individual components
		const formattedName = formatName(
			input.primaryIdentifier,
			input.secondaryIdentifier,
		);
		expect(formattedName).toBe("SMITH  JOHN MICHAEL                    ");

		const formattedDocNumber = formatField(input.documentNumber, 9);
		expect(formattedDocNumber).toBe("US9876543");

		const docCheckDigit = calculateCheckDigit(formattedDocNumber);
		expect(docCheckDigit).toBe("6");

		const formattedBirthDate = formatDate(input.dateOfBirth);
		expect(formattedBirthDate).toBe("800701");

		const birthCheckDigit = calculateCheckDigit(formattedBirthDate);
		expect(birthCheckDigit).toBe("6");

		// Test complete MRZ generation
		const [line1, line2] = buildMrzLines(input);

		expect(line1).toContain("SMITH<<JOHN<MICHAEL");
		expect(line2).toContain("US98765436");
		expect(line2).toContain("8007016");
	});

	it("should handle minimal passport data", () => {
		const input: Input = {
			documentType: "PP",
			issuingState: "X",
			primaryIdentifier: "A",
			secondaryIdentifier: "",
			documentNumber: "1",
			nationality: "X",
			dateOfBirth: "1",
			sex: "",
			dateOfExpiry: "1",
		};

		const [line1, line2] = buildMrzLines(input);

		expect(line1).toHaveLength(44);
		expect(line2).toHaveLength(44);

		// Verify minimal data is properly formatted
		expect(line1).toMatch(/^PPX</);
		expect(line2).toMatch(/^1/);
	});

	it("should generate consistent results for identical inputs", () => {
		const input: Input = {
			documentType: "PP",
			issuingState: "FRA",
			primaryIdentifier: "DUPONT",
			secondaryIdentifier: "MARIE",
			documentNumber: "FR5678901",
			nationality: "FRA",
			dateOfBirth: "751120",
			sex: "F",
			dateOfExpiry: "281120",
			personalNumber: "ABC123DEF456",
		};

		const [line1_1, line2_1] = buildMrzLines(input);
		const [line1_2, line2_2] = buildMrzLines(input);

		expect(line1_1).toBe(line1_2);
		expect(line2_1).toBe(line2_2);
	});

	it("should properly format line endings and spacing", () => {
		const input: Input = {
			documentType: "PP",
			issuingState: "CAN",
			primaryIdentifier: "WILSON",
			secondaryIdentifier: "ROBERT",
			documentNumber: "CA1111111",
			nationality: "CAN",
			dateOfBirth: "900515",
			sex: "M",
			dateOfExpiry: "330515",
			personalNumber: "111222333",
		};

		const [line1, line2] = buildMrzLines(input);

		// Verify no trailing/leading whitespace
		expect(line1.trim()).toBe(line1);
		expect(line2.trim()).toBe(line2);

		// Verify all spaces are converted to angle brackets
		expect(line1).not.toContain(" ");
		expect(line2).not.toContain(" ");

		// Verify proper angle bracket usage
		expect(line1).toContain("<<");
		expect(line2).toMatch(/[A-Z0-9<]/);
	});

	it("should validate check digit calculations in context", () => {
		const input: Input = {
			documentType: "PP",
			issuingState: "AUS",
			primaryIdentifier: "BROWN",
			secondaryIdentifier: "DAVID",
			documentNumber: "AU7654321",
			nationality: "AUS",
			dateOfBirth: "850320",
			sex: "M",
			dateOfExpiry: "300320",
			personalNumber: "555666777",
		};

		const [, line2] = buildMrzLines(input);

		// Extract and verify individual check digits
		const docNumber = line2.substring(0, 9);
		const docCheckDigit = line2[9];
		expect(docCheckDigit).toBe(calculateCheckDigit(docNumber));

		const birthDate = line2.substring(13, 19);
		const birthCheckDigit = line2[19];
		expect(birthCheckDigit).toBe(calculateCheckDigit(birthDate));

		const expiryDate = line2.substring(21, 27);
		const expiryCheckDigit = line2[27];
		expect(expiryCheckDigit).toBe(calculateCheckDigit(expiryDate));

		const personalNumber = line2.substring(28, 42);
		const personalCheckDigit = line2[42];
		expect(personalCheckDigit).toBe(calculateCheckDigit(personalNumber));
	});
});

describe("Edge Case Integration", () => {
	it("should handle passport with all maximum length fields", () => {
		const input: Input = {
			documentType: "PP",
			issuingState: "ABC", // 3 char max
			primaryIdentifier: "VERYLONGFAMILYNAMETHATSHOULDBETRUNCATED", // Long name
			secondaryIdentifier: "VERYLONGGIVENNAMETHATSHOULDALSOBETRUNCATED", // Long given name
			documentNumber: "123456789", // 9 char max
			nationality: "XYZ", // 3 char max
			dateOfBirth: "999999", // 6 char max
			sex: "X", // 1 char
			dateOfExpiry: "888888", // 6 char max
			personalNumber: "12345678901234", // 14 char max
		};

		const [line1, line2] = buildMrzLines(input);

		expect(line1).toHaveLength(44);
		expect(line2).toHaveLength(44);

		// Verify truncation behavior
		expect(line1).toMatch(/^PPABC/);
		expect(line2).toMatch(/^123456789/);
	});

	it("should handle passport with unicode and special characters", () => {
		const input: Input = {
			documentType: "PP",
			issuingState: "FRA",
			primaryIdentifier: "FRANÇOIS-ANDRÉ",
			secondaryIdentifier: "JOSÉ-MARÍA",
			documentNumber: "FR@123#456",
			nationality: "FRA",
			dateOfBirth: "90/01/01",
			sex: "M",
			dateOfExpiry: "30-12-31",
			personalNumber: "ABC@123#DEF",
		};

		const [line1, line2] = buildMrzLines(input);

		expect(line1).toHaveLength(44);
		expect(line2).toHaveLength(44);

		// Verify special characters are cleaned
		expect(line1).toMatch(/^[A-Z0-9<]+$/);
		expect(line2).toMatch(/^[A-Z0-9<]+$/);
	});

	it("should handle empty and undefined fields gracefully", () => {
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
			personalNumber: undefined,
		};

		const [line1, line2] = buildMrzLines(input);

		expect(line1).toHaveLength(44);
		expect(line2).toHaveLength(44);

		// Should be all angle brackets (spaces converted)
		expect(line1).toMatch(/^[<]+$/);
		expect(line2).toMatch(/^[<0-9]+$/); // Check digits will be numbers
	});
});
