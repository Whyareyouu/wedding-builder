"use client";

import { useDraggable } from "@dnd-kit/core";
import { Card } from "@/components/ui/card";

type BlockPaletteProps = {
  blockTypes: { type: string; label: string }[];
};

const DraggableBlock = ({ type, label }: { type: string; label: string }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${type}`,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <Card
        className={`p-4 cursor-grab active:cursor-grabbing hover:bg-gray-50 transition-colors ${
          isDragging ? "opacity-50" : ""
        }`}
      >
        <div className="text-sm font-medium text-gray-700">{label}</div>
        <div className="text-xs text-gray-500 mt-1">{type}</div>
      </Card>
    </div>
  );
};

export const BlockPalette = ({ blockTypes }: BlockPaletteProps) => {
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Палитра блоков</h2>
      <div className="space-y-2">
        {blockTypes.map((blockType) => (
          <DraggableBlock key={blockType.type} type={blockType.type} label={blockType.label} />
        ))}
      </div>
    </div>
  );
};

