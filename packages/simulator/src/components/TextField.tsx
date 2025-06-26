import type { AnyFieldApi } from "@tanstack/react-form";

type Props = {
	label: string;
	field: AnyFieldApi;
	note?: string;
};

export const TextField: React.FC<Props> = ({ label, field, note }) => {
	return (
		<div className="flex flex-col gap-2">
			<label htmlFor={field.name} className="text-slate-800 font-bold text-xs">
				{label}
			</label>
			<input
				id={field.name}
				className="border border-slate-300 w-full rounded px-4 py-2 focus:border-blue-600 outline-0 leading-loose"
				name={field.name}
				value={field.state.value}
				onBlur={field.handleBlur}
				onChange={(e) => field.handleChange(e.target.value)}
			/>
			{note && (
				<p className="text-xs text-slate-600" aria-describedby={field.name}>
					{note}
				</p>
			)}
		</div>
	);
};
