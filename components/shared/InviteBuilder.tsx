import { IConfigApp, ILayout, IShared } from "@/types/blocks/config";
import { Wrapper } from "@/components/ui/Wrapper";
import { IPlace } from "@/types/blocks/place";
import { Place } from "@/components/shared/Place";
import { IEvent } from "@/types/blocks/event";
import { EventPlan } from "@/components/EventPlan";
import { Details } from "@/components/shared/Details";
import { IDetails } from "@/types/blocks/details";
import { IDressCode } from "@/types/blocks/dresscode";
import { DressCode } from "@/components/shared/DressCode";
import { FormStructure } from "@/types/blocks/form";
import { Form } from "./Form";

import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { Fragment } from "react";
import { Calendar } from "@/components/shared/Calendar";

type InviteBuilderProps = {
  config: IConfigApp;
};

const renderCalendar = (shared: IShared) => {
  return <Calendar targetDate={shared.date} />;
};

const renderPlace = (content: IPlace[]) => {
  return <Place places={content} />;
};

const renderTimings = (content: IEvent) => {
  return <EventPlan content={content} />;
};

const renderDetails = (content: IDetails) => {
  return <Details details={content as IDetails} />;
};

const renderDresscode = (content: IDressCode) => {
  return <DressCode dresscode={content} />;
};

const renderForm = (content: FormStructure[]) => {
  return <Form formData={content} />;
};

const renderContent = (layout: ILayout, shared: IShared) => {
  const { content, contentType } = layout;

  switch (contentType) {
    case "DETAILS":
      return renderDetails(content as IDetails);
    case "DRESSCODE":
      return renderDresscode(content as IDressCode);
    case "FORM":
      return renderForm(content as FormStructure[]);
    case "CALENDAR":
      return renderCalendar(shared);
    case "PLACE":
      return renderPlace(content as IPlace[]);
    case "TIMINGS":
      return renderTimings(content as IEvent);
    default:
      return null;
  }
};

export const InviteBuilder = ({ config }: InviteBuilderProps) => {
  return (
    <Wrapper backgroundImage={config.shared?.backgroundImage}>
      <Header wifeName={config.shared.wifeName} husbandName={config.shared.husbandName} date={config.shared.textDate} />
      <main>
        {config.layout.map((layout, index) => (
          <Fragment key={index}>{renderContent(layout, config.shared)}</Fragment>
        ))}
      </main>
      <Footer date={config.shared.date} footerSettings={config?.footer} />
    </Wrapper>
  );
};
