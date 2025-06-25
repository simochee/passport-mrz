import type { Input } from "@simochee/passport-mrz-builder";

export type ParseError = {
	field: string;
	type: "invalid_character" | "checksum_mismatch" | "format_error";
	expected?: string;
	actual?: string;
	message: string;
};

export type ParseOptions = {
	/** Whether to allow checksum errors and still return success if all other validations pass */
	allowChecksumErrors?: boolean;
};

export type ParseResult = {
	result: "success" | "partial" | "error";
	data: Partial<Input>;
	errors: ParseError[];
};
