import { IConfigApp, ILayout, IShared } from "@/types/blocks/config";
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
import { Footer } from "@/components/shared/Footer";
import { Fragment } from "react";
import { Calendar } from "@/components/shared/Calendar";
import { IFrame } from "@/types/blocks/frame";
import { PhotoFrame } from "@/components/shared/PhotoFrame";
import { Header } from "@/components/Header";

type InviteBuilderProps = {
  config: IConfigApp;
  guestName?: string;
};

const renderCalendar = (
  shared: IShared,
  decorations?: ILayout["decorations"],
  laptopDecorations?: ILayout["laptopDecorations"],
  mobileDecorations?: ILayout["mobileDecorations"],
) => {
  return <Calendar targetDate={shared.date} decorations={decorations} laptopDecorations={laptopDecorations} mobileDecorations={mobileDecorations} />;
};

const renderPlace = (
  content: IPlace,
  decorations?: ILayout["decorations"],
  laptopDecorations?: ILayout["laptopDecorations"],
  mobileDecorations?: ILayout["mobileDecorations"],
) => {
  return <Place content={content} decorations={decorations} laptopDecorations={laptopDecorations} mobileDecorations={mobileDecorations} />;
};

const renderTimings = (
  content: IEvent,
  decorations?: ILayout["decorations"],
  laptopDecorations?: ILayout["laptopDecorations"],
  mobileDecorations?: ILayout["mobileDecorations"],
) => {
  return <EventPlan content={content} decorations={decorations} laptopDecorations={laptopDecorations} mobileDecorations={mobileDecorations} />;
};

const renderDetails = (
  content: IDetails,
  decorations?: ILayout["decorations"],
  laptopDecorations?: ILayout["laptopDecorations"],
  mobileDecorations?: ILayout["mobileDecorations"],
) => {
  return <Details content={content as IDetails} decorations={decorations} laptopDecorations={laptopDecorations} mobileDecorations={mobileDecorations} />;
};

const renderDresscode = (
  content: IDressCode,
  decorations?: ILayout["decorations"],
  laptopDecorations?: ILayout["laptopDecorations"],
  mobileDecorations?: ILayout["mobileDecorations"],
) => {
  return <DressCode dresscode={content} decorations={decorations} laptopDecorations={laptopDecorations} mobileDecorations={mobileDecorations} />;
};

const renderForm = (
  content: FormStructure[],
  decorations?: ILayout["decorations"],
  laptopDecorations?: ILayout["laptopDecorations"],
  mobileDecorations?: ILayout["mobileDecorations"],
) => {
  return <Form formData={content} decorations={decorations} laptopDecorations={laptopDecorations} mobileDecorations={mobileDecorations} />;
};

const renderFrame = (content: IFrame) => {
  return <PhotoFrame content={content} />;
};

const renderContent = (
  layout: ILayout,
  shared: IShared,
  decorations?: ILayout["decorations"],
  laptopDecorations?: ILayout["laptopDecorations"],
  mobileDecorations?: ILayout["mobileDecorations"],
) => {
  const { content, contentType } = layout;

  switch (contentType) {
    case "DETAILS":
      return renderDetails(content as IDetails, decorations, laptopDecorations, mobileDecorations);
    case "DRESSCODE":
      return renderDresscode(content as IDressCode, decorations, laptopDecorations, mobileDecorations);
    case "FORM":
      return renderForm(content as FormStructure[], decorations, laptopDecorations, mobileDecorations);
    case "CALENDAR":
      return renderCalendar(shared, decorations, laptopDecorations, mobileDecorations);
    case "PLACE":
      return renderPlace(content as IPlace, decorations, laptopDecorations, mobileDecorations);
    case "TIMINGS":
      return renderTimings(content as IEvent, decorations, laptopDecorations, mobileDecorations);
    case "FRAME":
      return renderFrame(content as IFrame);
    default:
      return null;
  }
};

export const InviteBuilder = ({ config, guestName }: InviteBuilderProps) => {
  return (
    <Wrapper backgroundImage={config.shared?.backgroundImage}>
      {config?.header && (
        <Header
          wifeName={config.shared.wifeName}
          husbandName={config.shared.husbandName}
          date={config.shared.textDate}
          pattern={config?.header?.pattern}
          decorations={config?.header?.decorations}
        />
      )}
      <main>
        {config.layout.map((layout, index) => (
          <Fragment key={index}>
            {renderContent(layout, config.shared, layout?.decorations, layout?.laptopDecorations, layout?.mobileDecorations)}
          </Fragment>
        ))}
      </main>
      <Footer date={config.shared.date} footerSettings={config?.footer} guestName={guestName} />
    </Wrapper>
  );
};
