import { buildMrzLines } from "@simochee/passport-mrz-builder";
import { useState } from "react";
import { getInitialValues } from "../utils/form";
import { ExportButton } from "./ExportButton";
import { PassportForm } from "./PassportForm";
import { ShareButton } from "./ShareButton";

export const App: React.FC = () => {
	const initialValues = getInitialValues();

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

	return (
		<div>
			{mrzLines.map((line) => (
				<p key={line} className="font-ocrb">
					{line}
				</p>
			))}
			<ExportButton input={values} />
			<ShareButton input={values} />
			<PassportForm defaultValues={initialValues} onChange={setValues} />
		</div>
	);
};
