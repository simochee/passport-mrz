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
		<button
			className="h-8 flex items-center gap-1 border rounded-full px-3 border-slate-200 bg-slate-50 text-sm text-slate-800 transition hover:border-slate-700 hover:text-slate-50 hover:bg-slate-600"
			{...attrs}
		>
			{Icon && <Icon />}
			{children}
		</button>
	);
};
