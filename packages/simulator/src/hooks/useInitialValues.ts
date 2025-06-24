import { useMemo } from "react";
import type { PassportInput } from "../types/passport";
import { parseHash } from "../utils/hash";
import { parseQuery } from "../utils/query";

export const useInitialValues = (): PassportInput => {
	const queryValues = useMemo(() => parseQuery(), []);
	const hashValues = useMemo(() => parseHash(), []);

	return {
		type: queryValues.type ?? hashValues.type ?? "P",
		countryCode: queryValues.countryCode ?? hashValues.countryCode ?? "",
		passportNo: queryValues.passportNo ?? hashValues.passportNo ?? "",
		surname: queryValues.surname ?? hashValues.surname ?? "",
		givenNames: queryValues.givenNames ?? hashValues.givenNames ?? "",
		nationality: queryValues.nationality ?? hashValues.nationality ?? "",
		dateOfBirth: queryValues.dateOfBirth ?? hashValues.dateOfBirth ?? "",
		personalNo: queryValues.personalNo ?? hashValues.personalNo ?? "",
		sex: queryValues.sex ?? hashValues.sex ?? "M",
		dateOfExpiry: queryValues.dateOfExpiry ?? hashValues.dateOfExpiry ?? "",
	};
};
