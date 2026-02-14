import { DressCode } from "@/components/shared/DressCode";
import appConfig from "../configs/app-config.json";
import { Footer } from "@/components/shared/Footer";
import { Wrapper } from "@/components/ui/Wrapper";
import { Header } from "@/components/shared/Header";
import { Friends } from "@/components/shared/Friends";
import { Place } from "@/components/shared/Place";
import { EventPlan } from "@/components/shared/EventPlan";
import { Form } from "@/components/shared/Form";
import { Details } from "@/components/shared/Details";

export default function Home() {
  return (
    <Wrapper>
      <Header
        wifeName={appConfig.shared.wifeName}
        husbandName={appConfig.shared.husbandName}
        date={appConfig.shared.textDate}
      />
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
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/*@ts-ignore*/}
        <Form formData={appConfig.form} />
        <Details details={appConfig.details} />
      </main>
      <Footer date={appConfig.shared.date} />
    </Wrapper>
  );
}
