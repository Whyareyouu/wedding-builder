import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { useForm } from "react-hook-form";

import { v4 } from "uuid";

type FormData = {
  title: string;
  id: string;
  isActive: boolean;
};

type SaveModalProps = {
  isOpen: boolean;
  onClose: () => void;
  handleSaveForm: (data: FormData) => void;
  defaultValues?: FormData;
};

export const SaveModal = ({ isOpen, onClose, handleSaveForm, defaultValues }: SaveModalProps) => {
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: { ...defaultValues, id: defaultValues?.id ?? v4() },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <form onSubmit={handleSubmit(handleSaveForm)}>
          <DialogHeader>
            <DialogTitle>Сохранение шаблона</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <Field>
              <FieldLabel htmlFor="save-title">Заголовок</FieldLabel>
              <FieldContent>
                <Input
                  id="save-title"
                  placeholder="Название шаблона"
                  required
                  {...register("title", { required: true })}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="save-id">Идентификатор</FieldLabel>
              <FieldContent>
                <Input
                  id="save-id"
                  {...register("id", { required: true })}
                  required={true}
                  disabled
                  className="text-muted-foreground"
                />
              </FieldContent>
            </Field>

            <div className="flex items-center gap-2">
              <Checkbox id="save-active" {...register("isActive")} />
              <Label htmlFor="save-active">Сделать шаблон активным</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose} type="button">
              Отмена
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Сохранить
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
