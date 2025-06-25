import { LogoGithub } from "@carbon/icons-react";
import { useState } from "react";
import { useInitialValues } from "../hooks/useInitialValues";
import { MachineReadableZone } from "./MachineReadableZone";
import { PassportForm } from "./PassportForm";

export const App: React.FC = () => {
	const initialValues = useInitialValues();
	const [values, setValues] = useState(initialValues);

	return (
		<div className="grid gap-12">
			<header className="h-12 bg-slate-800 flex items-center px-4 justify-between">
				<h1 className="text-slate-50 text-sm">Passport MRZ Simulator</h1>
				<nav className="flex items-center">
					<a
						className="text-slate-50 hover:text-slate-400 transition"
						href="https://github.com/simochee/passport-mrz"
						target="_blank"
						rel="noopener"
					>
						<LogoGithub />
					</a>
				</nav>
			</header>
			<div className="max-w-5xl mx-auto px-5">
				<MachineReadableZone values={values} />
			</div>
			<div className="px-4 mx-auto max-w-5xl">
				<PassportForm defaultValues={initialValues} onChange={setValues} />
			</div>
		</div>
	);
};
