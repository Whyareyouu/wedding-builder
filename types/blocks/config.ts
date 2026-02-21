import { IDressCode } from "@/types/blocks/dresscode";
import { IEvent } from "@/types/blocks/event";
import { FormStructure } from "@/types/blocks/form";
import { IPlace } from "@/types/blocks/place";
import { IDetails } from "@/types/blocks/details";
import { IFooter } from "@/types/blocks/footer";
import { IFrame } from "@/types/blocks/frame";

export type ICalendar = object;

export type ContentTypes = "FRIENDS" | "PLACE" | "TIMINGS" | "DETAILS" | "DRESSCODE" | "FORM" | "CALENDAR" | "FRAME";

export type LayoutContent = IDressCode | IEvent | FormStructure[] | IPlace | IDetails | IFrame | ICalendar;

export interface ILayout {
  contentType: ContentTypes;
  content: LayoutContent;
}

export interface IImage {
  path: string;
  width: number;
  height: number;
}

export interface IShared {
  date: string;
  wifeName: string;
  husbandName: string;
  textDate: string;
  backgroundImage?: string;
}

export interface IConfigApp {
  layout: ILayout[];
  shared: IShared;
  footer: IFooter;
}
