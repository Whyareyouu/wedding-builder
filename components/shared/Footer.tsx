"use client";
import { Typography } from "@/components/ui/Typography";
import { useMemo } from "react";
import { CountdownTimer } from "@/components/shared/Timer";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { IFooter } from "@/types/blocks/footer";

type FooterProps = {
  footerSettings: IFooter;
  date: string;
  guestName?: string;
};

export const Footer = ({ footerSettings, date, guestName }: FooterProps) => {
  const {
    baseText = "До встречи",
    genderConfig = {
      pluralText: "дорогие",
    },
    alwaysText,
  } = footerSettings;

  const friends = useMemo(() => {
    if (alwaysText) {
      return `, ${alwaysText}!`;
    }

    if (!guestName) {
      return "!";
    }

    return `, ${genderConfig.pluralText} ${guestName}!`;
  }, [guestName, genderConfig.pluralText, alwaysText]);

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
