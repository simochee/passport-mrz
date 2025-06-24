import { buildMrzLines } from "@simochee/passport-mrz-builder";
import { renderMRZToCanvas } from "@simochee/passport-mrz-renderer";
import { useMemo, useState } from "react";
import { useInitialValues } from "../hooks/useInitialValues";
import { PassportForm } from "./PassportForm";

export const App: React.FC = () => {
	const initialValues = useInitialValues();
	const [values, setValues] = useState(initialValues);

	const mrzLines = buildMrzLines({
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
	});

	const dataUrl = useMemo(() => {
		const canvas = renderMRZToCanvas({
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
		});

		return canvas.toDataURL("image/png");
	}, [values]);

	return (
		<div className="grid gap-8 pt-8">
			<div className="max-w-5xl mx-auto">
				<img src={dataUrl} alt={mrzLines.join("\n")} />
			</div>
			<div className="px-4 mx-auto max-w-5xl">
				<PassportForm defaultValues={initialValues} onChange={setValues} />
			</div>
		</div>
	);
};
