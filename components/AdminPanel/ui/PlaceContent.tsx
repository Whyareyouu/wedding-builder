import { Controller, useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IPlace } from "@/types/blocks/place";

const PLACE_TYPES: { label: string; value: IPlace["type"] }[] = [
  { label: "Карта", value: "MAP" },
  { label: "Рамка", value: "FRAME" },
];

const DEFAULT_PLACE = {
  title: "",
  address: "",
  startTime: "",
  dividerIcon: "",
};

const PlaceContent = () => {
  const { register, control } = useFormContext<IPlace>();

  const {
    fields: places,
    append,
    remove,
  } = useFieldArray<IPlace>({
    control,
    name: "places",
  });

  const type = useWatch<IPlace>({ control, name: "type" });

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
              <Select
                defaultValue="MAP"
                onValueChange={(value: IPlace["type"]) => field.onChange(value)}
                value={field.value}
              >
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
        <FieldContent>
          <div className="space-y-4">
            {places.map((place, index) => (
              <Card key={place.id} className="p-4">
                <CardTitle className="self-end">
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
                      <Textarea {...register(`places.${index}.mapSettings.hint`)} placeholder="Подсказка на карте" />
                      <Input {...register(`places.${index}.mapSettings.markerIcon`)} placeholder="Иконка маркера" />
                      <Input {...register(`places.${index}.mapSettings.yandexMapUrl`)} placeholder="URL Яндекс карты" />
                    </>
                  )}

                  {type === "FRAME" && (
                    <>
                      <Input {...register(`places.${index}.mapSettings.yandexMapUrl`)} placeholder="URL Яндекс карты" />
                      <Input {...register(`places.${index}.frameSettings.frameBorderColor`)} placeholder="Цвет рамки" />
                      <Input
                        {...register(`places.${index}.frameSettings.frameIntervalMs`, {
                          valueAsNumber: true,
                        })}
                        type="number"
                        placeholder="Интервал смены изображений (мс)"
                      />
                      <FrameImages index={index} />
                    </>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <Button type="button" variant="outline" onClick={() => append(DEFAULT_PLACE)}>
            Добавить место
          </Button>
        </FieldContent>
      </Field>
    </>
  );
};

const FrameImages = ({ index }: { index: number }) => {
  const { control, register } = useFormContext<IPlace>();

  const {
    fields: images,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `places.${index}.frameSettings.images`,
  });

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Изображения</p>
      {images.map((image, imageIndex) => (
        <div key={image.id} className="flex items-center gap-2">
          <Input
            {...register(`places.${index}.frameSettings.images.${imageIndex}.path`)}
            placeholder="Путь к изображению"
          />
          <Input
            {...register(`places.${index}.frameSettings.images.${imageIndex}.width`, { valueAsNumber: true })}
            type="number"
            placeholder="Ширина"
            className="w-24"
          />
          <Input
            {...register(`places.${index}.frameSettings.images.${imageIndex}.height`, { valueAsNumber: true })}
            type="number"
            placeholder="Высота"
            className="w-24"
          />
          <Button type="button" variant="ghost" size="icon" onClick={() => remove(imageIndex)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => append({ path: "", width: 0, height: 0 })}>
        Добавить изображение
      </Button>
    </div>
  );
};

export default PlaceContent;
