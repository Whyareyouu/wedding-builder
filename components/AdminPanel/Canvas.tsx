"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ILayout } from "@/types/blocks/config";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, GripVertical } from "lucide-react";
import { Place } from "@/components/Place";
import { EventPlan } from "@/components/EventPlan";
import { Details } from "@/components/shared/Details";
import { DressCode } from "@/components/shared/DressCode";
import { Form } from "@/components/shared/Form";
import { Calendar } from "@/components/shared/Calendar";
import { PhotoFrame } from "@/components/shared/PhotoFrame";
import { IPlace } from "@/types/blocks/place";
import { IEvent } from "@/types/blocks/event";
import { IDetails } from "@/types/blocks/details";
import { IDressCode } from "@/types/blocks/dresscode";
import { FormStructure } from "@/types/blocks/form";
import { IFrame } from "@/types/blocks/frame";
import { IShared } from "@/types/blocks/config";

type CanvasProps = {
  blocks: (ILayout & { id: string })[];
  onRemoveBlock: (blockId: string) => void;
  onBlockSelect: (blockId: string) => void;
  selectedBlockId: string | null;
};

const defaultShared: IShared = {
  date: "20.06.2026",
  wifeName: "Полина",
  husbandName: "Никита",
  textDate: "20 июля 2026 года",
};

const renderBlockContent = (layout: ILayout) => {
  const { content, contentType } = layout;

  switch (contentType) {
    case "PLACE":
      return <Place content={content as IPlace} />;
    case "TIMINGS":
      return <EventPlan content={content as IEvent} />;
    case "DETAILS":
      return <Details content={content as IDetails} />;
    case "DRESSCODE":
      return <DressCode dresscode={content as IDressCode} />;
    case "FORM":
      return <Form formData={content as FormStructure[]} />;
    case "CALENDAR":
      return <Calendar targetDate={defaultShared.date} />;
    case "FRAME":
      return <PhotoFrame content={content as IFrame} />;
    default:
      return <div className="p-4 text-gray-500">Неизвестный тип блока</div>;
  }
};

const SortableBlock = ({
  block,
  onRemove,
  onSelect,
  isSelected,
}: {
  block: ILayout & { id: string };
  onRemove: (blockId: string) => void;
  onSelect: (blockId: string) => void;
  isSelected: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <Card
        className={`p-4 mb-4 cursor-pointer transition-all ${
          isSelected ? "ring-2 ring-primary ring-offset-2" : ""
        }`}
        onClick={(e) => {
          // Не выбираем блок, если клик был на кнопку удаления или grip
          if ((e.target as HTMLElement).closest("button")) {
            return;
          }
          onSelect(block.id);
        }}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
              aria-label="Переместить блок"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className="w-5 h-5" />
            </button>
            <span className="text-xs font-medium text-gray-500 uppercase">{block.contentType}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(block.id);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Удалить блок"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
        <div className="border-t pt-4">{renderBlockContent(block)}</div>
      </Card>
    </div>
  );
};

export const Canvas = ({ blocks, onRemoveBlock, onBlockSelect, selectedBlockId }: CanvasProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: "canvas",
  });

  const blockIds = blocks.map((b) => b.id);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Холст</h2>
      <div
        ref={setNodeRef}
        className={`min-h-[400px] p-6 rounded-lg border-2 border-dashed transition-colors ${
          isOver ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
        }`}
      >
        {blocks.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p className="text-lg mb-2">Перетащите блоки из палитры сюда</p>
            <p className="text-sm">Используйте drag-and-drop для изменения порядка</p>
          </div>
        ) : (
          <SortableContext items={blockIds} strategy={verticalListSortingStrategy}>
            {blocks.map((block) => (
              <SortableBlock
                key={block.id}
                block={block}
                onRemove={onRemoveBlock}
                onSelect={onBlockSelect}
                isSelected={selectedBlockId === block.id}
              />
            ))}
          </SortableContext>
        )}
      </div>
    </div>
  );
};

