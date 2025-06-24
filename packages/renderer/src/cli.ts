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
		json: {
			type: "string",
			description: "Load input data from JSON file",
		},
		clipboard: {
			type: "boolean",
			description: "Copy PNG image to clipboard",
		},
		output: {
			type: "string",
			description: "Output file path",
			default: "output.png",
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

		if (args.clipboard) {
			const { spawn } = await import("node:child_process");
			const { promisify } = await import("node:util");
			const _execAsync = promisify(spawn);

			// macOSの場合はpbcopyを使用
			if (process.platform === "darwin") {
				const pbcopy = spawn("pbcopy", [], { stdio: ["pipe", "pipe", "pipe"] });
				pbcopy.stdin.write(pngBuffer);
				pbcopy.stdin.end();

				await new Promise((resolve, reject) => {
					pbcopy.on("close", (code) => {
						if (code === 0) {
							resolve(undefined);
						} else {
							reject(new Error(`pbcopy exited with code ${code}`));
						}
					});
				});
				console.log("PNG image copied to clipboard");
			} else {
				console.log("Clipboard feature is only supported on macOS");
			}
		} else {
			await writeFile(args.output, pngBuffer);
			console.log(`PNG file saved as ${args.output}`);
		}
	},
});

runMain(main);
