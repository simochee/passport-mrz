import { TextField as SpectrumTextField } from "@adobe/react-spectrum";
import type { AnyFieldApi } from "@tanstack/react-form";

type Props = {
	label: string;
	field: AnyFieldApi;
	note?: string;
	placeholder?: string;
};

export const TextField: React.FC<Props> = ({
	label,
	field,
	note,
	placeholder,
}) => {
	return (
		<SpectrumTextField
			label={label}
			description={note}
			placeholder={placeholder}
			name={field.name}
			value={field.state.value}
			onBlur={field.handleBlur}
			onChange={(value) => field.handleChange(value)}
		/>
	);
};
