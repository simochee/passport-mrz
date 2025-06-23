import type { Input } from "./types";
import { calculateCheckDigit } from "./checksum";
import { formatName, formatDate, formatField } from "./formatter";

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
