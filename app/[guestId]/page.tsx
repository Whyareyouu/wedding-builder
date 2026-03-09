import { InviteBuilder } from "@/components/shared/InviteBuilder";
import { IConfigApp } from "@/types/blocks/config";
import { getActiveTemplate } from "@/lib/templates";
import guestsData from "@/configs/guests.json";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return guestsData.guests.map((guest) => ({
    guestId: String(guest.id),
  }));
}

type Props = {
  params: Promise<{ guestId: string }>;
};

export default async function GuestPage({ params }: Props) {
  const { guestId } = await params;

  const guest = guestsData.guests.find((g) => String(g.id) === guestId);
  if (!guest) notFound();

  const activeTemplate = await getActiveTemplate();

  if (!activeTemplate) {
    return (
      <div className="p-8 text-center text-gray-500">
        Активный шаблон не установлен. Пожалуйста, выберите шаблон в админке.
      </div>
    );
  }

  return <InviteBuilder config={activeTemplate.content as IConfigApp} guestName={guest.name} />;
}
