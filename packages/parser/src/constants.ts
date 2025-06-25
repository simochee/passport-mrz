// TD3 format constants
export const TD3_LINE_LENGTH = 44;
export const TD3_LINES = 2;

// MRZ allowed characters
export const MRZ_ALLOWED_CHARS = /^[A-Z0-9<]+$/;

// Field positions in TD3 format
export const TD3_FIELDS = {
	// Line 1
	documentType: { line: 0, start: 0, length: 2 },
	issuingState: { line: 0, start: 2, length: 3 },
	primaryIdentifier: { line: 0, start: 5, length: 39 }, // includes secondary identifier

	// Line 2
	documentNumber: { line: 1, start: 0, length: 9 },
	documentNumberCheck: { line: 1, start: 9, length: 1 },
	nationality: { line: 1, start: 10, length: 3 },
	dateOfBirth: { line: 1, start: 13, length: 6 },
	dateOfBirthCheck: { line: 1, start: 19, length: 1 },
	sex: { line: 1, start: 20, length: 1 },
	dateOfExpiry: { line: 1, start: 21, length: 6 },
	dateOfExpiryCheck: { line: 1, start: 27, length: 1 },
	personalNumber: { line: 1, start: 28, length: 14 },
	personalNumberCheck: { line: 1, start: 42, length: 1 },
	finalCheck: { line: 1, start: 43, length: 1 },
} as const;
