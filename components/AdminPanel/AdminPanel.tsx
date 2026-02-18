"use client";

import { useState } from "react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { ILayout, ContentTypes } from "@/types/blocks/config";
import { BlockPalette } from "./BlockPalette";
import { Canvas } from "./Canvas";
import { Button } from "@/components/ui/button";

type BlockWithId = ILayout & { id: string };

const BLOCK_TYPES: { type: ContentTypes; label: string }[] = [
  { type: "PLACE", label: "Место" },
  { type: "TIMINGS", label: "План дня" },
  { type: "DETAILS", label: "Детали" },
  { type: "DRESSCODE", label: "Дресскод" },
  { type: "FORM", label: "Форма" },
  { type: "CALENDAR", label: "Календарь" },
  { type: "FRAME", label: "Фото рамка" },
];

const createDefaultContent = (contentType: ContentTypes) => {
  switch (contentType) {
    case "PLACE":
      return {
        title: "Локация",
        type: "MAP" as const,
        places: [],
      };
    case "TIMINGS":
      return {
        title: "План дня",
        type: "TIME_LINE" as const,
        plan: [],
      };
    case "DETAILS":
      return {
        title: "Детали",
        align: "left" as const,
        details: [],
      };
    case "DRESSCODE":
      return {
        title: "Дресскод",
        colorSchema: [],
      };
    case "FORM":
      return [];
    case "CALENDAR":
      return {};
    case "FRAME":
      return {
        images: [],
        frameBorderColor: "#000000",
        frameIntervalMs: 3000,
      };
    default:
      return {};
  }
};

export const AdminPanel = () => {
  const [blocks, setBlocks] = useState<BlockWithId[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Если перетаскиваем из палитры на холст (canvas)
    if (activeId.startsWith("palette-") && overId === "canvas") {
      const contentType = activeId.replace("palette-", "") as ContentTypes;
      const newBlock: BlockWithId = {
        contentType,
        content: createDefaultContent(contentType),
        id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };
      setBlocks((prev) => [...prev, newBlock]);
    }
    // Если перетаскиваем из палитры на конкретный блок холста (вставка перед блоком)
    else if (activeId.startsWith("palette-") && overId.startsWith("block-")) {
      const contentType = activeId.replace("palette-", "") as ContentTypes;
      const newBlock: BlockWithId = {
        contentType,
        content: createDefaultContent(contentType),
        id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };
      const overIndex = blocks.findIndex((b) => b.id === overId);
      if (overIndex !== -1) {
        setBlocks((prev) => {
          const newBlocks = [...prev];
          newBlocks.splice(overIndex, 0, newBlock);
          return newBlocks;
        });
      }
    }
    // Если перетаскиваем внутри холста (сортировка)
    else if (activeId.startsWith("block-") && overId.startsWith("block-")) {
      const oldIndex = blocks.findIndex((b) => b.id === activeId);
      const newIndex = blocks.findIndex((b) => b.id === overId);

      if (oldIndex !== -1 && newIndex !== -1) {
        setBlocks((prev) => arrayMove(prev, oldIndex, newIndex));
      }
    }

    setActiveId(null);
  };

  const handleRemoveBlock = (blockId: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== blockId));
  };

  const handleSave = () => {
    const layoutData = blocks.map((block) => ({
      id: block.id,
      type: block.contentType,
      props: block.content,
    }));
    console.log(JSON.stringify(layoutData, null, 2));
  };

  const activePaletteBlock = activeId?.startsWith("palette-")
    ? BLOCK_TYPES.find((bt) => `palette-${bt.type}` === activeId)
    : null;
  const activeCanvasBlock = activeId?.startsWith("block-") ? blocks.find((b) => b.id === activeId) : null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Админ-панель</h1>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            Сохранить
          </Button>
        </div>

        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <BlockPalette blockTypes={BLOCK_TYPES} />
            </div>

            <div className="lg:col-span-3">
              <Canvas blocks={blocks} onRemoveBlock={handleRemoveBlock} />
            </div>
          </div>

          <DragOverlay>
            {activePaletteBlock ? (
              <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-blue-500">
                <div className="text-sm font-medium">{activePaletteBlock.label}</div>
              </div>
            ) : activeCanvasBlock ? (
              <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-blue-500">
                <div className="text-sm font-medium">{activeCanvasBlock.contentType}</div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

