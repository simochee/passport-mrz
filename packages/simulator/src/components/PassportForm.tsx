import { Copy, Reset } from "@carbon/icons-react";
import { buildMrzLines } from "@passport-mrz/builder";
import { useForm, useStore } from "@tanstack/react-form";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
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
	const { t, i18n } = useTranslation();
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

	const toggleLanguage = () => {
		const newLang = i18n.language === "ja" ? "en" : "ja";
		i18n.changeLanguage(newLang);
	};

	useEffect(() => {
		persist(values);
		onChange(values);
	}, [onChange, values]);

	return (
		<div className="grid gap-9">
			<div className="flex gap-8 justify-between pb-4 border-b border-slate-200 items-end">
				<h2 className="h-8 place-content-center text-slate-800 shrink-0">
					{t("passportInfo")}
				</h2>
				<div className="flex flex-wrap gap-3 justify-end">
					<button
						type="button"
						onClick={toggleLanguage}
						className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
					>
						{i18n.language === "ja" ? "English" : "日本語"}
					</button>
					<BaseButton icon={Copy} style="fill" onClick={copy}>
						{t("copyMRZ")}
					</BaseButton>
					<ExportButton input={values} />
					<ShareButton input={values} />
					<FakerButton onClick={setValues} />
					<BaseButton icon={Reset} style="outline" onClick={reset}>
						{t("reset")}
					</BaseButton>
				</div>
			</div>
			<form className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-12 gap-y-10">
				<form.Field name="type">
					{(field) => (
						<TextField
							label={t("fields.type.label")}
							note={t("fields.type.note")}
							field={field}
						/>
					)}
				</form.Field>
				<form.Field name="countryCode">
					{(field) => (
						<TextField
							label={t("fields.countryCode.label")}
							note={t("fields.countryCode.note")}
							field={field}
						/>
					)}
				</form.Field>
				<form.Field name="passportNo">
					{(field) => (
						<TextField
							label={t("fields.passportNo.label")}
							note={t("fields.passportNo.note")}
							field={field}
						/>
					)}
				</form.Field>
				<form.Field name="surname">
					{(field) => (
						<TextField
							label={t("fields.surname.label")}
							note={t("fields.surname.note")}
							field={field}
						/>
					)}
				</form.Field>
				<form.Field name="givenNames">
					{(field) => (
						<TextField
							label={t("fields.givenNames.label")}
							note={t("fields.givenNames.note")}
							field={field}
						/>
					)}
				</form.Field>
				<form.Field name="nationality">
					{(field) => (
						<TextField
							label={t("fields.nationality.label")}
							note={t("fields.nationality.note")}
							field={field}
						/>
					)}
				</form.Field>
				<form.Field name="dateOfBirth">
					{(field) => (
						<TextField
							label={t("fields.dateOfBirth.label")}
							note={t("fields.dateOfBirth.note")}
							field={field}
						/>
					)}
				</form.Field>
				<form.Field name="personalNo">
					{(field) => (
						<TextField
							label={t("fields.personalNo.label")}
							note={t("fields.personalNo.note")}
							field={field}
						/>
					)}
				</form.Field>
				<form.Field name="sex">
					{(field) => (
						<TextField
							label={t("fields.sex.label")}
							note={t("fields.sex.note")}
							field={field}
						/>
					)}
				</form.Field>
				<form.Field name="dateOfExpiry">
					{(field) => (
						<TextField
							label={t("fields.dateOfExpiry.label")}
							note={t("fields.dateOfExpiry.note")}
							field={field}
						/>
					)}
				</form.Field>
			</form>
		</div>
	);
};
