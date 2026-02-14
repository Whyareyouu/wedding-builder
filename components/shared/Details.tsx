import { Typography } from "@/components/ui/Typography";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

type DetailsProps = {
  details: string[];
};

export const Details = ({ details }: DetailsProps) => {
  return (
    <SectionWrapper>
      <Typography fontSize="title">Детали</Typography>
      <div className="flex flex-col">
        {details.map((detail, index) => (
          <Typography fontSize="xxl" key={index}>
            {detail}
          </Typography>
        ))}
      </div>
    </SectionWrapper>
  );
};
