"use client";

import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { motion } from "framer-motion";
import { Typography } from "@/components/ui/Typography";
import { IEvent } from "@/types/blocks/event";
import { useMemo } from "react";
import { RoadLayout } from "@/components/EventPlan/ui/RoadLayout";
import { CardLayout } from "@/components/EventPlan/ui/CardLayout";
import { TimelineLayout } from "@/components/EventPlan/ui/TimeLineLayout";
import { ILayout } from "@/types/blocks/config";

type EventPlanProps = {
  content: IEvent;
  decorations?: ILayout["decorations"];
  laptopDecorations?: ILayout["laptopDecorations"];
  mobileDecorations?: ILayout["mobileDecorations"];
};

export const EventPlan = ({ content, decorations, laptopDecorations, mobileDecorations }: EventPlanProps) => {
  const vlanVariant = useMemo(() => {
    switch (content?.type) {
      case "CARD":
        return <CardLayout plan={content.plan} />;
      case "TIME_LINE":
        return <TimelineLayout plan={content.plan} />;
      default:
        return <RoadLayout plan={content.plan} />;
    }
  }, [content]);

  return (
    <SectionWrapper decorations={decorations} laptopDecorations={laptopDecorations} mobileDecorations={mobileDecorations}>
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
