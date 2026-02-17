type CardType = "CARD" | "ROAD";

interface IIcon {
  path: string;
  width: number;
  height: number;
}

interface IPlan {
  event: string;
  description?: string;
  startTime: string;
  icon: IIcon;
}

export interface IEvent {
  title: string;
  type?: CardType;
  plan: IPlan[];
}
