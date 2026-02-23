import { ISectionDecorations } from "@/types/blocks/config";

export type HeaderPattern = "initials" | "fullnames" | "minimal" | "stacked";

export interface IHeader {
  pattern?: HeaderPattern;
  decorations?: ISectionDecorations[];
}
