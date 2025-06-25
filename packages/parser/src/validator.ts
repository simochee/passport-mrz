import { MRZ_ALLOWED_CHARS } from "./constants";
import type { ParseError } from "./types";

export const validateCharacters = (
	value: string,
	field: string,
): ParseError | null => {
	if (!MRZ_ALLOWED_CHARS.test(value)) {
		const invalidChars = value
			.split("")
			.filter((char) => !MRZ_ALLOWED_CHARS.test(char));
		return {
			field,
			type: "invalid_character",
			actual: invalidChars.join(", "),
			message: `Field ${field} contains invalid characters: ${invalidChars.join(", ")}`,
		};
	}
	return null;
};

export const validateChecksum = (
	_value: string,
	expectedChecksum: string,
	actualChecksum: string,
	field: string,
): ParseError | null => {
	if (expectedChecksum !== actualChecksum) {
		return {
			field,
			type: "checksum_mismatch",
			expected: expectedChecksum,
			actual: actualChecksum,
			message: `Checksum mismatch for ${field}: expected ${expectedChecksum}, got ${actualChecksum}`,
		};
	}
	return null;
};

export const calculateCheckDigit = (str: string): string => {
	const weights = [7, 3, 1];
	let sum = 0;

	for (let i = 0; i < str.length; i++) {
		const char = str[i];
		let value: number;

		if (char >= "0" && char <= "9") {
			value = parseInt(char, 10);
		} else if (char >= "A" && char <= "Z") {
			value = char.charCodeAt(0) - "A".charCodeAt(0) + 10;
		} else {
			value = 0;
		}

		sum += value * weights[i % 3];
	}

	return (sum % 10).toString();
};
