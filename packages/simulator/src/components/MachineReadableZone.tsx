import ocrbcss from "ocrb-webfont?url";
import { buildMrzLines } from "@passport-mrz/builder";
import { renderMRZToCanvas } from "@passport-mrz/renderer";
import { useEffect, useMemo, useState } from "react";
import WebFont from "webfontloader";
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

	// dataUrlの生成を非同期で行うため、useEffectで管理
	const [dataUrl, setDataUrl] = useState<string | undefined>();

	useEffect(() => {
		if (!fontLoaded) {
			setDataUrl(undefined);
			return;
		}

		renderMRZToCanvas(input).then((canvas) => {
			const url = canvas.toDataURL("image/png");
			setDataUrl(url);
		});
	}, [input, fontLoaded]);

	useEffect(() => {
		WebFont.load({
			custom: {
				families: ["OCRB"],
				urls: [ocrbcss],
			},
			active() {
				setFontLoaded(true);
			},
		});
	}, []);

	return (
		<div className="place-items-center">
			{dataUrl ? (
				<img className="object-center" src={dataUrl} alt={mrzString} />
			) : (
				<p>loading...</p>
			)}
		</div>
	);
};
