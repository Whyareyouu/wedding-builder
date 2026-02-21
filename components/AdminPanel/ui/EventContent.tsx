import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IEvent, IPlan } from "@/types/blocks/event";

const CARD_TYPES: { label: string; value: NonNullable<IEvent["type"]> }[] = [
  { label: "Временная линия", value: "TIME_LINE" },
  { label: "Карточки", value: "CARD" },
  { label: "Дорога", value: "ROAD" },
];

const DEFAULT_PLAN_ITEM: IPlan = {
  event: "",
  description: "",
  startTime: "",
  icon: { path: "", width: 64, height: 64 },
};

export const EventContent = () => {
  const { register, control, setValue } = useFormContext<IEvent>();

  const {
    fields: plan,
    append,
    remove,
  } = useFieldArray<IEvent>({
    control,
    name: "plan",
  });

  return (
    <>
      <Field>
        <FieldLabel>Заголовок</FieldLabel>
        <FieldContent>
          <Input {...register("title")} placeholder="План дня" />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Тип</FieldLabel>
        <FieldContent>
          <Select
            defaultValue="TIME_LINE"
            onValueChange={(value: NonNullable<IEvent["type"]>) => setValue("type", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {CARD_TYPES.map((item) => (
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
        <FieldLabel>События ({plan.length})</FieldLabel>
        <FieldContent>
          <div className="space-y-4">
            {plan.map((item, index) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-center justify-end mb-2">
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <div className="space-y-3">
                  <Input {...register(`plan.${index}.event`)} placeholder="Название события" />
                  <Textarea {...register(`plan.${index}.description`)} placeholder="Описание" />
                  <Input {...register(`plan.${index}.startTime`)} placeholder="Время начала" />
                  <Input {...register(`plan.${index}.icon.path`)} placeholder="Путь к иконке" />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      {...register(`plan.${index}.icon.width`, { valueAsNumber: true })}
                      type="number"
                      placeholder="Ширина"
                    />
                    <Input
                      {...register(`plan.${index}.icon.height`, { valueAsNumber: true })}
                      type="number"
                      placeholder="Высота"
                    />
                  </div>
                </div>
              </Card>
            ))}

            <Button type="button" variant="outline" onClick={() => append(DEFAULT_PLAN_ITEM)}>
              Добавить событие
            </Button>
          </div>
        </FieldContent>
      </Field>
    </>
  );
};
