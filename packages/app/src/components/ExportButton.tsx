import { renderMRZToCanvas } from "@simochee/passport-mrz-renderer";
import type { PassportInput } from "../types/passport";

type Props = {
	input: PassportInput;
};

export const ExportButton: React.FC<Props> = ({ input }) => {
	const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
		e.preventDefault();

		const canvas = renderMRZToCanvas({
			documentType: input.type,
			issuingState: input.countryCode,
			documentNumber: input.inputNo,
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
		link.download = "mrz-passport.png";

		// リンクをクリックしてダウンロード実行
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<div>
			<button type="button" onClick={handleClick}>
				download png
			</button>
		</div>
	);
};
