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
		console.log("load", fontLoaded);
		if (!fontLoaded) {
			return;
		}

		const canvas = renderMRZToCanvas(input);

		console.log("memo", canvas.toDataURL("image/png").length);

		return canvas.toDataURL("image/png");
	}, [input, fontLoaded]);

	useEffect(() => {
		document.fonts.ready
			.then(() =>
				renderMRZToCanvas({
					documentType: "",
					issuingState: "",
					documentNumber: "",
					primaryIdentifier: "",
					secondaryIdentifier: "",
					nationality: "",
					dateOfBirth: "",
					personalNumber: "",
					sex: "",
					dateOfExpiry: "",
				}),
			)
			.then(() => new Promise((resolve) => setTimeout(resolve, 0)))
			.then(() => setFontLoaded(true));
	}, []);

	return (
		<div className="h-32 place-items-center">
			{dataUrl ? (
				<img className="object-center" src={dataUrl} alt={mrzString} />
			) : (
				<p>loading...</p>
			)}
		</div>
	);
};
