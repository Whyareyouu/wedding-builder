"use client";

import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { motion } from "framer-motion";
import { Typography } from "@/components/ui/Typography";
import { IEvent } from "@/types/blocks/event";
import { useMemo } from "react";
import { RoadLayout } from "@/components/EventPlan/ui/RoadLayout";
import { CardLayout } from "@/components/EventPlan/ui/CardLayout";

type EventPlanProps = {
  content: IEvent;
};

export const EventPlan = ({ content }: EventPlanProps) => {
  const vlanVariant = useMemo(() => {
    switch (content?.type) {
      case "CARD":
        return <CardLayout plan={content.plan} />;
      default:
        return <RoadLayout plan={content.plan} />;
    }
  }, [content]);

  return (
    <SectionWrapper>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <Typography fontSize="title" font="GreatVibes">
          {content.title}
        </Typography>
      </motion.div>

      {vlanVariant}
    </SectionWrapper>
  );
};
