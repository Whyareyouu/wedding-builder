import fsPromises from "fs/promises";
import path from "path";

const DATA_FILE_PATH = path.join(process.cwd(), "configs", "app-config_with_versions.json");

interface Template {
  id: string;
  [key: string]: unknown;
}

export async function GET(req: Request, { params }: { params: { id: string } }): Promise<Response> {
  try {
    const { id } = params;

    const rawData = await fsPromises.readFile(DATA_FILE_PATH);
    const objectData: Template[] = JSON.parse(rawData.toString());

    const found = objectData.find((item) => item.id === id);

    if (!found) {
      return Response.json({ success: false, message: `Шаблон с id "${id}" не найден` }, { status: 404 });
    }

    return Response.json({ success: true, data: found }, { status: 200 });
  } catch (error) {
    console.error(`GET /api/templates/${params?.id ?? "unknown"} error:`, error);
    return Response.json({ success: false, message: "Не удалось загрузить шаблон" }, { status: 500 });
  }
}
