import type { Input } from "./types";
import { calculateCheckDigit } from "./checksum";
import { formatName, formatDate, formatField } from "./formatter";

/**
 * Builds MRZ (Machine Readable Zone) lines for passport documents.
 * 
 * Generates two 44-character lines according to TD3 format specification:
 * - Line 1: Document type, country code, and formatted names
 * - Line 2: Passport number, nationality, dates, personal number, and check digits
 * 
 * All check digits are calculated according to ICAO 9303 standard.
 * 
 * @param input - The passport information to encode in MRZ format
 * @returns A tuple containing [line1, line2] of the MRZ
 */
export const buildMrzLines = (input: Input): [string, string] => {
  const line1 =
    "P" +
    formatField(input.countryCode, 3) +
    formatName(input.surname, input.givenNames);

  const passportNo = formatField(input.passportNo, 9);
  const passportCheckDigit = calculateCheckDigit(passportNo);

  const nationality = formatField(input.nationality, 3);
  const birthDate = formatDate(input.dateOfBirth);
  const birthCheckDigit = calculateCheckDigit(birthDate);

  const sex = formatField(input.sex, 1);
  const expiryDate = formatDate(input.dateOfExpiry);
  const expiryCheckDigit = calculateCheckDigit(expiryDate);

  const personalNo = formatField(input.personalNo, 14);
  const personalCheckDigit = calculateCheckDigit(personalNo);

  const compositeData =
    passportNo +
    passportCheckDigit +
    birthDate +
    birthCheckDigit +
    expiryDate +
    expiryCheckDigit +
    personalNo +
    personalCheckDigit;
  const compositeCheckDigit = calculateCheckDigit(compositeData);

  const line2 =
    passportNo +
    passportCheckDigit +
    nationality +
    birthDate +
    birthCheckDigit +
    sex +
    expiryDate +
    expiryCheckDigit +
    personalNo +
    personalCheckDigit +
    compositeCheckDigit;

  return [line1, line2];
};
