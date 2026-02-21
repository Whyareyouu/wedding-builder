import { IFrame } from "@/types/blocks/frame";

type PlaceTypes = "MAP" | "FRAME";

interface BasePlaceSettings {
  title: string;
  address: string;
  startTime: string;
  dividerIcon?: string;
}

interface IMapSettings {
  coordinates: number[];
  zoom?: number;
  hint?: string;
  markerIcon?: string;
  yandexMapUrl?: string;
}

export interface IMapPlace extends BasePlaceSettings {
  mapSettings: IMapSettings;
}

export interface IFramePlace extends BasePlaceSettings {
  frameSettings: IFrame;
  mapSettings: Pick<IMapSettings, "yandexMapUrl">;
}

export type IPlaceSettings = IMapPlace | IFramePlace;

export interface IPlace {
  title?: string;
  type: PlaceTypes;
  places: IPlaceSettings[];
}
