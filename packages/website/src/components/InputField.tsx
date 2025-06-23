import type { AnyFieldApi } from "@tanstack/react-form";

type Props = {
  label: string;
  field: AnyFieldApi;
  note?: string;
};

export const InputField: React.FC<Props> = ({ label, field, note }) => {
  return (
    <div>
      <label htmlFor={field.name}>{label}</label>
      <input
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {note && <p aria-describedby={field.name}>{note}</p>}
    </div>
  );
};
