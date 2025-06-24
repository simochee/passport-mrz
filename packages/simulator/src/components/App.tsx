import {
	defaultTheme,
	Flex,
	Provider,
	Text,
	View,
} from "@adobe/react-spectrum";
import { buildMrzLines } from "@simochee/passport-mrz-builder";
import { useState } from "react";
import { useInitialValues } from "../hooks/useInitialValues";
import { ExportButton } from "./ExportButton";
import { PassportForm } from "./PassportForm";
import { ShareButton } from "./ShareButton";

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

	return (
		<Provider theme={defaultTheme}>
			<View padding="size-400">
				<Flex direction="column" gap="size-400">
					<View>
						{mrzLines.map((line) => (
							<Text key={line} UNSAFE_style={{ fontFamily: "ocrb" }}>
								{line}
							</Text>
						))}
					</View>
					<Flex direction="row" gap="size-200">
						<ExportButton input={values} />
						<ShareButton input={values} />
					</Flex>
					<PassportForm defaultValues={initialValues} onChange={setValues} />
				</Flex>
			</View>
		</Provider>
	);
};
