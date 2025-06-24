import { writeFile } from "node:fs/promises";
import { defineCommand, runMain } from "citty";
import pkg from "../package.json" with { type: "json" };
import { renderMRZToPNG } from "./index";

const main = defineCommand({
	meta: {
		name: pkg.name,
		version: pkg.version,
		description: pkg.description,
	},
	async run() {
		const pngBuffer = await renderMRZToPNG(
			{
				documentType: "P",
				issuingState: "JPN",
				documentNumber: "12345678",
				primaryIdentifier: "",
				secondaryIdentifier: "",
				nationality: "",
				dateOfBirth: "",
				personalNumber: "",
				sex: "",
				dateOfExpiry: "",
			},
			{ width: 1000 },
		);

		await writeFile("output.local.png", pngBuffer);
		console.log("PNG file saved as output.local.png");
	},
});

runMain(main);
