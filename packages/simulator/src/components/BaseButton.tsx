import type { CarbonIconType } from "@carbon/icons-react";
import { clsx } from "clsx";

type Props = {
	icon?: CarbonIconType;
	style: "fill" | "outline";
} & Omit<React.ComponentProps<"button">, "className">;

export const BaseButton: React.FC<Props> = ({
	icon: Icon,
	style,
	children,
	...attrs
}) => {
	return (
		<button
			className={clsx(
				"min-h-9 flex items-center gap-1 px-2 transition rounded-md text-sm border",
				{
					"bg-slate-700 border-slate-700 text-white hover:bg-slate-900 hover:border-slate-900":
						style === "fill",
					"bg-transparent border-slate-300 text-slate-800 hover:bg-slate-100":
						style === "outline",
				},
			)}
			{...attrs}
		>
			{Icon && <Icon className="shrink-0" />}
			{children}
		</button>
	);
};
