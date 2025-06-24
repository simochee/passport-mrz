import { Button } from "@adobe/react-spectrum";
import type { PassportInput } from "../types/passport";
import { serializeHash } from "../utils/hash";

type Props = {
	input: PassportInput;
};

export const ShareButton: React.FC<Props> = ({ input }) => {
	const handlePress = async () => {
		const hash = serializeHash(input);
		const url = new URL(window.location.href);

		url.pathname = "/";
		url.hash = `#${hash}`;

		await navigator.clipboard.writeText(url.href);
	};

	return (
		<Button variant="secondary" onPress={handlePress}>
			共有リンクをコピー
		</Button>
	);
};
