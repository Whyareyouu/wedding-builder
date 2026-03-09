"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { ILayout, ContentTypes, LayoutContent, IShared, IConfigApp } from "@/types/blocks/config";
import { BlockPalette } from "./BlockPalette";
import { Canvas } from "./Canvas";
import { BlockEditor } from "./BlockEditor";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { FormStructure } from "@/types/blocks/form";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SaveModal } from "@/components/AdminPanel/ui/SaveModal";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormProvider, useForm } from "react-hook-form";
import { SharedContent } from "@/components/AdminPanel/ui/SharedContent";
import { FooterContent } from "@/components/AdminPanel/ui/FooterContent";
import { IFooter } from "@/types/blocks/footer";

type PlacedBlock = {
  id: string;
  type: ContentTypes;
  props: LayoutContent;
};

type BlockWithId = Omit<ILayout, "content"> & {
  id: string;
  content: LayoutContent;
  props?: LayoutContent;
};
type Template = {
  id: string;
  title: string;
  isActive: boolean;
  content: IConfigApp;
};

const NEW_LAYOUT_ID = "new_layout";

const BLOCK_TYPES: { type: ContentTypes; label: string }[] = [
  { type: "PLACE", label: "Место" },
  { type: "TIMINGS", label: "План дня" },
  { type: "DETAILS", label: "Детали" },
  { type: "DRESSCODE", label: "Дресскод" },
  { type: "FORM", label: "Форма" },
  { type: "CALENDAR", label: "Календарь" },
  { type: "FRAME", label: "Фото рамка" },
];

const DEFAULT_SHARED: IShared = {
  date: "",
  wifeName: "",
  husbandName: "",
  textDate: "",
  backgroundImage: "",
};

const DEFAULT_FOOTER: IFooter = {
  baseText: "До встречи",
  pairSeparator: " & ",
  disableGenderEnding: false,
  genderConfig: {
    maleEnding: "ой",
    femaleEnding: "ая",
    pluralText: "дорогие",
    singleBase: "дорог",
  },
};

const createDefaultContent = (contentType: ContentTypes): LayoutContent => {
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
      return [] as FormStructure[];
    case "CALENDAR":
      return {};
    case "FRAME":
      return {
        images: [{ path: "/system/placeholder.jpg", width: 400, height: 300 }],
        frameBorderColor: "#000000",
        frameIntervalMs: 3000,
      };
    default:
      return [];
  }
};

const createDefaultProps = (contentType: ContentTypes): LayoutContent => {
  return createDefaultContent(contentType);
};

