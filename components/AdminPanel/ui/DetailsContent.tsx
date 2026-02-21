import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Card, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";

const ALIGN_OPTIONS = [
  {
    value: "left",
    label: "Слева",
  },
  {
    value: "center",
    label: "По центру",
  },
  {
    value: "right",
    label: "Справа",
  },
];

export const DetailsContent = () => {
  const { control, register } = useFormContext();

  const { fields, append, remove } = useFieldArray({ name: "details", control });

  return (
    <section>
      <Field>
        <FieldLabel>Заголовок</FieldLabel>
        <FieldContent>
          <Input {...register("title")} placeholder="Детали" />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Выравнивание</FieldLabel>
        <FieldContent>
          <Select defaultValue="center">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {ALIGN_OPTIONS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Детали ({fields.length})</FieldLabel>
        <FieldContent>
          <div className="space-y-4">
            {fields.map((detail, index) => (
              <Card key={detail.id} className="p-4 flex flex-col">
                <CardTitle className="self-end">
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </CardTitle>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <Input {...register(`details.${index}.title`)} placeholder="Заголовок детали (опционально)" />
                  </div>
                  <Textarea {...register(`details.${index}.detail`)} placeholder="Текст детали" />
                </div>
              </Card>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                append({ detail: "", title: "" });
              }}
            >
              Добавить деталь
            </Button>
          </div>
        </FieldContent>
      </Field>
    </section>
  );
};
