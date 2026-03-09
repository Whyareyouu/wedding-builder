import { IHeader } from "@/types/blocks/header";
import { InitialsPattern } from "./InitialsPattern";
import { FullnamesPattern } from "./FullnamesPattern";
import { MinimalPattern } from "./MinimalPattern";
import { StackedPattern } from "./StackedPattern";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { IShared } from "@/types/blocks/config";

const PATTERN_MAP = {
  initials: InitialsPattern,
  fullnames: FullnamesPattern,
  minimal: MinimalPattern,
  stacked: StackedPattern,
} as const;

export const Header = ({
  pattern = "initials",
  decorations,
  ...props
}: IHeader & Pick<IShared, "date" | "husbandName" | "wifeName">) => {
  const PatternComponent = PATTERN_MAP[pattern];

  return (
    <header className="flex flex-col h-[100vh] items-center justify-around">
      <SectionWrapper decorations={decorations}>
        <PatternComponent {...props} />
      </SectionWrapper>
    </header>
  );
};
