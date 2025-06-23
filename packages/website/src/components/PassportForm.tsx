import { useForm, useStore } from "@tanstack/react-form";
import { InputField } from "./InputField";
import { useEffect } from "react";
import type { PassportInput } from "../types/passport";

type Props = {
  defaultValues: PassportInput;
  onChange: (value: PassportInput) => void;
};

export const PassportForm: React.FC<Props> = ({ defaultValues, onChange }) => {
  const form = useForm({
    defaultValues,
  });
  const values = useStore(form.store, (state) => state.values);

  useEffect(() => onChange(values), [onChange, values]);

  return (
    <form>
      <form.Field name="type">
        {(field) => <InputField label="Type" field={field} />}
      </form.Field>
      <form.Field name="countryCode">
        {(field) => <InputField label="Country Code" field={field} />}
      </form.Field>
      <form.Field name="passportNo">
        {(field) => <InputField label="Passport No." field={field} />}
      </form.Field>
      <form.Field name="surname">
        {(field) => <InputField label="Surname" field={field} />}
      </form.Field>
      <form.Field name="givenNames">
        {(field) => <InputField label="Given Names" field={field} />}
      </form.Field>
      <form.Field name="nationality">
        {(field) => <InputField label="Nationality" field={field} />}
      </form.Field>
      <form.Field name="dateOfBirth">
        {(field) => <InputField label="Date of birth" field={field} />}
      </form.Field>
      <form.Field name="personalNo">
        {(field) => <InputField label="Personal No." field={field} />}
      </form.Field>
      <form.Field name="sex">
        {(field) => <InputField label="Sex" field={field} />}
      </form.Field>
      <form.Field name="dateOfExpiry">
        {(field) => <InputField label="Date of expiry" field={field} />}
      </form.Field>
    </form>
  );
};