export const AdminPanel = () => {
  const [blocks, setBlocks] = useState<BlockWithId[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<PlacedBlock | null>(null);

  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(NEW_LAYOUT_ID);
  const [isOpenSaveModal, setIsOpenSaveModal] = useState(false);

  const sharedForm = useForm<IShared>({ defaultValues: DEFAULT_SHARED });
  const footerForm = useForm<IFooter>({ defaultValues: DEFAULT_FOOTER });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch("/api/layouts");
        if (!res.ok) throw new Error("Не удалось загрузить шаблоны");
        const data = await res.json();

        const loadedTemplates = data.data ?? data ?? [];
        setTemplates(loadedTemplates);

        if (loadedTemplates.length > 0) {
          setSelectedTemplateId(loadedTemplates[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchTemplates();
  }, []);

  useEffect(() => {
    if (!selectedTemplateId || selectedTemplateId === NEW_LAYOUT_ID) {
      setBlocks([]);
      sharedForm.reset(DEFAULT_SHARED);
      footerForm.reset(DEFAULT_FOOTER);
      return;
    }

    const template = templates.find((t) => t.id === selectedTemplateId);
    if (!template) return;

    const { layout = [], shared, footer } = template.content;

    const restoredBlocks: BlockWithId[] = layout.map((item) => ({
      contentType: item.contentType,
      content: item.content,
      props: item.content,
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }));
    setBlocks(restoredBlocks);

    sharedForm.reset(shared ?? DEFAULT_SHARED);

    footerForm.reset(footer ?? DEFAULT_FOOTER);
  }, [selectedTemplateId, templates]);

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
      const defaultContent = createDefaultContent(contentType);
      const newBlock: BlockWithId = {
        contentType,
        content: defaultContent,
        id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        props: createDefaultProps(contentType),
      };
      setBlocks((prev) => [...prev, newBlock]);
    }
    // Если перетаскиваем из палитры на конкретный блок холста (вставка перед блоком)
    else if (activeId.startsWith("palette-") && overId.startsWith("block-")) {
      const contentType = activeId.replace("palette-", "") as ContentTypes;
      const defaultContent = createDefaultContent(contentType);
      const newBlock: BlockWithId = {
        contentType,
        content: defaultContent,
        id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        props: createDefaultProps(contentType),
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
    if (editingBlock?.id === blockId) {
      setDrawerOpen(false);
      setEditingBlock(null);
    }
  };

  const handleBlockEdit = (blockId: string) => {
    const block = blocks.find((b) => b.id === blockId);
    if (block) {
      setEditingBlock({
        id: block.id,
        type: block.contentType,
        props: block.props ?? block.content,
      });
      setDrawerOpen(true);
    }
  };

  const handleBlockSave = (blockId: string, props: LayoutContent) => {
    setBlocks((prev) =>
      prev.map((block) => {
        if (block.id === blockId) {
          const updatedBlock: BlockWithId = {
            ...block,
            props,
            content: props,
          };
          if (editingBlock?.id === blockId) {
            setEditingBlock({
              id: updatedBlock.id,
              type: updatedBlock.contentType,
              props: updatedBlock.props ?? updatedBlock.content,
            });
          }
          return updatedBlock;
        }
        return block;
      }),
    );
  };

  const handleSave = async (data: Omit<Template, "content">) => {
    console.log({ data, blocks });

    const layout = blocks.map((block) => ({
      contentType: block.contentType,
      content: block.props ?? block.content,
    }));

    const payload = {
      ...data,
      content: { layout, shared: sharedForm.getValues(), footer: footerForm.getValues() },
    };
    try {
      const res = await fetch("/api/layouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      toast.success("Сохранено");

      setTemplates((prev) =>
        prev.map((t) =>
          t.id === selectedTemplateId
            ? {
                ...t,
                content: {
                  layout: blocks.map((b) => ({
                    contentType: b.contentType,
                    content: b.props ?? b.content,
                  })),
                  shared: sharedForm.getValues(),
                  footer: footerForm.getValues(),
                  header: {},
                },
              }
            : t,
        ),
      );
    } catch (err) {
      console.error(err);
      toast.error("Ошибка сохранения");
    }
    setIsOpenSaveModal(false);
    console.log(JSON.stringify(layout, null, 2));
  };

  const activePaletteBlock = activeId?.startsWith("palette-")
    ? BLOCK_TYPES.find((bt) => `palette-${bt.type}` === activeId)
    : null;
  const activeCanvasBlock = activeId?.startsWith("block-") ? blocks.find((b) => b.id === activeId) : null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-start">
          <div className="flex flex-col gap-4 max-w-[30%] w-full">
            <h1 className="text-3xl font-bold text-gray-900 w-full">Админ-панель</h1>
            <Field>
              <FieldLabel>Активный шаблон</FieldLabel>
              <FieldContent>
                <Select
                  value={selectedTemplateId}
                  onValueChange={(value) => setSelectedTemplateId(value)}
                  defaultValue={NEW_LAYOUT_ID}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите шаблон..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.title}
                        </SelectItem>
                      ))}
                      <SelectItem value={NEW_LAYOUT_ID}>Новый шаблон</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>
          </div>
          <Button onClick={() => setIsOpenSaveModal(true)} className="bg-blue-600 hover:bg-blue-700">
            Сохранить
          </Button>
        </div>

        <Tabs defaultValue="canvas" className="mb-6">
          <TabsList>
            <TabsTrigger value="canvas">Блоки</TabsTrigger>
            <TabsTrigger value="shared">Общие данные</TabsTrigger>
            <TabsTrigger value="footer">Футер</TabsTrigger>
          </TabsList>

          <TabsContent value="canvas">
            <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                  <BlockPalette blockTypes={BLOCK_TYPES} />
                </div>

                <div className="lg:col-span-3">
                  <Canvas blocks={blocks} onRemoveBlock={handleRemoveBlock} onBlockEdit={handleBlockEdit} />
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
          </TabsContent>

          <TabsContent value="shared">
            <div className="bg-white rounded-lg p-6 border">
              <h2 className="text-lg font-semibold mb-4">Общие настройки</h2>
              <FormProvider {...sharedForm}>
                <SharedContent />
              </FormProvider>
            </div>
          </TabsContent>

          <TabsContent value="footer">
            <div className="bg-white rounded-lg p-6 border">
              <h2 className="text-lg font-semibold mb-4">Настройки футера</h2>
              <FormProvider {...footerForm}>
                <FooterContent />
              </FormProvider>
            </div>
          </TabsContent>
        </Tabs>

        <Drawer
          direction="right"
          open={drawerOpen}
          onOpenChange={(open) => {
            setDrawerOpen(open);
            if (!open) {
              setEditingBlock(null);
            }
          }}
        >
          <DrawerContent className="left-auto right-0 top-0 bottom-0 mt-0 max-w-[400px] w-full rounded-none flex flex-col overflow-x-hidden">
            {editingBlock && (
              <BlockEditor
                key={editingBlock.id}
                block={editingBlock}
                onSave={handleBlockSave}
                onClose={() => setDrawerOpen(false)}
              />
            )}
          </DrawerContent>
        </Drawer>
      </div>
      {isOpenSaveModal && (
        <SaveModal
          isOpen={isOpenSaveModal}
          onClose={() => setIsOpenSaveModal(false)}
          handleSaveForm={handleSave}
          defaultValues={(templates?.find((x) => x?.id === selectedTemplateId) as Omit<Template, "content">) ?? {}}
        />
      )}
    </div>
  );
};
