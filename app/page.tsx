import { InviteBuilder } from "@/components/shared/InviteBuilder";
import { IConfigApp } from "@/types/blocks/config";
import { getActiveTemplate } from "@/lib/templates";

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
