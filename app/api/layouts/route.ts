import fsPromises from "fs/promises";
import path from "path";
import { checkAdminAccess } from "@/lib/auth";

const DATA_FILE_PATH = path.join(process.cwd(), "configs", "app-config_with_versions.json");

interface Template {
  id: string;
  [key: string]: unknown;
}

export async function POST(req: Request): Promise<Response> {
  const accessDenied = checkAdminAccess();
  if (accessDenied) return accessDenied;

  try {
    const rawData = await fsPromises.readFile(DATA_FILE_PATH);
    let objectData: Template[] = JSON.parse(rawData.toString());

    const body: Template = await req.json();

    if (!body.id) {
      return Response.json({ success: false, message: "Поле id обязательно" }, { status: 400 });
    }

    const index = objectData.findIndex((item) => item.id === body.id);

    if (index !== -1) {
      objectData[index] = body;
    } else {
      objectData.push(body);
    }

    if (body?.isActive) {
      objectData = objectData.map((x) => (x.id === body.id ? x : { ...x, isActive: false }));
    }

    const updatedJson = JSON.stringify(objectData, null, 2);
    await fsPromises.writeFile(DATA_FILE_PATH, updatedJson);

    return Response.json({ success: true, message: "Шаблон успешно сохранён" }, { status: 200 });
  } catch (error) {
    console.error("POST /templates error:", error);
    return Response.json({ success: false, message: "Не удалось сохранить шаблон" }, { status: 500 });
  }
}

export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const wantActiveOnly = searchParams.get("active") === "true";

    // Получение активного шаблона доступно всем
    if (!wantActiveOnly) {
      const accessDenied = checkAdminAccess();
      if (accessDenied) return accessDenied;
    }

    const rawData = await fsPromises.readFile(DATA_FILE_PATH);
    const templates: Template[] = JSON.parse(rawData.toString());

    if (wantActiveOnly) {
      const activeTemplate = templates.find((t) => t.isActive === true);

      if (!activeTemplate) {
        return Response.json({ success: false, message: "Активный шаблон не найден" }, { status: 404 });
      }

      return Response.json({ success: true, data: activeTemplate }, { status: 200 });
    }

    return Response.json({ success: true, data: templates }, { status: 200 });
  } catch (error) {
    console.error("GET /api/layouts error:", error);
    return Response.json({ success: false, message: "Не удалось загрузить шаблоны" }, { status: 500 });
  }
}
