import { Typography } from "@/components/ui/Typography";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

type DetailsProps = {
  details: string[];
};

export const Details = ({ details }: DetailsProps) => {
  return (
    <SectionWrapper>
      <Typography fontSize="title" font="GreatVibes">
        Детали
      </Typography>
      <div className="flex flex-col gap-4">
        {details.map((detail, index) => (
          <Typography fontSize="xxl" key={index} font="Cormorant">
            {detail}
          </Typography>
        ))}
      </div>
    </SectionWrapper>
  );
};
