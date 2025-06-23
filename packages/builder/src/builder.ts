import type { Input } from "./types";
import { calculateCheckDigit } from "./checksum";
import { formatName, formatDate, formatField } from "./formatter";

/**
 * Builds MRZ (Machine Readable Zone) lines for passport documents.
 * 
 * Generates two 44-character lines according to TD3 format specification:
 * - Line 1: Document type, issuing state, and formatted identifiers
 * - Line 2: Document number, nationality, dates, personal number, and check digits
 * 
 * All check digits are calculated according to ICAO 9303 standard.
 * 
 * @param input - The passport information to encode in MRZ format using ICAO 9303 field names
 * @returns A tuple containing [line1, line2] of the MRZ
 */
export const buildMrzLines = (input: Input): [string, string] => {
  const line1 =
    input.documentType +
    '<' +
    formatField(input.issuingState, 3) +
    formatName(input.primaryIdentifier, input.secondaryIdentifier);

  const documentNumber = formatField(input.documentNumber, 9);
  const documentCheckDigit = calculateCheckDigit(documentNumber);

  const nationality = formatField(input.nationality, 3);
  const birthDate = formatDate(input.dateOfBirth);
  const birthCheckDigit = calculateCheckDigit(birthDate);

  const sex = formatField(input.sex, 1);
  const expiryDate = formatDate(input.dateOfExpiry);
  const expiryCheckDigit = calculateCheckDigit(expiryDate);

  const personalNumber = formatField(input.personalNumber || '', 14);
  const personalCheckDigit = calculateCheckDigit(personalNumber);

  const compositeData =
    documentNumber +
    documentCheckDigit +
    birthDate +
    birthCheckDigit +
    expiryDate +
    expiryCheckDigit +
    personalNumber +
    personalCheckDigit;
  const compositeCheckDigit = calculateCheckDigit(compositeData);

  const line2 =
    documentNumber +
    documentCheckDigit +
    nationality +
    birthDate +
    birthCheckDigit +
    sex +
    expiryDate +
    expiryCheckDigit +
    personalNumber +
    personalCheckDigit +
    compositeCheckDigit;

  return [line1, line2];
};
