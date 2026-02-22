import { IConfigApp, ILayout, ISectionDecorations, IShared } from "@/types/blocks/config";
import { Wrapper } from "@/components/ui/Wrapper";
import { IPlace } from "@/types/blocks/place";
import { Place } from "@/components/Place";
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
import { IFrame } from "@/types/blocks/frame";
import { PhotoFrame } from "@/components/shared/PhotoFrame";

type InviteBuilderProps = {
  config: IConfigApp;
};

const renderCalendar = (shared: IShared) => {
  return <Calendar targetDate={shared.date} />;
};

const renderPlace = (content: IPlace, decorations?: ILayout["decorations"]) => {
  return <Place content={content} decorations={decorations} />;
};

const renderTimings = (content: IEvent, decorations?: ILayout["decorations"]) => {
  return <EventPlan content={content} decorations={decorations} />;
};

const renderDetails = (content: IDetails, decorations?: ILayout["decorations"]) => {
  return <Details content={content as IDetails} decorations={decorations} />;
};

const renderDresscode = (content: IDressCode, decorations?: ILayout["decorations"]) => {
  return <DressCode dresscode={content} decorations={decorations} />;
};

const renderForm = (content: FormStructure[], decorations?: ILayout["decorations"]) => {
  return <Form formData={content} decorations={decorations} />;
};

const renderFrame = (content: IFrame) => {
  return <PhotoFrame content={content} />;
};

const renderContent = (layout: ILayout, shared: IShared, decorations?: ILayout["decorations"]) => {
  const { content, contentType } = layout;

  switch (contentType) {
    case "DETAILS":
      return renderDetails(content as IDetails, decorations);
    case "DRESSCODE":
      return renderDresscode(content as IDressCode, decorations);
    case "FORM":
      return renderForm(content as FormStructure[], decorations);
    case "CALENDAR":
      return renderCalendar(shared);
    case "PLACE":
      return renderPlace(content as IPlace, decorations);
    case "TIMINGS":
      return renderTimings(content as IEvent, decorations);
    case "FRAME":
      return renderFrame(content as IFrame);
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
          <Fragment key={index}>{renderContent(layout, config.shared, layout?.decorations)}</Fragment>
        ))}
      </main>
      <Footer date={config.shared.date} footerSettings={config?.footer} />
    </Wrapper>
  );
};
