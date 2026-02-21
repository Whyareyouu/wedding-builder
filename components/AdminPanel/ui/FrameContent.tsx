import { FieldArrayPath, FieldPath, FieldValues, useFieldArray, useFormContext } from "react-hook-form";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

import { IImage } from "@/types/blocks/config";

type FrameContentProps<T extends FieldValues, TPath extends FieldPath<T>> = {
  basePath: TPath;
};

const DEFAULT_IMAGE: IImage = {
  path: "/system/placeholder.jpg",
  width: 0,
  height: 0,
};

export const FrameContent = <T extends FieldValues, TPath extends FieldPath<T>>({
  basePath,
}: FrameContentProps<T, TPath>) => {
  const { register, control } = useFormContext<T>();

  const imagesArrayPath = `${basePath}.images` as FieldArrayPath<T>;

  const { fields, append, remove } = useFieldArray({
    control,
    name: imagesArrayPath,
  });

  return (
    <>
      <Field>
        <FieldLabel>Цвет рамки</FieldLabel>
        <FieldContent>
          <Input {...register(`${basePath}.frameBorderColor` as FieldPath<T>)} type="color" />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Интервал смены (мс)</FieldLabel>
        <FieldContent>
          <Input {...register(`${basePath}.frameIntervalMs` as FieldPath<T>, { valueAsNumber: true })} type="number" />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Изображения ({fields.length})</FieldLabel>
        <FieldContent>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <Card key={field.id} className="p-4">
                <CardTitle className="flex justify-end">
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </CardTitle>

                <div className="space-y-3">
                  <Input
                    {...register(`${basePath}.images.${index}.path` as FieldPath<T>)}
                    placeholder="Путь к изображению"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      {...register(`${basePath}.images.${index}.width` as FieldPath<T>, { valueAsNumber: true })}
                      type="number"
                      placeholder="Ширина"
                    />

                    <Input
                      {...register(`${basePath}.images.${index}.height` as FieldPath<T>, { valueAsNumber: true })}
                      type="number"
                      placeholder="Высота"
                    />
                  </div>
                </div>
              </Card>
            ))}

            <Button type="button" variant="outline" onClick={() => append(DEFAULT_IMAGE as any)}>
              Добавить изображение
            </Button>
          </div>
        </FieldContent>
      </Field>
    </>
  );
};
