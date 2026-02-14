import { DressCode } from "@/components/shared/DressCode";
import appConfig from "../configs/app-config.json";
import { Footer } from "@/components/shared/Footer";
import { Wrapper } from "@/components/ui/Wrapper";
import { Header } from "@/components/shared/Header";
import { Friends } from "@/components/shared/Friends";
import { Place } from "@/components/shared/Place";
import { EventPlan } from "@/components/shared/EventPlan";
import { Form } from "@/components/shared/Form";

export default function Home() {
  return (
    <Wrapper>
      <Header wifeName="Полина" husbandName="Никита" date="20 июля 2026 года" />
      <main>
        <Friends
          kindWordsForGuests={[
            "Спасибо, что будете с нами в этот особенный день. Нам очень приятно, что вы с нами!",
            "Без ваших улыбок не обойдётся!",
          ]}
          date="20.06.2026"
        />
        <DressCode dresscode={appConfig.dresscode} />
        <Place places={appConfig.places} />
        <EventPlan eventPlan={appConfig.timings} />
        <Form formData={appConfig.form} />
        <Footer />
      </main>
    </Wrapper>
  );
}
