"use client";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Typography } from "@/components/ui/Typography";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { FormStructure, ICheckboxGroupField, IRadioGroupField, ISimpleField } from "@/types/blocks/form";

type FormProps = {
  formData: FormStructure[];
};

const CustomFieldLabel = ({ name, label, error }: { name: string; label: string; error?: boolean }) => {
  return (
    <FieldLabel htmlFor={name}>
      <Typography fontSize="xxl" font="Cormorant" className={error ? "text-black" : ""}>
        {label}
      </Typography>
    </FieldLabel>
  );
};

export const Form = ({ formData }: FormProps) => {
  const { handleSubmit, control } = useForm();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const onSubmit = (data) => {
    console.log(data);
  };

  const renderForm = (metaFormField: FormStructure) => {
    switch (metaFormField.type) {
      case "radio_group": {
        const typedMetaField = metaFormField as IRadioGroupField;
        return (
          <Controller
            defaultValue={metaFormField?.defaultValue}
            name={typedMetaField.name}
            control={control}
            key={metaFormField.name}
            rules={{ required: metaFormField.required }}
            render={({ field: { onChange, value }, fieldState }) => (
              <RadioGroup onValueChange={onChange} value={value}>
                <CustomFieldLabel name={typedMetaField.name} label={typedMetaField.label} error={fieldState.invalid} />
                {typedMetaField.fields.map((field) => (
                  <Field
                    key={field.value}
                    orientation="horizontal"
                    data-invalid={fieldState.invalid}
                    className="flex items-center gap-3"
                  >
                    <RadioGroupItem value={field.value} id={field.value} aria-invalid={fieldState.invalid} />
                    <Label htmlFor={field.value}>
                      <Typography font="Cormorant" fontSize="xl">
                        {field.label}
                      </Typography>
                    </Label>
                  </Field>
                ))}
              </RadioGroup>
            )}
          />
        );
      }
      case "checkbox_group": {
        const typedMetaField = metaFormField as ICheckboxGroupField;
        return (
          <Controller
            name={typedMetaField.name}
            control={control}
            key={metaFormField.name}
            rules={{ required: typedMetaField?.required }}
            defaultValue={[]}
            render={({ field: { onChange, value }, fieldState }) => (
              <FieldGroup className="gap-0">
                <CustomFieldLabel name={typedMetaField.name} label={typedMetaField.label} error={fieldState.invalid} />
                <FieldSet data-invalid={fieldState.invalid}>
                  <FieldGroup data-slot="checkbox-group" style={{ gap: 0 }}>
                    {typedMetaField.fields.map((field) => (
                      <Field key={field.value} orientation="horizontal" data-invalid={fieldState.invalid}>
                        <Checkbox
                          id={field.value}
                          name={field.value}
                          aria-invalid={fieldState.invalid}
                          checked={value?.includes(field.value)}
                          onCheckedChange={(checked) => {
                            const newValue = checked
                              ? [...value, field.value]
                              : value.filter((value: string) => value !== field.value);
                            onChange(newValue);
                          }}
                        />
                        <FieldLabel htmlFor={field.value} className="font-normal">
                          <Typography fontSize="xl" font="Cormorant">
                            {field.label}
                          </Typography>
                        </FieldLabel>
                      </Field>
                    ))}
                  </FieldGroup>
                </FieldSet>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </FieldGroup>
            )}
          />
        );
      }
      case "input": {
        const typedMetaField = metaFormField as ISimpleField;
        return (
          <Controller
            control={control}
            key={typedMetaField.name}
            defaultValue={typedMetaField.defaultValue || ""}
            name={typedMetaField.name}
            rules={{ required: typedMetaField?.required }}
            render={({ fieldState, field }) => (
              <Field orientation="vertical" key={field.name} data-invalid={fieldState.invalid}>
                <CustomFieldLabel name={typedMetaField.name} label={typedMetaField.label} error={fieldState.invalid} />

                <Input
                  id={typedMetaField.name}
                  placeholder={typedMetaField?.placeholder || "Введите текст"}
                  aria-invalid={fieldState.invalid}
                  {...field}
                  autoComplete="off"
                  className={fieldState.invalid ? "border-destructive" : ""}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        );
      }
      case "textarea": {
        const typedMetaField = metaFormField as ISimpleField;
        return (
          <Controller
            control={control}
            defaultValue={typedMetaField.defaultValue || ""}
            name={typedMetaField.name}
            rules={{ required: typedMetaField?.required }}
            render={({ fieldState, field }) => (
              <Field orientation="vertical" key={metaFormField.name} data-invalid={fieldState.invalid}>
                <CustomFieldLabel name={typedMetaField.name} label={typedMetaField.label} error={fieldState.invalid} />
                <Textarea
                  id={typedMetaField.name}
                  placeholder={typedMetaField?.placeholder || "Введите текст"}
                  aria-invalid={fieldState.invalid}
                  {...field}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        );
      }
      default:
        return null;
    }
  };

  return (
    <SectionWrapper>
      <Typography font="GreatVibes" fontSize="title">
        Анкета
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
        {formData.map((formField) => renderForm(formField))}
        <Button type="submit" variant="default" className="rounded-3xl max-w-72 w-full self-center py-8">
          <Typography font="Cormorant" fontSize="xxl">
            Отправить
          </Typography>
        </Button>
      </form>
    </SectionWrapper>
  );
};
