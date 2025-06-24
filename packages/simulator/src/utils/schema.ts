import * as v from "valibot";

export const PassportSchema = v.object({
	type: v.string(),
	countryCode: v.string(),
	passportNo: v.string(),
	surname: v.string(),
	givenNames: v.string(),
	nationality: v.string(),
	dateOfBirth: v.string(),
	personalNo: v.string(),
	sex: v.string(),
	dateOfExpiry: v.string(),
});
