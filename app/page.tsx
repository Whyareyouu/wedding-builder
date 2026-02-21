import { InviteBuilder } from "@/components/shared/InviteBuilder";

import { IConfigApp } from "@/types/blocks/config";
import { api, ApiResponse } from "@/lib/api";

async function getActiveTemplate() {
  try {
    const response = await api.get<ApiResponse<{ content: IConfigApp }>>("/layouts?active=true");

    if (!response.success) {
      console.warn(response.message || "Неуспешный ответ от сервера");
      return null;
    }

    if (!response.data) {
      console.warn("Поле data отсутствует в успешном ответе");
      return null;
    }

    return response.data;
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error(String(err));

    if (error.message.includes("404")) {
      console.warn("Активный шаблон не найден (404)");
    } else {
      console.error("Ошибка при получении активного шаблона:", error);
    }

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
