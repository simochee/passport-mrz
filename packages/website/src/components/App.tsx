import { buildMrzLines } from "@simochee/passport-mrz-builder";
import { useState } from "react";
import type { PassportInput } from "../types/passport";
import { ExampleCanvas } from "./Canvas";
import { PassportForm } from "./PassportForm";

export const App: React.FC = () => {
	const defaultValues: PassportInput = {
		type: "P",
		countryCode: "",
		passportNo: "",
		surname: "",
		givenNames: "",
		nationality: "",
		dateOfBirth: "",
		personalNo: "",
		sex: "M",
		dateOfExpiry: "",
	};

	const [values, setValues] = useState(defaultValues);
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
			<ExampleCanvas />
			{mrzLines.map((line) => (
				<p key={line} className="font-ocrb">
					{line}
				</p>
			))}
			<PassportForm defaultValues={defaultValues} onChange={setValues} />
		</div>
	);
};
