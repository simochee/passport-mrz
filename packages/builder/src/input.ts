/**
 * Input data for generating passport MRZ (Machine Readable Zone).
 * Follows TD3 format specification for passport documents according to ICAO 9303 standard.
 */
export type Input = {
	/** Document Type (2 characters: "PP" for ordinary passport, "PE" for emergency, "PD" for diplomatic, "PS" for service) */
	documentType: string;
	/** Issuing State (ISO 3166-1 alpha-3 country code) */
	issuingState: string;
	/** Document Number (passport number) */
	documentNumber: string;
	/** Primary Identifier (surname/family name) */
	primaryIdentifier: string;
	/** Secondary Identifier (given names) */
	secondaryIdentifier: string;
	/** Nationality (ISO 3166-1 alpha-3 country code) */
	nationality: string;
	/** Date of Birth (YYMMDD format) */
	dateOfBirth: string;
	/** Personal Number (optional, may be empty) */
	personalNumber?: string;
	/** Sex (M/F/<) */
	sex: string;
	/** Date of Expiry (YYMMDD format) */
	dateOfExpiry: string;
};
