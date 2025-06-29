import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import enTranslations from "./locales/en.json";
import jaTranslations from "./locales/ja.json";

const resources = {
	ja: {
		translation: jaTranslations,
	},
	en: {
		translation: enTranslations,
	},
};

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources,
		fallbackLng: "en",
		lng: "ja", // デフォルト言語は日本語

		detection: {
			order: ["localStorage", "navigator", "htmlTag"],
			caches: ["localStorage"],
			lookupLocalStorage: "i18nextLng",
		},

		interpolation: {
			escapeValue: false, // Reactは既にXSS対策済み
		},

		debug: false,
	});

export default i18n;
