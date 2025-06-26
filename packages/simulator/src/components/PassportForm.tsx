import { Copy, Reset } from "@carbon/icons-react";
import { buildMrzLines } from "@simochee/passport-mrz-builder";
import { useForm, useStore } from "@tanstack/react-form";
import { useEffect } from "react";
import { DEFAULT_VALUES } from "../hooks/useInitialValues";
import type { PassportInput } from "../types/passport";
import { persist } from "../utils/persistence";
import { BaseButton } from "./BaseButton";
import { ExportButton } from "./ExportButton";
import { FakerButton } from "./FakerButton";
import { ShareButton } from "./ShareButton";
import { TextField } from "./TextField";

type Props = {
	defaultValues: PassportInput;
	onChange: (value: PassportInput) => void;
};

export const PassportForm: React.FC<Props> = ({ defaultValues, onChange }) => {
	const form = useForm({
		defaultValues,
	});
	const values = useStore(form.store, (state) => state.values);

	const setValues = (values: PassportInput) => {
		form.setFieldValue("type", values.type);
		form.setFieldValue("countryCode", values.countryCode);
		form.setFieldValue("passportNo", values.passportNo);
		form.setFieldValue("surname", values.surname);
		form.setFieldValue("givenNames", values.givenNames);
		form.setFieldValue("nationality", values.nationality);
		form.setFieldValue("dateOfBirth", values.dateOfBirth);
		form.setFieldValue("personalNo", values.personalNo);
		form.setFieldValue("sex", values.sex);
		form.setFieldValue("dateOfExpiry", values.dateOfExpiry);
	};

	const reset = () => {
		setValues(DEFAULT_VALUES);
	};

	const copy = () => {
		navigator.clipboard.writeText(
			buildMrzLines({
				documentType: values.type,
				issuingState: values.countryCode,
				documentNumber: values.passportNo,
				primaryIdentifier: values.surname,
				secondaryIdentifier: values.givenNames,
				nationality: values.nationality,
				dateOfBirth: values.dateOfBirth,
				personalNumber: values.personalNo,
				sex: values.sex,
				dateOfExpiry: values.dateOfExpiry,
			}).join("\n"),
		);
	};

	useEffect(() => {
		persist(values);
		onChange(values);
	}, [onChange, values]);

	return (
		<div className="grid gap-9">
			<div className="flex gap-8 justify-between pb-4 border-b border-slate-200 items-end">
				<h2 className="h-8 place-content-center text-slate-800 shrink-0">
					パスポート情報
				</h2>
				<div className="flex flex-wrap gap-3 justify-end">
					<BaseButton icon={Copy} style="fill" onClick={copy}>
						MRZをコピー
					</BaseButton>
					<ExportButton input={values} />
					<ShareButton input={values} />
					<FakerButton onClick={setValues} />
					<BaseButton icon={Reset} style="outline" onClick={reset}>
						リセット
					</BaseButton>
				</div>
			</div>
			<form className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-12 gap-y-10">
				<form.Field name="type">
					{(field) => (
						<TextField
							label="型 / Type"
							note="一般旅券は P もしくは PP"
							field={field}
						/>
					)}
				</form.Field>
				<form.Field name="countryCode">
					{(field) => (
						<TextField
							label="発行国 / Country Code"
							note="ISO 3166-1 の alpha-3 コード"
							field={field}
						/>
					)}
				</form.Field>
				<form.Field name="passportNo">
					{(field) => (
						<TextField
							label="旅券番号 / Passport No."
							note="AA0000000 形式の7桁"
							field={field}
						/>
					)}
				</form.Field>
				<form.Field name="surname">
					{(field) => (
						<TextField
							label="姓 / Surname"
							note="スペースを含まない"
							field={field}
						/>
					)}
				</form.Field>
				<form.Field name="givenNames">
					{(field) => (
						<TextField
							label="名 / Given Names"
							note="ミドルネームはスペースで区切る"
							field={field}
						/>
					)}
				</form.Field>
				<form.Field name="nationality">
					{(field) => (
						<TextField
							label="国籍 / Nationality"
							note="ISO 3166-1 の alpha-3 コード"
							field={field}
						/>
					)}
				</form.Field>
				<form.Field name="dateOfBirth">
					{(field) => (
						<TextField
							label="生年月日 / Date of birth"
							note="YYMMDD 形式"
							field={field}
						/>
					)}
				</form.Field>
				<form.Field name="personalNo">
					{(field) => (
						<TextField
							label="個人番号 / Personal No."
							note="国によっては設定されません"
							field={field}
						/>
					)}
				</form.Field>
				<form.Field name="sex">
					{(field) => (
						<TextField
							label="性別 / Sex"
							note="M または F または X"
							field={field}
						/>
					)}
				</form.Field>
				<form.Field name="dateOfExpiry">
					{(field) => (
						<TextField
							label="有効期限満了日 / Date of expiry"
							note="YYMMDD 形式"
							field={field}
						/>
					)}
				</form.Field>
			</form>
		</div>
	);
};
