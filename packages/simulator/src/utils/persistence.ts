import * as v from "valibot";
import type { PassportInput } from "../types/passport";
import { PassportSchema } from "./schema";

const STORAGE_KEY = "form:persistence";

export const persist = (values: PassportInput) => {
	sessionStorage.setItem(STORAGE_KEY, JSON.stringify(values));
};

export const retrieve = (): PassportInput | undefined => {
	const raw = sessionStorage.getItem(STORAGE_KEY);

	if (typeof raw !== "string") {
		return;
	}

	try {
		const values = JSON.parse(raw);

		return v.parse(PassportSchema, values);
	} catch {
		return;
	}
};
