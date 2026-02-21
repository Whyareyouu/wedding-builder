import { useFieldArray, useFormContext } from "react-hook-form";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ColorSchemaItem, IDressCode } from "@/types/blocks/dresscode";

const DEFAULT_COLOR_SCHEMA: ColorSchemaItem = {
  color: "#000000",
  maleDressCodeImg: "/system/placeholder.jpg",
  femaleDressCodeImg: "/system/placeholder.jpg",
};

export const DresscodeContent = () => {
  const { register, control } = useFormContext<IDressCode>();

  const {
    fields: colorSchema,
    append,
    remove,
  } = useFieldArray<IDressCode>({
    control,
    name: "colorSchema",
  });

  return (
    <>
      <Field>
        <FieldLabel>Заголовок</FieldLabel>
        <FieldContent>
          <Input {...register("title")} placeholder="Дресскод" />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Цветовые схемы ({colorSchema.length})</FieldLabel>
        <FieldContent>
          <div className="space-y-4">
            {colorSchema.map((schema, index) => (
              <Card key={schema.id} className="p-4">
                <CardTitle className="self-end">
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </CardTitle>
                <div className="space-y-3">
                  <Input {...register(`colorSchema.${index}.color`)} type="color" />
                  <Input {...register(`colorSchema.${index}.maleDressCodeImg`)} placeholder="Изображение для мужчин" />
                  <Input
                    {...register(`colorSchema.${index}.femaleDressCodeImg`)}
                    placeholder="Изображение для женщин"
                  />
                </div>
              </Card>
            ))}

            <Button type="button" variant="outline" onClick={() => append(DEFAULT_COLOR_SCHEMA)}>
              Добавить цветовую схему
            </Button>
          </div>
        </FieldContent>
      </Field>
    </>
  );
};
