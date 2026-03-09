import fsPromises from "fs/promises";
import path from "path";
import { IConfigApp } from "@/types/blocks/config";

const DATA_FILE_PATH = path.join(process.cwd(), "configs", "app-config_with_versions.json");

interface Template {
  id: string;
  isActive?: boolean;
  content: IConfigApp;
  [key: string]: unknown;
}

export async function getActiveTemplate(): Promise<Template | null> {
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
