import { useFormContext } from "react-hook-form";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { IShared } from "@/types/blocks/config";

export const SharedContent = () => {
  const { register } = useFormContext<IShared>();

  return (
    <div className="space-y-3">
      <Field>
        <FieldLabel>Имя невесты</FieldLabel>
        <FieldContent>
          <Input {...register("wifeName")} placeholder="Полина" />
        </FieldContent>
      </Field>
      <Field>
        <FieldLabel>Имя жениха</FieldLabel>
        <FieldContent>
          <Input {...register("husbandName")} placeholder="Никита" />
        </FieldContent>
      </Field>
      <Field>
        <FieldLabel>Дата (формат ДД.ММ.ГГГГ)</FieldLabel>
        <FieldContent>
          <Input {...register("date")} placeholder="20.06.2026" />
        </FieldContent>
      </Field>
      <Field>
        <FieldLabel>Текстовая дата</FieldLabel>
        <FieldContent>
          <Input {...register("textDate")} placeholder="20 июля 2026 года" />
        </FieldContent>
      </Field>
      <Field>
        <FieldLabel>Фоновое изображение</FieldLabel>
        <FieldContent>
          <Input {...register("backgroundImage")} placeholder="/images/bg.jpg" />
        </FieldContent>
      </Field>
    </div>
  );
};
