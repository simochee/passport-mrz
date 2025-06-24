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
			description:
				"Output file path (supports placeholders like {documentNumber}, {primaryIdentifier}, etc.)",
			default: "{documentNumber}-{primaryIdentifier}_{secondaryIdentifier}.png",
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

		// プレイスホルダーを実際の値で置換（スペースはアンダースコアに変換）
		let outputPath = args.output;
		outputPath = outputPath.replace(
			/\{documentType\}/g,
			inputData.documentType.replace(/\s/g, "_"),
		);
		outputPath = outputPath.replace(
			/\{issuingState\}/g,
			inputData.issuingState.replace(/\s/g, "_"),
		);
		outputPath = outputPath.replace(
			/\{documentNumber\}/g,
			inputData.documentNumber.replace(/\s/g, "_"),
		);
		outputPath = outputPath.replace(
			/\{primaryIdentifier\}/g,
			inputData.primaryIdentifier.replace(/\s/g, "_"),
		);
		outputPath = outputPath.replace(
			/\{secondaryIdentifier\}/g,
			inputData.secondaryIdentifier.replace(/\s/g, "_"),
		);
		outputPath = outputPath.replace(
			/\{nationality\}/g,
			inputData.nationality.replace(/\s/g, "_"),
		);
		outputPath = outputPath.replace(
			/\{dateOfBirth\}/g,
			inputData.dateOfBirth.replace(/\s/g, "_"),
		);
		outputPath = outputPath.replace(
			/\{personalNumber\}/g,
			(inputData.personalNumber || "").replace(/\s/g, "_"),
		);
		outputPath = outputPath.replace(
			/\{sex\}/g,
			inputData.sex.replace(/\s/g, "_"),
		);
		outputPath = outputPath.replace(
			/\{dateOfExpiry\}/g,
			inputData.dateOfExpiry.replace(/\s/g, "_"),
		);

		await writeFile(outputPath, pngBuffer);
		console.log(`PNG file saved as ${outputPath}`);
	},
});

runMain(main);
