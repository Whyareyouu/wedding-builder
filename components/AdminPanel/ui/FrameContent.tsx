import { useFieldArray, useFormContext } from "react-hook-form";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { IFrame } from "@/types/blocks/frame";
import { IImage } from "@/types/blocks/config";

const DEFAULT_IMAGE: IImage = {
  path: "/system/placeholder.jpg",
  width: 0,
  height: 0,
};

export const FrameContent = () => {
  const { register, control } = useFormContext<IFrame>();

  const {
    fields: images,
    append,
    remove,
  } = useFieldArray<IFrame>({
    control,
    name: "images",
  });

  return (
    <>
      <Field>
        <FieldLabel>Цвет рамки</FieldLabel>
        <FieldContent>
          <Input {...register("frameBorderColor")} type="color" />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Интервал смены (мс)</FieldLabel>
        <FieldContent>
          <Input {...register("frameIntervalMs", { valueAsNumber: true })} type="number" />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Изображения ({images.length})</FieldLabel>
        <FieldContent>
          <div className="space-y-4">
            {images.map((image, index) => (
              <Card key={image.id} className="p-4">
                <CardTitle className="self-end">
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </CardTitle>
                <div className="space-y-3">
                  <Input {...register(`images.${index}.path`)} placeholder="Путь к изображению" />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      {...register(`images.${index}.width`, { valueAsNumber: true })}
                      type="number"
                      placeholder="Ширина"
                    />
                    <Input
                      {...register(`images.${index}.height`, { valueAsNumber: true })}
                      type="number"
                      placeholder="Высота"
                    />
                  </div>
                </div>
              </Card>
            ))}

            <Button type="button" variant="outline" onClick={() => append(DEFAULT_IMAGE)}>
              Добавить изображение
            </Button>
          </div>
        </FieldContent>
      </Field>
    </>
  );
};
