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
import { Textarea } from "@/components/ui/textarea";

export interface IFormBlock {
  fields: FormStructure[];
}

const FIELD_TYPES: { label: string; value: FormStructure["type"] }[] = [
  { label: "Текстовое поле", value: "input" },
  { label: "Многострочное поле", value: "textarea" },
  { label: "Группа радиокнопок", value: "radio_group" },
  { label: "Группа чекбоксов", value: "checkbox_group" },
  { label: "Селект", value: "select" },
];

const DEFAULT_SIMPLE_FIELD: ISimpleField = {
  type: "input",
  label: "",
  name: "",
  required: false,
  placeholder: "",
  defaultValue: "",
};

const DEFAULT_OPTION = { value: "", label: "" };

const isGroupField = (field: FormStructure | undefined): field is ICheckboxGroupField | IRadioGroupField =>
  field?.type === "radio_group" || field?.type === "checkbox_group" || field?.type === "select";

const FieldOptions = ({ fieldIndex }: { fieldIndex: number }) => {
  const { control, register } = useFormContext<IFormBlock>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `fields.${fieldIndex}.fields` as const,
  });

  return (
    <div className="mt-2 space-y-2">
      <Label className="text-sm">Варианты ответов:</Label>

      {fields.map((option, optIndex) => (
        <div key={option.id} className="flex gap-2">
          <Input
            {...register(`fields.${fieldIndex}.fields.${optIndex}.label` as const)}
            placeholder="Заголовок варианта"
          />
          <Input
            {...register(`fields.${fieldIndex}.fields.${optIndex}.value` as const)}
            placeholder="Значение варианта"
          />
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  });

  const watchedFields = useWatch({
    control,
    name: "fields",
  }) as FormStructure[];

  return (
    <Field>
      <FieldLabel>Поля формы ({fields.length})</FieldLabel>
      <FieldContent>
        <div className="space-y-4">
          {fields.map((field, index) => {
            const currentField = watchedFields?.[index];

            return (
              <Card key={field.id} className="p-4">
                <CardTitle className="flex justify-end">
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </CardTitle>

                <div className="space-y-3">
                  {/* Заголовок и имя */}
                  <Input {...register(`fields.${index}.label` as const)} placeholder="Заголовок поля" />
                  <Input {...register(`fields.${index}.name` as const)} placeholder="Имя поля" />

                  {/* Тип поля */}
                  <Select
                    value={currentField?.type}
                    onValueChange={(value: FormStructure["type"]) => {
                      const updated = [...watchedFields];

                      if (value === "radio_group" || value === "checkbox_group") {
                        updated[index] = {
                          type: value,
                          label: currentField?.label ?? "",
                          name: currentField?.name ?? "",
                          required: currentField?.required ?? false,
                          fields: [],
                        } as ICheckboxGroupField | IRadioGroupField;
                      } else {
                        updated[index] = {
                          type: value,
                          label: currentField?.label ?? "",
                          name: currentField?.name ?? "",
                          required: currentField?.required ?? false,
                          placeholder: "",
                          defaultValue: "",
                        } as ISimpleField;
                      }

                      reset({ fields: updated });
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

                  <Textarea {...register(`fields.${index}.hint`)} placeholder="Подсказка" />

                  {/* Обязательное поле */}
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={currentField?.required}
                      onCheckedChange={(checked) => setValue(`fields.${index}.required` as const, !!checked)}
                    />
                    <Label>Обязательное поле</Label>
                  </div>

                  {/* Опции для групповых полей */}
                  {isGroupField(currentField) ? (
                    <FieldOptions fieldIndex={index} />
                  ) : (
                    <>
                      <Input {...register(`fields.${index}.placeholder` as const)} placeholder="Placeholder" />
                      <Input
                        {...register(`fields.${index}.defaultValue` as const)}
                        placeholder="Значение по умолчанию"
                      />
                    </>
                  )}
                </div>
              </Card>
            );
          })}

          {/* Кнопка добавления нового поля */}
          <Button type="button" variant="outline" onClick={() => append(DEFAULT_SIMPLE_FIELD)}>
            Добавить поле
          </Button>
        </div>
      </FieldContent>
    </Field>
  );
};
