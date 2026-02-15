import { IDressCode } from "@/types/blocks/dresscode";
import { IEvent } from "@/types/blocks/event";
import { FormStructure } from "@/types/blocks/form";
import { IPlace } from "@/types/blocks/place";
import { IDetails } from "@/types/blocks/details";

type ContentTypes = "FRIENDS" | "PLACE" | "TIMINGS" | "DETAILS" | "DRESSCODE" | "FORM" | "CALENDAR";

export interface ILayout {
  contentType: ContentTypes;
  content: IDressCode | IEvent | FormStructure[] | IPlace[] | IDetails;
}

export interface IShared {
  date: string;
  wifeName: string;
  husbandName: string;
  textDate: string;
}

export interface IConfigApp {
  layout: ILayout[];
  shared: IShared;
}
