import type { PassportInput } from "../types/passport";

export const parseQuery = (): Partial<PassportInput> => {
	const url = new URL(window.location.href);

	const values: Partial<PassportInput> = {
		type: url.searchParams.get("type") || undefined,
		countryCode: url.searchParams.get("countryCode") || undefined,
		passportNo: url.searchParams.get("passportNo") || undefined,
		surname: url.searchParams.get("surname") || undefined,
		givenNames: url.searchParams.get("givenNames") || undefined,
		nationality: url.searchParams.get("nationality") || undefined,
		dateOfBirth: url.searchParams.get("dateOfBirth") || undefined,
		personalNo: url.searchParams.get("personalNo") || undefined,
		sex: url.searchParams.get("sex") || undefined,
		dateOfExpiry: url.searchParams.get("dateOfExpiry") || undefined,
	};

	for (const key of Object.keys(values)) {
		url.searchParams.delete(key);
	}
	window.history.replaceState({}, "", url.href);

	return values;
};
