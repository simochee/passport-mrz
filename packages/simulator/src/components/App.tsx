import { useState } from "react";
import { useInitialValues } from "../hooks/useInitialValues";
import { MachineReadableZone } from "./MachineReadableZone";
import { PassportForm } from "./PassportForm";

export const App: React.FC = () => {
	const initialValues = useInitialValues();
	const [values, setValues] = useState(initialValues);

	return (
		<div className="grid gap-8 pt-8">
			<div className="max-w-5xl mx-auto">
				<MachineReadableZone values={values} />
			</div>
			<div className="px-4 mx-auto max-w-5xl">
				<PassportForm defaultValues={initialValues} onChange={setValues} />
			</div>
		</div>
	);
};
