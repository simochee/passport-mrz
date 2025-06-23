/**
 * Formats names for MRZ according to ICAO 9303 specification.
 * 
 * Combines primary and secondary identifiers with proper separators:
 * - Primary identifier is followed by two '<' characters
 * - Secondary identifiers are separated by single '<' characters
 * - Result is padded to 39 characters with '<' and truncated if longer
 * 
 * @param primaryIdentifier - Primary identifier (surname/family name)
 * @param secondaryIdentifier - Secondary identifier (given names, space-separated)
 * @returns Formatted name string (39 characters)
 */
export const formatName = (primaryIdentifier: string, secondaryIdentifier: string): string => {
  const cleanPrimary = primaryIdentifier.toUpperCase().replace(/[^A-Z]/g, '');
  const cleanSecondary = secondaryIdentifier.toUpperCase().replace(/[^A-Z\s]/g, '').replace(/\s+/g, '<');
  return `${cleanPrimary}<<${cleanSecondary}`.padEnd(39, '<').substring(0, 39);
};

/**
 * Formats date from YYYYMMDD to YYMMDD format for MRZ.
 * 
 * @param date - Date string in YYYYMMDD format
 * @returns Formatted date string in YYMMDD format, or "000000" if invalid
 */
export const formatDate = (date: string): string => {
  const cleaned = date.replace(/\D/g, '');
  if (cleaned.length === 8) {
    return cleaned.substring(2);
  }
  return '000000';
};

/**
 * Formats a field value for MRZ with specified length and filler character.
 * 
 * Removes non-alphanumeric characters, converts to uppercase, pads with filler
 * character to the specified length, and truncates if longer than specified length.
 * 
 * @param value - The value to format
 * @param length - The target length of the formatted field
 * @param filler - The character to use for padding (default: '<')
 * @returns Formatted field string of exact specified length
 */
export const formatField = (value: string, length: number, filler = '<'): string => {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, '').padEnd(length, filler).substring(0, length);
};