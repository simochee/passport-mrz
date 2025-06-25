import type { Input } from "@simochee/passport-mrz-builder";
import { TD3_FIELDS, TD3_LINE_LENGTH, TD3_LINES } from "./constants";
import type { ParseError, ParseOptions, ParseResult } from "./types";
import {
	calculateCheckDigit,
	validateCharacters,
	validateChecksum,
} from "./validator";

export const parseMRZ = (
	lines: string[] | string,
	options: ParseOptions = {},
): ParseResult => {
	const errors: ParseError[] = [];
	const data: Partial<Input> = {};

	// Normalize input
	const mrzLines = Array.isArray(lines)
		? lines
		: lines.split("\n").filter((line) => line.trim());

	// Validate line count
	if (mrzLines.length !== TD3_LINES) {
		errors.push({
			field: "lines",
			type: "format_error",
			expected: `${TD3_LINES}`,
			actual: `${mrzLines.length}`,
			message: `Expected ${TD3_LINES} lines, got ${mrzLines.length}`,
		});
		return { result: "error", data, errors };
	}

	// Validate line lengths and pad if necessary
	for (let i = 0; i < mrzLines.length; i++) {
		if (mrzLines[i].length < TD3_LINE_LENGTH) {
			// Pad with < to make it 44 characters
			mrzLines[i] = mrzLines[i].padEnd(TD3_LINE_LENGTH, "<");
		} else if (mrzLines[i].length > TD3_LINE_LENGTH) {
			errors.push({
				field: `line${i + 1}`,
				type: "format_error",
				expected: `${TD3_LINE_LENGTH}`,
				actual: `${mrzLines[i].length}`,
				message: `Line ${i + 1} should be ${TD3_LINE_LENGTH} characters, got ${mrzLines[i].length}`,
			});
			// Truncate the line to 44 characters for processing
			mrzLines[i] = mrzLines[i].substring(0, TD3_LINE_LENGTH);
		}
	}

	// Extract fields
	const extractField = (field: keyof typeof TD3_FIELDS): string => {
		const pos = TD3_FIELDS[field];
		return (
			mrzLines[pos.line]?.substring(pos.start, pos.start + pos.length) || ""
		);
	};

	// Parse Line 1
	const documentType = extractField("documentType").replace(/<+$/, "");
	if (documentType) {
		data.documentType = documentType;
		const charError = validateCharacters(documentType, "documentType");
		if (charError) errors.push(charError);
	}

	const issuingState = extractField("issuingState");
	if (issuingState) {
		data.issuingState = issuingState;
		const charError = validateCharacters(issuingState, "issuingState");
		if (charError) errors.push(charError);
	}

	// Parse names
	const namesField = extractField("primaryIdentifier");
	if (namesField) {
		const [primary, ...secondary] = namesField.split("<<");
		data.primaryIdentifier = primary
			.replace(/<+$/, "")
			.replace(/</g, " ")
			.trim();
		data.secondaryIdentifier = secondary
			.join(" ")
			.replace(/<+$/, "")
			.replace(/</g, " ")
			.trim();

		const charError = validateCharacters(namesField, "names");
		if (charError) errors.push(charError);
	}

	// Parse Line 2
	const documentNumber = extractField("documentNumber").replace(/<+$/, "");
	if (documentNumber) {
		data.documentNumber = documentNumber;
		const charError = validateCharacters(documentNumber, "documentNumber");
		if (charError) errors.push(charError);

		// Validate document number checksum
		const documentNumberCheck = extractField("documentNumberCheck");
		const expectedCheck = calculateCheckDigit(extractField("documentNumber"));
		const checksumError = validateChecksum(
			documentNumber,
			expectedCheck,
			documentNumberCheck,
			"documentNumber",
		);
		if (checksumError) errors.push(checksumError);
	}

	const nationality = extractField("nationality");
	if (nationality) {
		data.nationality = nationality;
		const charError = validateCharacters(nationality, "nationality");
		if (charError) errors.push(charError);
	}

	const dateOfBirth = extractField("dateOfBirth");
	if (dateOfBirth) {
		data.dateOfBirth = dateOfBirth;
		const charError = validateCharacters(dateOfBirth, "dateOfBirth");
		if (charError) errors.push(charError);

		// Validate date of birth checksum
		const dateOfBirthCheck = extractField("dateOfBirthCheck");
		const expectedCheck = calculateCheckDigit(dateOfBirth);
		const checksumError = validateChecksum(
			dateOfBirth,
			expectedCheck,
			dateOfBirthCheck,
			"dateOfBirth",
		);
		if (checksumError) errors.push(checksumError);
	}

	const sex = extractField("sex");
	if (sex) {
		data.sex = sex;
		const charError = validateCharacters(sex, "sex");
		if (charError) errors.push(charError);
	}

	const dateOfExpiry = extractField("dateOfExpiry");
	if (dateOfExpiry) {
		data.dateOfExpiry = dateOfExpiry;
		const charError = validateCharacters(dateOfExpiry, "dateOfExpiry");
		if (charError) errors.push(charError);

		// Validate date of expiry checksum
		const dateOfExpiryCheck = extractField("dateOfExpiryCheck");
		const expectedCheck = calculateCheckDigit(dateOfExpiry);
		const checksumError = validateChecksum(
			dateOfExpiry,
			expectedCheck,
			dateOfExpiryCheck,
			"dateOfExpiry",
		);
		if (checksumError) errors.push(checksumError);
	}

	const personalNumberRaw = extractField("personalNumber");
	const personalNumber = personalNumberRaw.replace(/<+$/, "");
	// Always set personalNumber, even if empty
	data.personalNumber = personalNumber;

	const charError = validateCharacters(personalNumberRaw, "personalNumber");
	if (charError) errors.push(charError);

	// Validate personal number checksum
	const personalNumberCheck = extractField("personalNumberCheck");
	const expectedCheck = calculateCheckDigit(personalNumberRaw);
	const checksumError = validateChecksum(
		personalNumber,
		expectedCheck,
		personalNumberCheck,
		"personalNumber",
	);
	if (checksumError) errors.push(checksumError);

	// Validate final check digit
	const finalCheck = extractField("finalCheck");
	const compositeString =
		extractField("documentNumber") +
		extractField("documentNumberCheck") +
		extractField("dateOfBirth") +
		extractField("dateOfBirthCheck") +
		extractField("dateOfExpiry") +
		extractField("dateOfExpiryCheck") +
		extractField("personalNumber") +
		extractField("personalNumberCheck");

	const expectedFinalCheck = calculateCheckDigit(compositeString);
	const finalChecksumError = validateChecksum(
		"composite",
		expectedFinalCheck,
		finalCheck,
		"finalCheck",
	);
	if (finalChecksumError) errors.push(finalChecksumError);

	// Determine result
	let result: ParseResult["result"] = "success";
	if (errors.length > 0) {
		// If only checksum errors and option allows them, still consider success
		const hasOnlyChecksumErrors = errors.every(
			(err) => err.type === "checksum_mismatch",
		);
		if (options.allowChecksumErrors && hasOnlyChecksumErrors) {
			result = "success";
		} else {
			result = Object.keys(data).length > 0 ? "partial" : "error";
		}
	}

	return { result, data, errors };
};
