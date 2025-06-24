import { useForm, useStore } from "@tanstack/react-form";
import { useEffect } from "react";
import type { PassportInput } from "../types/passport";
import { FakerButton } from "./FakerButton";
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

	useEffect(() => onChange(values), [onChange, values]);

	return (
		<>
			<FakerButton
				onClick={(values) => {
					Object.entries(values).forEach(([key, value]) => {
						form.setFieldValue(key, value);
					});
				}}
			/>
			<form className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8">
				<form.Field name="type">
					{(field) => (
						<TextField
							label="型 / Type"
							note="パスポートは P で固定"
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
						<TextField label="旅券番号 / Passport No." field={field} />
					)}
				</form.Field>
				<form.Field name="surname">
					{(field) => <TextField label="姓 / Surname" field={field} />}
				</form.Field>
				<form.Field name="givenNames">
					{(field) => <TextField label="名 / Given Names" field={field} />}
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
		</>
	);
};
