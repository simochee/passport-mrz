/**
 * Input data for generating passport MRZ (Machine Readable Zone).
 * Follows TD3 format specification for passport documents.
 */
export type Input = {
  /** Document type identifier (typically "P" for passport) */
  type: string;
  /** ISO 3166-1 alpha-3 country code of the issuing state */
  countryCode: string;
  /** Passport number */
  passportNo: string;
  /** Primary identifier (surname) */
  surname: string;
  /** Secondary identifier (given names) */
  givenNames: string;
  /** ISO 3166-1 alpha-3 nationality code */
  nationality: string;
  /** Date of birth in YYYYMMDD format */
  dateOfBirth: string;
  /** Personal number or identifier */
  personalNo: string;
  /** Sex (M/F/<) */
  sex: string;
  /** Place of birth */
  placeOfBirth: string;
  /** Date of issue in YYYYMMDD format */
  dateOfIssue: string;
  /** Date of expiry in YYYYMMDD format */
  dateOfExpiry: string;
};