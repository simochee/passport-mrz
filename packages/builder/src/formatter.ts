/**
 * Formats a field for MRZ: cleans to alphanumeric+spaces, then pads/trims to length.
 *
 * @param value - The value to format (undefined/null will be treated as empty string)
 * @param length - The target length of the formatted field
 * @returns Formatted field string of exact specified length with spaces as filler
 */
export const formatField = (
	value: string | undefined | null,
	length: number,
): string => {
	const cleaned = (value || "").toUpperCase().replace(/[^A-Z0-9\s]/g, "");
	return cleaned.padEnd(length, " ").substring(0, length);
};

/**
 * Formats names for MRZ according to ICAO 9303 specification.
 *
 * According to ICAO 9303, when truncation is needed, the primary identifier
 * should be truncated to leave space for two filler characters and at least
 * the first character of the secondary identifier.
 *
 * @param primaryIdentifier - Primary identifier (surname/family name)
 * @param secondaryIdentifier - Secondary identifier (given names, space-separated)
 * @returns Formatted name string (39 characters) with spaces
 */
export const formatName = (
	primaryIdentifier: string,
	secondaryIdentifier: string,
): string => {
	const cleanPrimary = (primaryIdentifier || "")
		.toUpperCase()
		.replace(/[^A-Z0-9\s]/g, "");
	const cleanSecondary = (secondaryIdentifier || "")
		.toUpperCase()
		.replace(/[^A-Z0-9\s]/g, "");

	// If no secondary identifier, use all 39 characters for primary
	if (!cleanSecondary) {
		return formatField(cleanPrimary, 39);
	}

	const truncatedPrimary = cleanPrimary.substring(0, 36);
	const remainingLength = 39 - truncatedPrimary.length - 2;
	const truncatedSecondary = cleanSecondary.substring(0, remainingLength);

	return formatField(`${truncatedPrimary}  ${truncatedSecondary}`, 39);
};

/**
 * Formats date to 6-character format for MRZ.
 *
 * @param date - Date string
 * @returns First 6 characters (alphanumeric and space only), padded with spaces if shorter
 */
export const formatDate = (date: string): string => {
	return formatField(date, 6);
};

/**
 * Converts spaces to '<' characters for final MRZ line formatting.
 *
 * @param line - The MRZ line with spaces
 * @returns MRZ line with spaces converted to '<'
 */
export const finalizeLine = (line: string): string => {
	return line.replace(/\s/g, "<");
};
