import { Download } from "@carbon/icons-react";
import { renderMRZToCanvas } from "@passport-mrz/renderer";
import { useTranslation } from "react-i18next";
import type { PassportInput } from "../types/passport";
import { BaseButton } from "./BaseButton";

type Props = {
	input: PassportInput;
};

export const ExportButton: React.FC<Props> = ({ input }) => {
	const { t } = useTranslation();
	const handleClick: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
		e.preventDefault();

		const canvas = await renderMRZToCanvas({
			documentType: input.type,
			issuingState: input.countryCode,
			documentNumber: input.passportNo,
			primaryIdentifier: input.surname,
			secondaryIdentifier: input.givenNames,
			nationality: input.nationality,
			dateOfBirth: input.dateOfBirth,
			personalNumber: input.personalNo,
			sex: input.sex,
			dateOfExpiry: input.dateOfExpiry,
		});

		// canvasをdata URLに変換
		const dataURL = canvas.toDataURL("image/png");

		// ダウンロード用のリンク要素を作成
		const link = document.createElement("a");
		link.href = dataURL;
		link.download =
			`${input.passportNo}-${input.surname}_${input.givenNames}.png`.replace(
				/ /g,
				"_",
			);

		// リンクをクリックしてダウンロード実行
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<BaseButton icon={Download} style="fill" onClick={handleClick}>
			{t("downloadPNG")}
		</BaseButton>
	);
};
