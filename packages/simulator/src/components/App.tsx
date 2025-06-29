import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useInitialValues } from "../hooks/useInitialValues";
import { AppFooter } from "./AppFooter";
import { MachineReadableZone } from "./MachineReadableZone";
import { PassportForm } from "./PassportForm";

export const App: React.FC = () => {
	const initialValues = useInitialValues();
	const [values, setValues] = useState(initialValues);
	const { i18n } = useTranslation();

	const toggleLanguage = () => {
		const newLang = i18n.language === "ja" ? "en" : "ja";
		i18n.changeLanguage(newLang);
	};

	return (
		<div className="min-h-dvh flex flex-col gap-12">
			<div className="h-3 bg-slate-400" />
			<header className="px-4 md:px-12 max-w-7xl mx-auto w-full">
				<div className="flex justify-end py-4">
					<button
						type="button"
						onClick={toggleLanguage}
						className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
					>
						{i18n.language === "ja" ? "English" : "日本語"}
					</button>
				</div>
			</header>
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
