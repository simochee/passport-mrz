import type { AnyFieldApi } from "@tanstack/react-form";

type Props = {
	label: string;
	field: AnyFieldApi;
	note?: string;
};

export const TextField: React.FC<Props> = ({ label, field, note }) => {
	return (
		<div className="flex flex-col gap-2">
			<label htmlFor={field.name} className="text-slate-800 font-bold text-sm">
				{label}
			</label>
			<input
				id={field.name}
				className="border-2 border-slate-200 rounded px-3 py-1 focus:border-blue-600 outline-0 leading-loose"
				name={field.name}
				value={field.state.value}
				onBlur={field.handleBlur}
				onChange={(e) => field.handleChange(e.target.value)}
			/>
			{note && (
				<p className="text-xs text-slate-500" aria-describedby={field.name}>
					{note}
				</p>
			)}
		</div>
	);
};
