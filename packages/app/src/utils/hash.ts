import type { PassportInput } from "../types/passport";

/**
 * URL fragment形式の定義
 * 形式: t=P&c=JPN&p=ABC123456&s=YAMADA&g=TARO+JIRO&n=JPN&b=900101&i=123456789&x=M&e=300101
 *
 * パラメータ:
 * t: type (P=パスポート)
 * c: countryCode (発行国)
 * p: passportNo (パスポート番号)
 * s: surname (姓)
 * g: givenNames (名)
 * n: nationality (国籍)
 * b: dateOfBirth (生年月日 YYMMDD)
 * i: personalNo (個人番号)
 * x: sex (M/F)
 * e: dateOfExpiry (有効期限 YYMMDD)
 */

export const parseHash = (): Partial<PassportInput> => {
	const hash = window.location.hash.slice(1);
	const values = Object.fromEntries(
		hash.split("&").map((param) => param.split("=").map(decodeURIComponent)),
	);

	return {
		type: values.t,
		countryCode: values.c,
		passportNo: values.p,
		surname: values.s,
		givenNames: values.g,
		nationality: values.n,
		dateOfBirth: values.b,
		personalNo: values.i,
		sex: values.x,
		dateOfExpiry: values.e,
	};
};

export const serializeHash = (input: PassportInput): string => {
	const entries: [string, string][] = [
		["t", input.type],
		["c", input.countryCode],
		["p", input.passportNo],
		["s", input.surname],
		["g", input.givenNames],
		["n", input.nationality],
		["b", input.dateOfBirth],
		["i", input.personalNo],
		["x", input.sex],
		["e", input.dateOfBirth],
	];

	return entries
		.filter(([, value]) => typeof value === "string" && value !== "")
		.map((param) => param.map(encodeURIComponent).join("="))
		.join("&");
};
