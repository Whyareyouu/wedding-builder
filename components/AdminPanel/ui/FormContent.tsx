import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormStructure, ICheckboxGroupField, IRadioGroupField, ISimpleField } from "@/types/blocks/form";

export interface IFormBlock {
  fields: FormStructure[];
}

const FIELD_TYPES: { label: string; value: FormStructure["type"] }[] = [
  { label: "Текстовое поле", value: "input" },
  { label: "Многострочное поле", value: "textarea" },
  { label: "Группа радиокнопок", value: "radio_group" },
  { label: "Группа чекбоксов", value: "checkbox_group" },
];

const DEFAULT_OPTION = { value: "", label: "" };

const DEFAULT_SIMPLE_FIELD: ISimpleField = {
  type: "input",
  label: "",
  name: "",
  required: false,
  placeholder: "",
  defaultValue: "",
};

const isGroupField = (field: FormStructure): field is ICheckboxGroupField | IRadioGroupField =>
  field.type === "radio_group" || field.type === "checkbox_group";

const FieldOptions = ({ fieldIndex, control, register }: { fieldIndex: number; control: any; register: any }) => {
  const {
    fields: options,
    append,
    remove,
  } = useFieldArray<IFormBlock>({
    control,
    name: `fields.${fieldIndex}.fields`,
  });

  return (
    <div className="mt-2 space-y-2">
      <Label className="text-sm">Варианты ответов:</Label>
      {options.map((option, optIndex) => (
        <div key={option.id} className="flex gap-2">
          <Input {...register(`fields.${fieldIndex}.fields.${optIndex}.value`)} placeholder="Значение" />
          <Input {...register(`fields.${fieldIndex}.fields.${optIndex}.label`)} placeholder="Метка" />
          <Button type="button" variant="ghost" size="icon" onClick={() => remove(optIndex)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => append(DEFAULT_OPTION)}>
        Добавить вариант
      </Button>
    </div>
  );
};

export const FormContent = () => {
  const { register, control, setValue, reset } = useFormContext<IFormBlock>();

  const {
    fields: formFields,
    append,
    remove,
  } = useFieldArray<IFormBlock>({
    control,
    name: "fields",
  });

  const watchedFields = useWatch<IFormBlock>({ control, name: "fields" }) ?? [];

  return (
    <Field>
      <FieldLabel>Поля формы ({formFields.length})</FieldLabel>
      <FieldContent>
        <div className="space-y-4">
          {formFields.map((field, index) => {
            const currentType = watchedFields[index]?.type;

            return (
              <Card key={field.id} className="p-4">
                <CardTitle className="self-end">
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </CardTitle>

                <div className="space-y-3">
                  <Input {...register(`fields.${index}.label`)} placeholder="Метка поля" />
                  <Input {...register(`fields.${index}.name`)} placeholder="Имя поля" />

                  <Select
                    defaultValue={field.type}
                    onValueChange={(value: FormStructure["type"]) => {
                      const updatedFields = [...watchedFields];
                      if (value === "radio_group" || value === "checkbox_group") {
                        updatedFields[index] = {
                          ...updatedFields[index],
                          type: value,
                          fields: [],
                        } as ICheckboxGroupField | IRadioGroupField;
                      } else {
                        updatedFields[index] = {
                          ...updatedFields[index],
                          type: value,
                          placeholder: "",
                          defaultValue: "",
                        } as ISimpleField;
                      }
                      reset(updatedFields);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {FIELD_TYPES.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      onCheckedChange={(checked) => setValue(`fields.${index}.required`, !!checked)}
                      defaultChecked={field.required}
                    />
                    <Label>Обязательное поле</Label>
                  </div>

                  {isGroupField(watchedFields[index]) ? (
                    <FieldOptions fieldIndex={index} control={control} register={register} />
                  ) : (
                    <>
                      <Input {...register(`fields.${index}.placeholder`)} placeholder="Placeholder" />
                      <Input {...register(`fields.${index}.defaultValue`)} placeholder="Значение по умолчанию" />
                    </>
                  )}
                </div>
              </Card>
            );
          })}

          <Button type="button" variant="outline" onClick={() => append(DEFAULT_SIMPLE_FIELD)}>
            Добавить поле
          </Button>
        </div>
      </FieldContent>
    </Field>
  );
};
