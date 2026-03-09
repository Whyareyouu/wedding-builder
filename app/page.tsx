import { InviteBuilder } from "@/components/shared/InviteBuilder";
import { IConfigApp } from "@/types/blocks/config";
import fsPromises from "fs/promises";
import path from "path";

const DATA_FILE_PATH = path.join(process.cwd(), "configs", "app-config_with_versions.json");

interface Template {
  id: string;
  isActive?: boolean;
  content: IConfigApp;
  [key: string]: unknown;
}

async function getActiveTemplate() {
  try {
    const rawData = await fsPromises.readFile(DATA_FILE_PATH);
    const templates: Template[] = JSON.parse(rawData.toString());
    const activeTemplate = templates.find((t) => t.isActive === true);

    if (!activeTemplate) {
      console.warn("Активный шаблон не найден");
      return null;
    }

    return activeTemplate;
  } catch (err: unknown) {
    console.error("Ошибка при получении активного шаблона:", err);
    return null;
  }
}

export default async function Home() {
  const activeTemplate = await getActiveTemplate();

  if (!activeTemplate) {
    return (
      <div className="p-8 text-center text-gray-500">
        Активный шаблон не установлен. Пожалуйста, выберите шаблон в админке.
      </div>
    );
  }

  return <InviteBuilder config={activeTemplate.content as IConfigApp} />;
}
