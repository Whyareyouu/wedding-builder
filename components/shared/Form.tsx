"use client";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Typography } from "@/components/ui/Typography";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import {
  FormStructure,
  ICheckboxGroupField,
  IRadioGroupField,
  ISelectGroupField,
  ISimpleField,
} from "@/types/blocks/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { InfoIcon } from "lucide-react";
import { ILayout } from "@/types/blocks/config";
import { useState } from "react";
import { toast } from "sonner";

type FormProps = {
  formData: FormStructure[];
  guestName?: string;
  decorations?: ILayout["decorations"];
  laptopDecorations?: ILayout["laptopDecorations"];
  mobileDecorations?: ILayout["mobileDecorations"];
};

const transformData = (formMetadata: FormStructure[], data: Record<string, unknown>) => {
  const result: Record<string, unknown> = {};

  for (const field of formMetadata) {
    if (field?.type === "input" || field.type === "textarea") {
      result[field.name] = data?.[field.name] || null;
    }

    if (field?.type === "radio_group" || field?.type === "select") {
      const selected = field.fields.find((item) => item.value === data[field.name]);
      result[field.name] = selected ? selected.label : null;
    }

    if (field.type === "checkbox_group") {
      if (!Array.isArray(data[field.name])) {
        result[field.name] = [];
        continue;
      }

      const mapped = field.fields
        .filter((item) => (data[field.name] as unknown[]).includes(item.value))
        .map((item) => item.label);

      result[field.name] = mapped;
    }
  }

  return result;
};

const CustomFieldLabel = ({
  name,
  label,
  error,
  hint,
}: {
  name: string;
  label: string;
  error?: boolean;
  hint?: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <FieldLabel htmlFor={name}>
      {hint && (
        <Tooltip open={open} onOpenChange={setOpen}>
          <TooltipTrigger type="button" onClick={() => setOpen((prev) => !prev)}>
            <InfoIcon />
          </TooltipTrigger>
          <TooltipContent className="max-w-[min(320px,calc(100vw-32px))] whitespace-pre-wrap" collisionPadding={16}>
            <Typography font="Cormorant" fontSize="xl">
              {hint}
            </Typography>
          </TooltipContent>
        </Tooltip>
      )}
      <Typography fontSize="xxl" font="Cormorant" className={error ? "text-black" : ""}>
        {label}
      </Typography>
    </FieldLabel>
  );
};

export const Form = ({ formData, guestName, decorations, laptopDecorations, mobileDecorations }: FormProps) => {
  const { handleSubmit, control } = useForm();

  const onError = () => {
    toast.warning("Заполните все обязательные поля", {
      description: "Пожалуйста, проверьте форму и попробуйте снова.",
    });
  };

  const onSubmit = async (data: Record<string, unknown>) => {
    const mappedData = transformData(formData, data);

    try {
      const response = await fetch("api/sheets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mappedData),
      });

      if (!response.ok) {
        throw new Error();
      }

      toast.success("Анкета отправлена!", {
        description: "Мы получили ваш ответ. Спасибо!",
      });
    } catch {
      toast.error("Не удалось отправить анкету", {
        description: "Попробуйте ещё раз или свяжитесь с нами напрямую.",
      });
    }
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
                <CustomFieldLabel
                  name={typedMetaField.name}
                  label={typedMetaField.label}
                  error={fieldState.invalid}
                  hint={typedMetaField?.hint}
                />
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
                <CustomFieldLabel
                  name={typedMetaField.name}
                  label={typedMetaField.label}
                  error={fieldState.invalid}
                  hint={typedMetaField?.hint}
                />
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
        const defaultValue =
          typedMetaField.name === "name" && guestName ? guestName : typedMetaField.defaultValue || "";
        return (
          <Controller
            control={control}
            key={typedMetaField.name}
            defaultValue={defaultValue}
            name={typedMetaField.name}
            rules={{ required: typedMetaField?.required }}
            render={({ fieldState, field }) => (
              <Field orientation="vertical" key={field.name} data-invalid={fieldState.invalid}>
                <CustomFieldLabel
                  name={typedMetaField.name}
                  label={typedMetaField.label}
                  error={fieldState.invalid}
                  hint={typedMetaField?.hint}
                />

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
            key={typedMetaField.name}
            name={typedMetaField.name}
            rules={{ required: typedMetaField?.required }}
            render={({ fieldState, field }) => (
              <Field orientation="vertical" key={metaFormField.name} data-invalid={fieldState.invalid}>
                <CustomFieldLabel
                  name={typedMetaField.name}
                  label={typedMetaField.label}
                  error={fieldState.invalid}
                  hint={typedMetaField?.hint}
                />
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
      case "select": {
        const typedMetaField = metaFormField as ISelectGroupField;
        return (
          <Controller
            name={typedMetaField.name}
            control={control}
            defaultValue={typedMetaField?.defaultValue}
            key={typedMetaField.name}
            rules={{ required: typedMetaField?.required }}
            render={({ field, fieldState }) => (
              <Field orientation="responsive" data-invalid={fieldState.invalid}>
                <FieldContent>
                  <CustomFieldLabel
                    name={typedMetaField.name}
                    label={typedMetaField?.label}
                    error={fieldState.invalid}
                    hint={typedMetaField?.hint}
                  />
                </FieldContent>

                <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id={typedMetaField.name} aria-invalid={fieldState.invalid} className="min-w-[120px]">
                    <SelectValue placeholder="Выберите из списка" />
                  </SelectTrigger>
                  <SelectContent position="item-aligned">
                    {typedMetaField?.fields.map((item, index) => (
                      <SelectItem key={index} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
    <SectionWrapper
      decorations={decorations}
      laptopDecorations={laptopDecorations}
      mobileDecorations={mobileDecorations}
    >
      <Typography font="GreatVibes" fontSize="title">
        Анкета
      </Typography>
      <form onSubmit={handleSubmit(onSubmit, onError)} className="flex flex-col gap-4 w-full">
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
