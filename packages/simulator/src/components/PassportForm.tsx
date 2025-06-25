import { Copy, Reset } from "@carbon/icons-react";
import { buildMrzLines } from "@simochee/passport-mrz-builder";
import { useForm, useStore } from "@tanstack/react-form";
import { useEffect } from "react";
import { DEFAULT_VALUES } from "../hooks/useInitialValues";
import type { PassportInput } from "../types/passport";
import { persist } from "../utils/persistence";
import { BaseButton } from "./BaseButton";
import { ExportButton } from "./ExportButton";
import { FakerButton } from "./FakerButton";
import { ShareButton } from "./ShareButton";
import { TextField } from "./TextField";

type Props = {
  defaultValues: PassportInput;
  onChange: (value: PassportInput) => void;
};

export const PassportForm: React.FC<Props> = ({ defaultValues, onChange }) => {
  const form = useForm({
    defaultValues,
  });
  const values = useStore(form.store, (state) => state.values);

  const setValues = (values: PassportInput) => {
    form.setFieldValue("type", values.type);
    form.setFieldValue("countryCode", values.countryCode);
    form.setFieldValue("passportNo", values.passportNo);
    form.setFieldValue("surname", values.surname);
    form.setFieldValue("givenNames", values.givenNames);
    form.setFieldValue("nationality", values.nationality);
    form.setFieldValue("dateOfBirth", values.dateOfBirth);
    form.setFieldValue("personalNo", values.personalNo);
    form.setFieldValue("sex", values.sex);
    form.setFieldValue("dateOfExpiry", values.dateOfExpiry);
  };

  const reset = () => {
    setValues(DEFAULT_VALUES);
  };

  const copy = () => {
    navigator.clipboard.writeText(
      buildMrzLines({
        documentType: values.type,
        issuingState: values.countryCode,
        documentNumber: values.passportNo,
        primaryIdentifier: values.surname,
        secondaryIdentifier: values.givenNames,
        nationality: values.nationality,
        dateOfBirth: values.dateOfBirth,
        personalNumber: values.personalNo,
        sex: values.sex,
        dateOfExpiry: values.dateOfExpiry,
      }).join("\n"),
    );
  };

  useEffect(() => {
    persist(values);
    onChange(values);
  }, [onChange, values]);

  return (
    <div className="grid gap-6">
      <div className="flex gap-2 justify-center flex-wrap">
        <BaseButton icon={Copy} onClick={copy}>
          MRZをコピー
        </BaseButton>
        <ExportButton input={values} />
        <ShareButton input={values} />
        <FakerButton onClick={setValues} />
        <BaseButton icon={Reset} onClick={reset}>
          リセット
        </BaseButton>
      </div>
      <form className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8">
        <form.Field name="type">
          {(field) => (
            <TextField
              label="型 / Type"
              note="一般旅券は P もしくは PP"
              field={field}
            />
          )}
        </form.Field>
        <form.Field name="countryCode">
          {(field) => (
            <TextField
              label="発行国 / Country Code"
              note="ISO 3166-1 の alpha-3 コード"
              field={field}
            />
          )}
        </form.Field>
        <form.Field name="passportNo">
          {(field) => (
            <TextField label="旅券番号 / Passport No." field={field} />
          )}
        </form.Field>
        <form.Field name="surname">
          {(field) => <TextField label="姓 / Surname" field={field} />}
        </form.Field>
        <form.Field name="givenNames">
          {(field) => <TextField label="名 / Given Names" field={field} />}
        </form.Field>
        <form.Field name="nationality">
          {(field) => (
            <TextField
              label="国籍 / Nationality"
              note="ISO 3166-1 の alpha-3 コード"
              field={field}
            />
          )}
        </form.Field>
        <form.Field name="dateOfBirth">
          {(field) => (
            <TextField
              label="生年月日 / Date of birth"
              note="YYMMDD 形式"
              field={field}
            />
          )}
        </form.Field>
        <form.Field name="personalNo">
          {(field) => (
            <TextField
              label="個人番号 / Personal No."
              note="国によっては設定されません"
              field={field}
            />
          )}
        </form.Field>
        <form.Field name="sex">
          {(field) => (
            <TextField
              label="性別 / Sex"
              note="M または F または X"
              field={field}
            />
          )}
        </form.Field>
        <form.Field name="dateOfExpiry">
          {(field) => (
            <TextField
              label="有効期限満了日 / Date of expiry"
              note="YYMMDD 形式"
              field={field}
            />
          )}
        </form.Field>
      </form>
    </div>
  );
};
