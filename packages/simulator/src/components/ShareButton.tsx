import type { PassportInput } from "../types/passport";
import { serializeHash } from "../utils/hash";

type Props = {
	input: PassportInput;
};

export const ShareButton: React.FC<Props> = ({ input }) => {
	const handleClick: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
		e.preventDefault();

		const hash = serializeHash(input);
		const url = new URL(window.location.href);

		url.pathname = "/";
		url.hash = `#${hash}`;

		await navigator.clipboard.writeText(url.href);
	};

	return (
		<div>
			<button type="button" onClick={handleClick}>
				共有リンクをコピー
			</button>
		</div>
	);
};
