import { IFrame } from "@/types/blocks/frame";

type PlaceTypes = "MAP" | "FRAME";

interface IMapSettings {
  coordinates: number[];
  zoom?: number;
  hint?: string;
  markerIcon?: string;
  yandexMapUrl?: string;
}

export interface IPlaceSettings {
  title: string;
  address: string;
  startTime: string;
  dividerIcon?: string;
  frameSettings: IFrame;
  mapSettings: IMapSettings;
}

export interface IPlace {
  places: IPlaceSettings[];
  type: PlaceTypes;
  title?: string;
}
