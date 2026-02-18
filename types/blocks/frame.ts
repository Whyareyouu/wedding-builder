import { IImage } from "@/types/blocks/config";

export interface IFrame {
  images: IImage[];
  frameBorderColor: string;
  frameIntervalMs: number;
}
