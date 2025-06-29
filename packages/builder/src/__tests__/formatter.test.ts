import { describe, expect, it } from "vitest";
import {
	finalizeLine,
	formatDate,
	formatField,
	formatName,
} from "../formatter";

describe("formatName", () => {
	it("should format standard names correctly", () => {
		const result = formatName("YAMADA", "TARO");
		expect(result).toBe("YAMADA  TARO                           ");
		expect(result).toHaveLength(39);
	});

	it("should handle multiple given names", () => {
		const result = formatName("SMITH", "JOHN MICHAEL");
		expect(result).toBe("SMITH  JOHN MICHAEL                    ");
		expect(result).toHaveLength(39);
	});

	it("should handle long names by truncating primary while preserving secondary", () => {
		const result = formatName(
			"VERYLONGFAMILYNAMEHERE",
			"VERYLONGGIVENNAMEHERE",
		);
		expect(result).toHaveLength(39);
		// Primary (22 chars) + 2 spaces + secondary fits remaining 15 chars
		expect(result).toBe("VERYLONGFAMILYNAMEHERE  VERYLONGGIVENNA");
	});

	it("should clean non-alphabetic characters", () => {
		const result = formatName("O'CONNOR", "MARY-JANE");
		expect(result).toBe("OCONNOR  MARYJANE                      ");
		expect(result).toHaveLength(39);
	});

	it("should handle empty secondary identifier", () => {
		const result = formatName("YAMADA", "");
		expect(result).toBe("YAMADA                                 ");
		expect(result).toHaveLength(39);
	});

	it("should handle single character names", () => {
		const result = formatName("A", "B");
		expect(result).toBe("A  B                                   ");
		expect(result).toHaveLength(39);
	});

	it("should handle very long primary identifier with short secondary", () => {
		const result = formatName("VERYLONGFAMILYNAMEHEREVERYLONGFAMILYNAME", "T");
		expect(result).toHaveLength(39);
		// Primary truncated to 36 chars, 2 spaces, then 1 char secondary
		expect(result).toBe("VERYLONGFAMILYNAMEHEREVERYLONGFAMILY  T");
	});

	it("should use full length for primary when secondary is empty", () => {
		const result = formatName(
			"VERYLONGFAMILYNAMEHEREVERYLONGFAMILYNAMEHERE",
			"",
		);
		expect(result).toHaveLength(39);
		expect(result).toBe("VERYLONGFAMILYNAMEHEREVERYLONGFAMILYNAM");
	});
});

describe("formatDate", () => {
	it("should handle 6-character strings", () => {
		expect(formatDate("900101")).toBe("900101");
		expect(formatDate("ABC123")).toBe("ABC123");
		expect(formatDate("30 231")).toBe("30 231");
	});

	it("should remove non-alphanumeric characters except spaces", () => {
		expect(formatDate("90-01-01")).toBe("900101");
		expect(formatDate("30/12/31")).toBe("301231");
		expect(formatDate("85.06.15")).toBe("850615");
		expect(formatDate("AB@C#1$2%3")).toBe("ABC123");
	});

	it("should pad short strings with trailing spaces", () => {
		expect(formatDate("123")).toBe("123   ");
		expect(formatDate("ABC")).toBe("ABC   ");
		expect(formatDate("12 45")).toBe("12 45 ");
		expect(formatDate("")).toBe("      ");
	});

	it("should take first 6 characters from long strings", () => {
		expect(formatDate("19900101")).toBe("199001");
		expect(formatDate("ABCDEFGHIJ")).toBe("ABCDEF");
		expect(formatDate("12 34 56 78")).toBe("12 34 ");
		expect(formatDate("123456789")).toBe("123456");
	});

	it("should preserve alphanumeric and space characters", () => {
		expect(formatDate("A1 B2 C3")).toBe("A1 B2 ");
		expect(formatDate("abc123XYZ")).toBe("ABC123");
		expect(formatDate("12@34#56$")).toBe("123456");
	});
});

describe("formatField", () => {
	it("should format document numbers correctly", () => {
		expect(formatField("TK0000001", 9)).toBe("TK0000001");
		expect(formatField("us1234567", 9)).toBe("US1234567");
	});

	it("should pad short values", () => {
		expect(formatField("ABC", 5)).toBe("ABC  ");
		expect(formatField("12", 4)).toBe("12  ");
	});

	it("should truncate long values", () => {
		expect(formatField("VERYLONGVALUE", 5)).toBe("VERYL");
		expect(formatField("1234567890", 5)).toBe("12345");
	});

	it("should clean non-alphanumeric characters", () => {
		expect(formatField("A-B_C.D@E", 10)).toBe("ABCDE     ");
		expect(formatField("12-34 56", 10)).toBe("1234 56   ");
	});

	it("should handle undefined and null values", () => {
		expect(formatField(undefined, 5)).toBe("     ");
		expect(formatField(null, 3)).toBe("   ");
		expect(formatField("", 5)).toBe("     ");
	});

	it("should format nationality codes correctly", () => {
		expect(formatField("JPN", 3)).toBe("JPN");
		expect(formatField("USA", 3)).toBe("USA");
		expect(formatField("DE", 3)).toBe("DE ");
	});

	it("should format sex field correctly", () => {
		expect(formatField("M", 1)).toBe("M");
		expect(formatField("F", 1)).toBe("F");
		expect(formatField("", 1)).toBe(" ");
	});

	it("should preserve spaces and convert to uppercase", () => {
		expect(formatField("hello world", 15)).toBe("HELLO WORLD    ");
		expect(formatField("Test123", 10)).toBe("TEST123   ");
		expect(formatField("A B C 1 2 3", 15)).toBe("A B C 1 2 3    ");
	});
});

describe("finalizeLine", () => {
	it("should convert spaces to angle brackets", () => {
		expect(finalizeLine("P JPN TEST USER")).toBe("P<JPN<TEST<USER");
		expect(finalizeLine("HELLO WORLD")).toBe("HELLO<WORLD");
	});

	it("should handle strings with no spaces", () => {
		expect(finalizeLine("ABCDEFG123")).toBe("ABCDEFG123");
		expect(finalizeLine("")).toBe("");
	});

	it("should handle strings with only spaces", () => {
		expect(finalizeLine("   ")).toBe("<<<");
		expect(finalizeLine(" ")).toBe("<");
	});

	it("should handle mixed content", () => {
		expect(finalizeLine("A B1 C2 D3")).toBe("A<B1<C2<D3");
		expect(finalizeLine("P JPN YAMADA  TARO")).toBe("P<JPN<YAMADA<<TARO");
	});

	it("should handle strings with multiple consecutive spaces", () => {
		expect(finalizeLine("A  B   C")).toBe("A<<B<<<C");
		expect(finalizeLine("TEST     USER")).toBe("TEST<<<<<USER");
	});
});
