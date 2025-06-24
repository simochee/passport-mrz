import { buildMrzLines } from "@simochee/passport-mrz-builder";
import { renderMRZToCanvas } from "@simochee/passport-mrz-renderer";
import { useEffect, useMemo, useState } from "react";
import type { PassportInput } from "../types/passport";

type Props = {
	values: PassportInput;
};

export const MachineReadableZone: React.FC<Props> = ({ values }) => {
	const [fontLoaded, setFontLoaded] = useState(false);

	const input = useMemo(
		() => ({
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
		}),
		[values],
	);

	const mrzString = buildMrzLines(input).join("\n");

	const dataUrl = useMemo<string | undefined>(() => {
		if (!fontLoaded) {
			return;
		}

		const canvas = renderMRZToCanvas(input);

		return canvas.toDataURL("image/png");
	}, [input, fontLoaded]);

	useEffect(() => {
		document.fonts.ready.then(() => setFontLoaded(true));
	}, []);

	return (
		<div className="h-32 place-items-center">
			{fontLoaded ? (
				<img className="object-center" src={dataUrl} alt={mrzString} />
			) : (
				<p>loading...</p>
			)}
		</div>
	);
};
