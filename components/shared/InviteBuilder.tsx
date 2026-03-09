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
};

const renderCalendar = (
  shared: IShared,
  decorations?: ILayout["decorations"],
  mobileDecorations?: ILayout["decorations"],
) => {
  return <Calendar targetDate={shared.date} decorations={decorations} mobileDecorations={mobileDecorations} />;
};

const renderPlace = (
  content: IPlace,
  decorations?: ILayout["decorations"],
  mobileDecorations?: ILayout["decorations"],
) => {
  return <Place content={content} decorations={decorations} mobileDecorations={mobileDecorations} />;
};

const renderTimings = (
  content: IEvent,
  decorations?: ILayout["decorations"],
  mobileDecorations?: ILayout["decorations"],
) => {
  return <EventPlan content={content} decorations={decorations} mobileDecorations={mobileDecorations} />;
};

const renderDetails = (
  content: IDetails,
  decorations?: ILayout["decorations"],
  mobileDecorations?: ILayout["decorations"],
) => {
  return <Details content={content as IDetails} decorations={decorations} mobileDecorations={mobileDecorations} />;
};

const renderDresscode = (
  content: IDressCode,
  decorations?: ILayout["decorations"],
  mobileDecorations?: ILayout["decorations"],
) => {
  return <DressCode dresscode={content} decorations={decorations} mobileDecorations={mobileDecorations} />;
};

const renderForm = (
  content: FormStructure[],
  decorations?: ILayout["decorations"],
  mobileDecorations?: ILayout["decorations"],
) => {
  return <Form formData={content} decorations={decorations} mobileDecorations={mobileDecorations} />;
};

const renderFrame = (content: IFrame) => {
  return <PhotoFrame content={content} />;
};

const renderContent = (
  layout: ILayout,
  shared: IShared,
  decorations?: ILayout["decorations"],
  mobileDecorations?: ILayout["decorations"],
) => {
  const { content, contentType } = layout;

  switch (contentType) {
    case "DETAILS":
      return renderDetails(content as IDetails, decorations, mobileDecorations);
    case "DRESSCODE":
      return renderDresscode(content as IDressCode, decorations, mobileDecorations);
    case "FORM":
      return renderForm(content as FormStructure[], decorations, mobileDecorations);
    case "CALENDAR":
      return renderCalendar(shared, decorations, mobileDecorations);
    case "PLACE":
      return renderPlace(content as IPlace, decorations, mobileDecorations);
    case "TIMINGS":
      return renderTimings(content as IEvent, decorations, mobileDecorations);
    case "FRAME":
      return renderFrame(content as IFrame);
    default:
      return null;
  }
};

export const InviteBuilder = ({ config }: InviteBuilderProps) => {
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
            {renderContent(layout, config.shared, layout?.decorations, layout?.mobileDecorations)}
          </Fragment>
        ))}
      </main>
      <Footer date={config.shared.date} footerSettings={config?.footer} />
    </Wrapper>
  );
};
