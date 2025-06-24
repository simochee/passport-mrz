import type { CarbonIconType } from "@carbon/icons-react";

type Props = {
	icon?: CarbonIconType;
} & Omit<React.ComponentProps<"button">, "className">;

export const BaseButton: React.FC<Props> = ({
	icon: Icon,
	children,
	...attrs
}) => {
	return (
		<button className="h-8 flex items-center gap-1" {...attrs}>
			{Icon && <Icon />}
			{children}
		</button>
	);
};
