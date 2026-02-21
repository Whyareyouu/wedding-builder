import { Controller, useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IPlace } from "@/types/blocks/place";
import { FrameContent } from "@/components/AdminPanel/ui/FrameContent";

const PLACE_TYPES: { label: string; value: IPlace["type"] }[] = [
  { label: "Карта", value: "MAP" },
  { label: "Рамка", value: "FRAME" },
];

export const PlaceContent = () => {
  const { register, control } = useFormContext<IPlace>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "places",
  });

  const type = useWatch({
    control,
    name: "type",
  });

  const handleAppend = () => {
    if (type === "MAP") {
      append({
        title: "",
        address: "",
        startTime: "",
        dividerIcon: "",
        mapSettings: {
          coordinates: [0, 0],
          zoom: 10,
          hint: "",
          markerIcon: "",
          yandexMapUrl: "",
        },
      });
    }

    if (type === "FRAME") {
      append({
        title: "",
        address: "",
        startTime: "",
        dividerIcon: "",
        mapSettings: {
          yandexMapUrl: "",
        },
        frameSettings: {
          frameBorderColor: "#000000",
          frameIntervalMs: 3000,
          images: [],
        },
      });
    }
  };

  return (
    <>
      <Field>
        <FieldLabel>Заголовок</FieldLabel>
        <FieldContent>
          <Input {...register("title")} placeholder="Локация" />
        </FieldContent>
      </Field>

      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <Field>
            <FieldLabel>Тип отображения</FieldLabel>
            <FieldContent>
              <Select value={field.value} onValueChange={(value: IPlace["type"]) => field.onChange(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {PLACE_TYPES.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FieldContent>
          </Field>
        )}
      />

      <Field>
        <FieldLabel>Места ({fields.length})</FieldLabel>
        <FieldContent>
          <div className="space-y-4">
            {fields.map((place, index) => (
              <Card key={place.id} className="p-4">
                <CardTitle className="flex justify-end">
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </CardTitle>

                <div className="space-y-3">
                  <Input {...register(`places.${index}.title`)} placeholder="Название места" />

                  <Input {...register(`places.${index}.address`)} placeholder="Адрес" />

                  <Input {...register(`places.${index}.startTime`)} placeholder="Время начала" />

                  <Input {...register(`places.${index}.dividerIcon`)} placeholder="Иконка разделителя" />

                  {type === "MAP" && (
                    <>
                      <Textarea {...register(`places.${index}.mapSettings.hint`)} placeholder="Подсказка" />

                      <Input {...register(`places.${index}.mapSettings.markerIcon`)} placeholder="Иконка маркера" />

                      <Input {...register(`places.${index}.mapSettings.yandexMapUrl`)} placeholder="URL Яндекс карты" />
                    </>
                  )}

                  {type === "FRAME" && (
                    <>
                      <Input {...register(`places.${index}.mapSettings.yandexMapUrl`)} placeholder="URL Яндекс карты" />

                      <Input {...register(`places.${index}.frameSettings.frameBorderColor`)} placeholder="Цвет рамки" />

                      <Input
                        type="number"
                        {...register(`places.${index}.frameSettings.frameIntervalMs`, { valueAsNumber: true })}
                        placeholder="Интервал (мс)"
                      />

                      <FrameContent basePath={`places.${index}.frameSettings`} />
                    </>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <Button type="button" variant="outline" onClick={handleAppend}>
            Добавить место
          </Button>
        </FieldContent>
      </Field>
    </>
  );
};
