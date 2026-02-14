"use client";
import { Typography } from "@/components/ui/Typography";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { CountdownTimer } from "@/components/shared/Timer";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

export const Footer = () => {
  const searchParams = useSearchParams();

  const male = searchParams.get("male");
  const female = searchParams.get("female");

  const friends = useMemo(() => {
    if (!male && !female) {
      return "!";
    }
    if ((male && !female) || (!male && female)) {
      return `, дорог${male ? "ой" : "ая"} ${male || female}!`;
    }

    return `, дорогие ${male} & ${female}!`;
  }, [male, female]);
  return (
    <SectionWrapper className="mb-12">
      <div className="flex justify-center">
        <Typography fontSize="title" font="GreatVibes" className="text-center">
          До встречи{friends}
        </Typography>
      </div>
      <CountdownTimer date="20.06.2026" />
    </SectionWrapper>
  );
};
