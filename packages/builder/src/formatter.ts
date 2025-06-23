/**
 * Formats names for MRZ according to ICAO 9303 specification.
 * 
 * Combines surname and given names with proper separators:
 * - Surname is followed by two '<' characters
 * - Given names are separated by single '<' characters
 * - Result is padded to 39 characters with '<' and truncated if longer
 * 
 * @param surname - Primary identifier (family name)
 * @param givenNames - Secondary identifiers (given names, space-separated)
 * @returns Formatted name string (39 characters)
 */
export const formatName = (surname: string, givenNames: string): string => {
  const cleanSurname = surname.toUpperCase().replace(/[^A-Z]/g, '');
  const cleanGivenNames = givenNames.toUpperCase().replace(/[^A-Z\s]/g, '').replace(/\s+/g, '<');
  return `${cleanSurname}<<${cleanGivenNames}`.padEnd(39, '<').substring(0, 39);
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