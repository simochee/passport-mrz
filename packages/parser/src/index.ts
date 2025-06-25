export { MRZ_ALLOWED_CHARS, TD3_LINE_LENGTH, TD3_LINES } from "./constants";
export { parseMRZ } from "./parser";
export type { ParseError, ParseOptions, ParseResult } from "./types";
export { calculateCheckDigit } from "./validator";
