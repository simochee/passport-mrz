import { useMemo } from "react";
import type { PassportInput } from "../types/passport";
import { parseHash } from "../utils/hash";
import { retrieve } from "../utils/persistence";
import { parseQuery } from "../utils/query";

export const DEFAULT_VALUES: PassportInput = {
	type: "PP",
	countryCode: "",
	passportNo: "",
	surname: "",
	givenNames: "",
	nationality: "",
	dateOfBirth: "",
	personalNo: "",
	sex: "",
	dateOfExpiry: "",
};

export const useInitialValues = (): PassportInput => {
	const queryValues = useMemo(() => parseQuery(), []);
	const hashValues = useMemo(() => parseHash(), []);
	const persistedValues = useMemo(() => retrieve(), []);

	return {
		type:
			persistedValues?.type ??
			queryValues.type ??
			hashValues.type ??
			DEFAULT_VALUES.type,
		countryCode:
			persistedValues?.countryCode ??
			queryValues.countryCode ??
			hashValues.countryCode ??
			DEFAULT_VALUES.countryCode,
		passportNo:
			persistedValues?.passportNo ??
			queryValues.passportNo ??
			hashValues.passportNo ??
			DEFAULT_VALUES.passportNo,
		surname:
			persistedValues?.surname ??
			queryValues.surname ??
			hashValues.surname ??
			DEFAULT_VALUES.surname,
		givenNames:
			persistedValues?.givenNames ??
			queryValues.givenNames ??
			hashValues.givenNames ??
			DEFAULT_VALUES.givenNames,
		nationality:
			persistedValues?.nationality ??
			queryValues.nationality ??
			hashValues.nationality ??
			DEFAULT_VALUES.nationality,
		dateOfBirth:
			persistedValues?.dateOfBirth ??
			queryValues.dateOfBirth ??
			hashValues.dateOfBirth ??
			DEFAULT_VALUES.dateOfBirth,
		personalNo:
			persistedValues?.personalNo ??
			queryValues.personalNo ??
			hashValues.personalNo ??
			DEFAULT_VALUES.personalNo,
		sex:
			persistedValues?.sex ??
			queryValues.sex ??
			hashValues.sex ??
			DEFAULT_VALUES.sex,
		dateOfExpiry:
			persistedValues?.dateOfExpiry ??
			queryValues.dateOfExpiry ??
			hashValues.dateOfExpiry ??
			DEFAULT_VALUES.dateOfExpiry,
	};
};
