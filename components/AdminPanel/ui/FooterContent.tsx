import { useFormContext } from "react-hook-form";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { useWatch } from "react-hook-form";
import { IFooter } from "@/types/blocks/footer";

export const FooterContent = () => {
  const { register, control, setValue } = useFormContext<IFooter>();

  const disableGenderEnding = useWatch({ control, name: "disableGenderEnding" });

  return (
    <div className="space-y-3">
      <Field>
        <FieldLabel>Базовый текст</FieldLabel>
        <FieldContent>
          <Input {...register("baseText")} placeholder="До встречи" />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Разделитель пары</FieldLabel>
        <FieldContent>
          <Input {...register("pairSeparator")} placeholder=" & " />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Полное переопределение обращения</FieldLabel>
        <FieldContent>
          <Input {...register("alwaysText")} placeholder="дорогие гости" />
        </FieldContent>
      </Field>

      <div className="flex items-center gap-2">
        <Checkbox
          id="disableGenderEnding"
          checked={!!disableGenderEnding}
          onCheckedChange={(checked) => setValue("disableGenderEnding", !!checked)}
        />
        <Label htmlFor="disableGenderEnding">Отключить гендерные окончания</Label>
      </div>

      {!disableGenderEnding && (
        <div className="border rounded-md p-3 space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Гендерная конфигурация</p>
          <Field>
            <FieldLabel>Мужское окончание</FieldLabel>
            <FieldContent>
              <Input {...register("genderConfig.maleEnding")} placeholder="ой" />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Женское окончание</FieldLabel>
            <FieldContent>
              <Input {...register("genderConfig.femaleEnding")} placeholder="ая" />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Форма для пары</FieldLabel>
            <FieldContent>
              <Input {...register("genderConfig.pluralText")} placeholder="дорогие" />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Основа обращения</FieldLabel>
            <FieldContent>
              <Input {...register("genderConfig.singleBase")} placeholder="дорог" />
            </FieldContent>
          </Field>
        </div>
      )}
    </div>
  );
};
