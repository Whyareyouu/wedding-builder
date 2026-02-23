import { ISectionDecorations, IShared } from "@/types/blocks/config";

export type HeaderPattern = "initials" | "fullnames" | "minimal" | "stacked";

export interface IHeader extends Pick<IShared, "date" | "husbandName" | "wifeName"> {
  pattern?: HeaderPattern;
  decorations?: ISectionDecorations[];
}
