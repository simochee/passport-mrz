/**
 * @fileoverview Passport MRZ (Machine Readable Zone) builder library.
 *
 * This library provides functionality to generate TD3 format MRZ lines for passport
 * documents according to ICAO 9303 specifications.
 */

export { buildMrzLines } from "./builder";
export { calculateCheckDigit } from "./checksum";
export { finalizeLine, formatDate, formatField, formatName } from "./formatter";
export type { Input } from "./input";
