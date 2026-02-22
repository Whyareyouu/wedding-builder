"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export interface IDecorationForm {
  decorations: {
    path: string;
    width: number;
    height: number;
    position: {
      top?: string;
      bottom?: string;
      left?: string;
      right?: string;
    };
    className?: string;
  }[];
}

const DEFAULT_DECORATION = {
  path: "/system/placeholder.jpg",
  width: 200,
  height: 200,
  position: {},
  className: "",
};

export const DecorationContent = () => {
  const { control, register } = useFormContext<IDecorationForm>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "decorations",
  });

  return (
    <Field>
      <FieldLabel>Декорации ({fields.length})</FieldLabel>
      <FieldContent>
        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id} className="p-4">
              <CardTitle className="flex justify-end">
                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardTitle>

              <div className="space-y-4">
                {/* Путь */}
                <Input {...register(`decorations.${index}.path` as const)} placeholder="Путь к изображению" />

                {/* Размеры */}
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    {...register(`decorations.${index}.width` as const, {
                      valueAsNumber: true,
                    })}
                    placeholder="Ширина"
                  />
                  <Input
                    type="number"
                    {...register(`decorations.${index}.height` as const, {
                      valueAsNumber: true,
                    })}
                    placeholder="Высота"
                  />
                </div>

                {/* Позиционирование */}
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Вверх (0px / 20%)" {...register(`decorations.${index}.position.top` as const)} />

                  <Input placeholder="Низ (0px)" {...register(`decorations.${index}.position.bottom` as const)} />

                  <Input placeholder="Лево (0px)" {...register(`decorations.${index}.position.left` as const)} />

                  <Input placeholder="Право (0px)" {...register(`decorations.${index}.position.right` as const)} />
                </div>

                {/* Доп классы */}
                <Textarea
                  {...register(`decorations.${index}.className` as const)}
                  placeholder="Дополнительные CSS классы"
                />
              </div>
            </Card>
          ))}

          <Button type="button" variant="outline" onClick={() => append(DEFAULT_DECORATION)}>
            Добавить декорацию
          </Button>
        </div>
      </FieldContent>
    </Field>
  );
};
