import { renderMRZToCanvas } from "@simochee/passport-mrz-renderer";
import type { PassportInput } from "../types/passport";

type Props = {
	passport: PassportInput;
};

export const DownloadImage: React.FC<Props> = ({ passport }) => {
	const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
		e.preventDefault();

		const canvas = renderMRZToCanvas({
			documentType: passport.type,
			issuingState: passport.countryCode,
			documentNumber: passport.passportNo,
			primaryIdentifier: passport.surname,
			secondaryIdentifier: passport.givenNames,
			nationality: passport.nationality,
			dateOfBirth: passport.dateOfBirth,
			personalNumber: passport.personalNo,
			sex: passport.sex,
			dateOfExpiry: passport.dateOfExpiry,
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
