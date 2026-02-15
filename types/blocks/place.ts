interface IMapSettings {
  coordinates: number[];
  zoom?: number;
  hint?: string;
  markerIcon?: string;
  yandexMapUrl?: string;
}

export interface IPlace {
  title: string;
  address: string;
  startTime: string;
  dividerIcon?: string;
  mapSettings: IMapSettings;
}
