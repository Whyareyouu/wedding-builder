type CardType = "CARD" | "ROAD" | "TIME_LINE";

interface IIcon {
  path: string;
  width: number;
  height: number;
}

export interface IPlan {
  event: string;
  description?: string;
  startTime: string;
  icon?: IIcon;
  image?: IIcon;
}

export interface IEvent {
  title: string;
  type?: CardType;
  plan: IPlan[];
}
