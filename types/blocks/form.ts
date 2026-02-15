interface Field {
  label: string;
  name: string;
  required?: boolean;
}

type SimpleFieldTypes = "input" | "textarea";

type GroupFieldTypes = "radio_group" | "checkbox_group";

type FieldTypes = SimpleFieldTypes | GroupFieldTypes;

export interface ISimpleField extends Field {
  type: SimpleFieldTypes;
  defaultValue?: string;
  placeholder?: string;
}

export interface ICheckboxGroupField extends Field {
  type: Extract<FieldTypes, "checkbox_group">;
  fields: { value: string; label: string }[];
}

export interface IRadioGroupField extends Field {
  type: Extract<FieldTypes, "radio_group">;
  defaultValue?: string;
  fields: { value: string; label: string }[];
}

export type FormStructure = ISimpleField | ICheckboxGroupField | IRadioGroupField;
