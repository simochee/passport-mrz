import { useState } from "react";
import { useInitialValues } from "../hooks/useInitialValues";
import { AppFooter } from "./AppFooter";
import { MachineReadableZone } from "./MachineReadableZone";
import { PassportForm } from "./PassportForm";

export const App: React.FC = () => {
	const initialValues = useInitialValues();
	const [values, setValues] = useState(initialValues);

	return (
		<div className="min-h-dvh flex flex-col gap-12">
			<div className="h-3 bg-slate-400" />
			<div className="my-auto">
				<div className="max-w-5xl mx-auto px-5">
					<MachineReadableZone values={values} />
				</div>
				<div className="px-4 mx-auto max-w-5xl">
					<PassportForm defaultValues={initialValues} onChange={setValues} />
				</div>
			</div>
			<div>
				<AppFooter />
			</div>
		</div>
	);
};
