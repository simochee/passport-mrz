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
			<div className="m-auto px-4 md:px-12 max-w-7xl grid gap-12">
				<div className="max-w-5xl mx-auto">
					<MachineReadableZone values={values} />
				</div>
				<div className="">
					<PassportForm defaultValues={initialValues} onChange={setValues} />
				</div>
			</div>
			<div>
				<AppFooter />
			</div>
		</div>
	);
};
