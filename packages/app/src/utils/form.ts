import { useMemo } from "react";
import type { PassportInput } from "../types/passport";
import { parseHash } from "./hash";

export const getInitialValues = (): PassportInput => {
	const hashValues = useMemo(() => parseHash(), []);

	return {
		type: hashValues.type ?? "P",
		countryCode: hashValues.countryCode ?? "",
		passportNo: hashValues.passportNo ?? "",
		surname: hashValues.surname ?? "",
		givenNames: hashValues.givenNames ?? "",
		nationality: hashValues.nationality ?? "",
		dateOfBirth: hashValues.dateOfBirth ?? "",
		personalNo: hashValues.personalNo ?? "",
		sex: hashValues.sex ?? "M",
		dateOfExpiry: hashValues.dateOfExpiry ?? "",
	};
};
