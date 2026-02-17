"use client";
import { Typography } from "@/components/ui/Typography";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { CountdownTimer } from "@/components/shared/Timer";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { IFooter } from "@/types/blocks/footer";

type FooterProps = {
  footerSettings: IFooter;
  date: string;
};

export const Footer = ({ footerSettings, date }: FooterProps) => {
  const {
    baseText = "До встречи",
    genderConfig = {
      maleEnding: "ой",
      femaleEnding: "ая",
      pluralText: "дорогие",
      singleBase: "дорог",
    },
    disableGenderEnding = false,
    alwaysText,
    pairSeparator = " & ",
  } = footerSettings;

  const searchParams = useSearchParams();

  const male = searchParams.get("male");
  const female = searchParams.get("female");

  const friends = useMemo(() => {
    if (alwaysText) {
      return `, ${alwaysText}!`;
    }

    if (!male && !female) {
      return "!";
    }

    if (disableGenderEnding) {
      if (male && female) {
        return `, ${genderConfig.pluralText} ${male}${pairSeparator}${female}!`;
      }
      return `, ${genderConfig.pluralText} ${male || female}!`;
    }

    if ((male && !female) || (!male && female)) {
      const name = male || female;
      const ending = male ? genderConfig.maleEnding : genderConfig.femaleEnding;

      return `, ${genderConfig.singleBase}${ending} ${name}!`;
    }

    return `, ${genderConfig.pluralText} ${male}${pairSeparator}${female}!`;
  }, [male, female, genderConfig, disableGenderEnding, alwaysText, pairSeparator]);

  return (
    <SectionWrapper className="mb-12">
      <div className="flex justify-center">
        <Typography fontSize="title" font="GreatVibes" className="text-center">
          {baseText}
          {friends}
        </Typography>
      </div>
      <CountdownTimer date={date} />
    </SectionWrapper>
  );
};
