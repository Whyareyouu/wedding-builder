"use client";

import { useForm } from "react-hook-form";
import { ContentTypes } from "@/types/blocks/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Field, FieldContent, FieldLabel, FieldGroup } from "@/components/ui/field";
import { FormProvider } from "react-hook-form";
import { DetailsContent } from "./DetailsContent";
import { PlaceContent } from "./PlaceContent";
import { DresscodeContent } from "./DresscodeContent";
import { FrameContent } from "./FrameContent";
import { FormContent } from "./FormContent";
import { EventContent } from "./EventContent";
import { DecorationContent } from "@/components/AdminPanel/ui/DecorationContent";

interface PlacedBlock {
  id: string;
  type: ContentTypes;
  props: Record<string, any>;
}

interface BlockEditorProps {
  block: PlacedBlock;
  onSave: (id: string, props: Record<string, any> | any[]) => void;
  onClose: () => void;
}

const WITHOUT_DECORATIONS = ["CALENDAR", "FRAME"];

export const BlockEditor = ({ block, onSave, onClose }: BlockEditorProps) => {
  const defaultValues = block.type === "FORM" ? { fields: Array.isArray(block.props) ? block.props : [] } : block.props;

  const methods = useForm({ defaultValues });

  const { handleSubmit } = methods;

  const onSubmit = (data: Record<string, any>) => {
    if (block.type === "FORM") {
      onSave(block.id, (data as { fields: [] }).fields);
    } else {
      onSave(block.id, data);
    }
    onClose();
  };

  const renderFormFields = () => {
    switch (block.type) {
      case "PLACE":
        return <PlaceContent />;
      case "TIMINGS":
        return <EventContent />;
      case "DETAILS":
        return <DetailsContent />;
      case "DRESSCODE":
        return <DresscodeContent />;
      case "FORM":
        return <FormContent />;
      case "CALENDAR":
        return <div className="text-sm text-gray-500">Календарь не требует редактирования</div>;
      case "FRAME":
        return <FrameContent basePath="" />;
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
          {!WITHOUT_DECORATIONS.includes(block.type) && <DecorationContent />}

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
