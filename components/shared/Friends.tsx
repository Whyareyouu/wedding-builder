"use client";
import { Typography } from "@/components/ui/Typography";
import { Calendar } from "@/components/shared/Calendar";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

type FriendsProps = {
  kindWordsForGuests: string[];
  date: string;
};

export const Friends = ({ kindWordsForGuests, date }: FriendsProps) => {
  return (
    <SectionWrapper>
      <Typography font="GreatVibes" fontSize="title" className="text-center">
        Дорогие друзья
      </Typography>
      <div className="flex flex-col gap-8 ">
        {kindWordsForGuests.map((words, index) => (
          <Typography key={index} fontSize="xxl" font="Cormorant">
            {words}
          </Typography>
        ))}
      </div>
      <Calendar targetDate={date} />
    </SectionWrapper>
  );
};
