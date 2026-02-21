"use client";

import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { ContentTypes } from "@/types/blocks/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Field, FieldContent, FieldLabel, FieldGroup } from "@/components/ui/field";
import { FormProvider } from "react-hook-form";
import { DetailsContent } from "@/components/AdminPanel/ui/DetailsContent";
import PlaceContent from "@/components/AdminPanel/ui/PlaceContent";

interface PlacedBlock {
  id: string;
  type: ContentTypes;
  props: Record<string, any>;
}

interface BlockEditorProps {
  block: PlacedBlock;
  onSave: (id: string, props: Record<string, any> | any[]) => void;
  onClose?: () => void;
}

export const BlockEditor = ({ block, onSave, onClose }: BlockEditorProps) => {
  // Для FORM блока props это массив, для остальных - объект
  const defaultValues = block.type === "FORM" && Array.isArray(block.props) ? block.props : block.props;

  const methods = useForm({
    defaultValues,
  });

  const { register, handleSubmit, watch, setValue, control, getValues } = methods;

  const onSubmit = (data: Record<string, any> | any[]) => {
    // Для FORM блока нужно получить весь массив через getValues()
    if (block.type === "FORM") {
      const allValues = getValues();
      const formArray = Array.isArray(allValues) ? allValues : Object.values(allValues);
      onSave(block.id, formArray);
    } else {
      onSave(block.id, data as Record<string, any>);
    }
  };

  const renderFormFields = () => {
    switch (block.type) {
      case "PLACE":
        return <PlaceContent />;
      case "TIMINGS":
        return <TimingsFormFields register={register} watch={watch} setValue={setValue} />;
      case "DETAILS":
        return <DetailsContent />;
      case "DRESSCODE":
        return <DressCodeFormFields register={register} watch={watch} setValue={setValue} />;
      case "FORM":
        return <FormFormFields register={register} watch={watch} setValue={setValue} control={control} />;
      case "CALENDAR":
        return <div className="text-sm text-gray-500">Календарь не требует редактирования</div>;
      case "FRAME":
        return <FrameFormFields register={register} watch={watch} setValue={setValue} />;
      default:
        return <div className="text-sm text-gray-500">Неизвестный тип блока</div>;
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Редактирование блока</h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel>Тип блока</FieldLabel>
              <FieldContent>
                <Input value={block.type} disabled className="bg-gray-50" />
              </FieldContent>
            </Field>

            {renderFormFields()}
          </FieldGroup>

          <div className="flex gap-2 pt-4 border-t">
            <Button type="submit" className="flex-1">
              Применить
            </Button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
};

const TimingsFormFields = ({ register, watch, setValue }: any) => {
  const plan = watch("plan") || [];
  const title = watch("title") || "";
  const type = watch("type") || "TIME_LINE";

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
          <select
            {...register("type")}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
          >
            <option value="TIME_LINE">Временная линия</option>
            <option value="CARD">Карточки</option>
            <option value="ROAD">Дорога</option>
          </select>
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>События ({plan.length})</FieldLabel>
        <FieldContent>
          <div className="space-y-4">
            {plan.map((item: any, index: number) => (
              <Card key={index} className="p-4">
                <div className="space-y-3">
                  <Input {...register(`plan.${index}.event`)} placeholder="Название события" />
                  <Textarea {...register(`plan.${index}.description`)} placeholder="Описание" />
                  <Input {...register(`plan.${index}.startTime`)} placeholder="Время начала" />
                  <Input {...register(`plan.${index}.icon.path`)} placeholder="Путь к иконке" />
                  <div className="grid grid-cols-2 gap-2">
                    <Input {...register(`plan.${index}.icon.width`)} type="number" placeholder="Ширина" />
                    <Input {...register(`plan.${index}.icon.height`)} type="number" placeholder="Высота" />
                  </div>
                </div>
              </Card>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const newPlan = [
                  ...plan,
                  { event: "", description: "", startTime: "", icon: { path: "", width: 64, height: 64 } },
                ];
                setValue("plan", newPlan);
              }}
            >
              Добавить событие
            </Button>
          </div>
        </FieldContent>
      </Field>
    </>
  );
};

const DressCodeFormFields = ({ register, watch, setValue }: any) => {
  const colorSchema = watch("colorSchema") || [];
  const title = watch("title") || "";

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
            {colorSchema.map((schema: any, index: number) => (
              <Card key={index} className="p-4">
                <div className="space-y-3">
                  <Input {...register(`colorSchema.${index}.color`)} type="color" placeholder="Цвет" />
                  <Input {...register(`colorSchema.${index}.maleDressCodeImg`)} placeholder="Изображение для мужчин" />
                  <Input
                    {...register(`colorSchema.${index}.femaleDressCodeImg`)}
                    placeholder="Изображение для женщин"
                  />
                </div>
              </Card>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const newSchema = [...colorSchema, { color: "#000000", maleDressCodeImg: "", femaleDressCodeImg: "" }];
                setValue("colorSchema", newSchema);
              }}
            >
              Добавить цветовую схему
            </Button>
          </div>
        </FieldContent>
      </Field>
    </>
  );
};

const FormFormFields = ({ register, watch, setValue, control }: any) => {
  // Для FORM блока watch() возвращает весь массив
  const formFields = watch() || [];

  return (
    <Field>
      <FieldLabel>Поля формы ({formFields.length})</FieldLabel>
      <FieldContent>
        <div className="space-y-4">
          {formFields.map((field: any, index: number) => (
            <Card key={index} className="p-4">
              <div className="space-y-3">
                <Input {...register(`${index}.label`)} placeholder="Метка поля" />
                <Input {...register(`${index}.name`)} placeholder="Имя поля" />
                <select
                  {...register(`${index}.type`)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                >
                  <option value="input">Текстовое поле</option>
                  <option value="textarea">Многострочное поле</option>
                  <option value="radio_group">Группа радиокнопок</option>
                  <option value="checkbox_group">Группа чекбоксов</option>
                </select>
                <div className="flex items-center gap-2">
                  <Checkbox {...register(`${index}.required`)} />
                  <Label>Обязательное поле</Label>
                </div>
                {field?.type === "radio_group" || field?.type === "checkbox_group" ? (
                  <div className="mt-2 space-y-2">
                    <Label className="text-sm">Варианты ответов:</Label>
                    {(field.fields || []).map((opt: any, optIndex: number) => (
                      <div key={optIndex} className="flex gap-2">
                        <Input {...register(`${index}.fields.${optIndex}.value`)} placeholder="Значение" />
                        <Input {...register(`${index}.fields.${optIndex}.label`)} placeholder="Метка" />
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const currentFields = watch(`${index}.fields`) || [];
                        setValue(`${index}.fields`, [...currentFields, { value: "", label: "" }]);
                      }}
                    >
                      Добавить вариант
                    </Button>
                  </div>
                ) : (
                  <>
                    <Input {...register(`${index}.placeholder`)} placeholder="Placeholder" />
                    <Input {...register(`${index}.defaultValue`)} placeholder="Значение по умолчанию" />
                  </>
                )}
              </div>
            </Card>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const currentFields = watch() || [];
              const newFields = [
                ...(Array.isArray(currentFields) ? currentFields : []),
                { type: "input", label: "", name: "", required: false },
              ];
              // Обновляем значения для всех полей
              newFields.forEach((field, index) => {
                setValue(`${index}`, field);
              });
            }}
          >
            Добавить поле
          </Button>
        </div>
      </FieldContent>
    </Field>
  );
};

const FrameFormFields = ({ register, watch, setValue }: any) => {
  const images = watch("images") || [];
  const frameBorderColor = watch("frameBorderColor") || "#000000";
  const frameIntervalMs = watch("frameIntervalMs") || 3000;

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
          <Input {...register("frameIntervalMs")} type="number" />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Изображения ({images.length})</FieldLabel>
        <FieldContent>
          <div className="space-y-4">
            {images.map((image: any, index: number) => (
              <Card key={index} className="p-4">
                <div className="space-y-3">
                  <Input {...register(`images.${index}.path`)} placeholder="Путь к изображению" />
                  <div className="grid grid-cols-2 gap-2">
                    <Input {...register(`images.${index}.width`)} type="number" placeholder="Ширина" />
                    <Input {...register(`images.${index}.height`)} type="number" placeholder="Высота" />
                  </div>
                </div>
              </Card>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const newImages = [...images, { path: "", width: 0, height: 0 }];
                setValue("images", newImages);
              }}
            >
              Добавить изображение
            </Button>
          </div>
        </FieldContent>
      </Field>
    </>
  );
};
