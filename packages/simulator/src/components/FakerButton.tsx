import { Shuffle } from "@carbon/icons-react";
import { faker } from "@faker-js/faker/locale/en";
import { useTranslation } from "react-i18next";
import type { PassportInput } from "../types/passport";
import { BaseButton } from "./BaseButton";

type Props = {
	onClick: (input: PassportInput) => void;
};

export const FakerButton: React.FC<Props> = ({ onClick }) => {
	const { t } = useTranslation();
	const stringifyDate = (input: Date): string => {
		const year = input.getFullYear();
		const month = input.getMonth() + 1;
		const date = input.getDate();

		return `${year % 100}${`${month}`.padStart(2, "0")}${`${date}`.padStart(2, "0")}`;
	};

	const generateFakePassport = (): PassportInput => {
		const countryCode = faker.location.countryCode({ variant: "alpha-3" });
		const sex = faker.helpers.arrayElement(["M", "F"]);
		const firstName = faker.person.firstName(sex === "M" ? "male" : "female");
		const lastName = faker.person.lastName();
		const middleName = faker.datatype.boolean(0.3)
			? faker.person.middleName()
			: "";
		const givenNames = `${firstName} ${middleName}`.trim();

		const values: PassportInput = {
			type: "P",
			countryCode,
			passportNo: `${faker.string.alpha(2).toUpperCase()}${faker.string.numeric(7)}`,
			surname: lastName.toUpperCase(),
			givenNames: givenNames.toUpperCase(),
			nationality: countryCode,
			dateOfBirth: stringifyDate(
				faker.date.birthdate({ mode: "age", min: 1, max: 90 }),
			),
			personalNo: "",
			sex,
			dateOfExpiry: stringifyDate(faker.date.future({ years: 10 })),
		};

		const isValid = Object.values(values).every((value) =>
			/^[a-zA-Z0-9 ]*$/.test(value),
		);

		return isValid ? values : generateFakePassport();
	};

	const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
		e.preventDefault();

		onClick(generateFakePassport());
	};

	return (
		<BaseButton icon={Shuffle} style="outline" onClick={handleClick}>
			{t("random")}
		</BaseButton>
	);
};
