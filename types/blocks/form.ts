interface Field {
  label: string;
  name: string;
  required?: boolean;
  defaultValue?: string;
  hint?: string;
}

type Fields = { value: string; label: string };

type SimpleFieldTypes = "input" | "textarea";

type GroupFieldTypes = "radio_group" | "checkbox_group" | "select";

type FieldTypes = SimpleFieldTypes | GroupFieldTypes;

export interface ISimpleField extends Field {
  type: SimpleFieldTypes;
  placeholder?: string;
}

export interface ICheckboxGroupField extends Omit<Field, "defaultValue"> {
  type: Extract<FieldTypes, "checkbox_group">;
  fields: Fields[];
}

export interface IRadioGroupField extends Field {
  type: Extract<FieldTypes, "radio_group">;
  fields: Fields[];
}

export interface ISelectGroupField extends Field {
  type: Extract<FieldTypes, "select">;
  fields: Fields[];
  placeholder?: string;
}

export type FormStructure = ISimpleField | ICheckboxGroupField | IRadioGroupField | ISelectGroupField;
