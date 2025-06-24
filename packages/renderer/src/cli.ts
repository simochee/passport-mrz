import { readFile, writeFile } from "node:fs/promises";
import type { Input } from "@simochee/passport-mrz-builder";
import { defineCommand, runMain } from "citty";
import pkg from "../package.json" with { type: "json" };
import { renderMRZToPNG } from "./index";

const main = defineCommand({
	meta: {
		name: pkg.name,
		version: pkg.version,
		description: pkg.description,
	},
	args: {
		output: {
			type: "positional",
			description: "Output file path",
			default: "output.png",
		},
		json: {
			type: "string",
			description: "Load input data from JSON file",
		},
		documentType: {
			type: "string",
			description: "Document type",
		},
		issuingState: {
			type: "string",
			description: "Issuing state",
		},
		documentNumber: {
			type: "string",
			description: "Document number (passport number)",
		},
		primaryIdentifier: {
			type: "string",
			description: "Primary identifier (surname/family name)",
		},
		secondaryIdentifier: {
			type: "string",
			description: "Secondary identifier (given names)",
		},
		nationality: {
			type: "string",
			description: "Nationality",
		},
		dateOfBirth: {
			type: "string",
			description: "Date of birth",
		},
		personalNumber: {
			type: "string",
			description: "Personal number",
		},
		sex: {
			type: "string",
			description: "Sex",
		},
		dateOfExpiry: {
			type: "string",
			description: "Date of expiry",
		},
	},
	async run({ args }) {
		const inputData: Input = {
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
		};

		// JSONファイルから入力データを読み込み
		if (args.json) {
			try {
				const jsonData = await readFile(args.json, "utf-8");
				const parsedData = JSON.parse(jsonData);

				if (parsedData.documentType)
					inputData.documentType = parsedData.documentType;
				if (parsedData.issuingState)
					inputData.issuingState = parsedData.issuingState;
				if (parsedData.documentNumber)
					inputData.documentNumber = parsedData.documentNumber;
				if (parsedData.primaryIdentifier)
					inputData.primaryIdentifier = parsedData.primaryIdentifier;
				if (parsedData.secondaryIdentifier)
					inputData.secondaryIdentifier = parsedData.secondaryIdentifier;
				if (parsedData.nationality)
					inputData.nationality = parsedData.nationality;
				if (parsedData.dateOfBirth)
					inputData.dateOfBirth = parsedData.dateOfBirth;
				if (parsedData.personalNumber)
					inputData.personalNumber = parsedData.personalNumber;
				if (parsedData.sex) inputData.sex = parsedData.sex;
				if (parsedData.dateOfExpiry)
					inputData.dateOfExpiry = parsedData.dateOfExpiry;
			} catch (error) {
				console.error(`Failed to read JSON file: ${error}`);
				process.exit(1);
			}
		}

		// コマンドライン引数で上書き
		if (args.documentType) inputData.documentType = args.documentType;
		if (args.issuingState) inputData.issuingState = args.issuingState;
		if (args.documentNumber) inputData.documentNumber = args.documentNumber;
		if (args.primaryIdentifier)
			inputData.primaryIdentifier = args.primaryIdentifier;
		if (args.secondaryIdentifier)
			inputData.secondaryIdentifier = args.secondaryIdentifier;
		if (args.nationality) inputData.nationality = args.nationality;
		if (args.dateOfBirth) inputData.dateOfBirth = args.dateOfBirth;
		if (args.personalNumber) inputData.personalNumber = args.personalNumber;
		if (args.sex) inputData.sex = args.sex;
		if (args.dateOfExpiry) inputData.dateOfExpiry = args.dateOfExpiry;

		const pngBuffer = await renderMRZToPNG(inputData);

		await writeFile(args.output, pngBuffer);
		console.log(`PNG file saved as ${args.output}`);
	},
});

runMain(main);
