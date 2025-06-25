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

	// dataUrlの生成を非同期で行うため、useEffectで管理
	const [dataUrl, setDataUrl] = useState<string | undefined>();

	useEffect(() => {
		if (!fontLoaded) {
			setDataUrl(undefined);
			return;
		}

		const generateDataUrl = async () => {
			try {
				const canvas = await renderMRZToCanvas(input);
				const url = canvas.toDataURL("image/png");
				console.log("memo", url.length);
				setDataUrl(url);
			} catch (error) {
				console.error("Failed to generate MRZ image:", error);
				setDataUrl(undefined);
			}
		};

		generateDataUrl();
	}, [input, fontLoaded]);

	useEffect(() => {
		const initializeFont = async () => {
			try {
				await document.fonts.ready;
				await renderMRZToCanvas({
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
				});
				await new Promise((resolve) => setTimeout(resolve, 0));
				setFontLoaded(true);
			} catch (error) {
				console.error("Failed to initialize font:", error);
				// フォント読み込みに失敗してもアプリは動作させる
				setFontLoaded(true);
			}
		};

		initializeFont();
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
