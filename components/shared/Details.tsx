"use client";
import { Typography } from "@/components/ui/Typography";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { IDetails } from "@/types/blocks/details";
import { motion } from "framer-motion";

type DetailsProps = {
  content: IDetails;
};

export const Details = ({ content }: DetailsProps) => {
  const alignmentClasses = {
    center: "items-center text-center",
    left: "items-start text-left",
    right: "items-end text-right",
  };

  return (
    <SectionWrapper className={alignmentClasses[content?.align ?? "left"]}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <Typography fontSize="title" font="GreatVibes">
          {content?.title}
        </Typography>
      </motion.div>

      <div className={`flex flex-col gap-6 w-full ${alignmentClasses[content?.align ?? "left"]}`}>
        {content?.details?.map((detail, index) => (
          <motion.div
            key={index}
            className="flex flex-col gap-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: index * 0.1, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            {detail?.title && (
              <Typography fontSize="subtitle" font="GreatVibes">
                {detail.title}
              </Typography>
            )}
            <Typography fontSize="xxl" font="Cormorant">
              {detail.detail}
            </Typography>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
};
