"use client";
import { Typography } from "@/components/ui/Typography";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

type EventPlanProps = {
  eventPlan: {
    title: string;
    plan: {
      event: string;
      description?: string;
      startTime: string;
      icon: {
        path: string;
        width: number;
        height: number;
      };
    }[];
  };
};

export const EventPlan = ({ eventPlan }: EventPlanProps) => {
  return (
    <SectionWrapper>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <Typography fontSize="title" font="GreatVibes">
          {eventPlan.title}
        </Typography>
      </motion.div>

      <div className="flex flex-col items-center mt-16 gap-16">
        {eventPlan.plan.map((event, index) => (
          <motion.div
            key={index}
            className="flex w-full items-start gap-8"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="flex-1 flex justify-end pr-4">
              <Typography fontSize="xxl" font="GreatVibes">
                {event.startTime}
              </Typography>
            </div>

            <div className="flex flex-col items-center">
              <motion.div
                animate={{ rotate: [-2, 2, -2] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image src={event.icon.path} alt={event.event} width={event.icon.width} height={event.icon.height} />
              </motion.div>

              {eventPlan.plan.length - 1 !== index && (
                <Separator orientation="vertical" className="h-[80px] w-[2px] mt-2" />
              )}
            </div>

            <div className="flex-1 flex justify-start pl-4 flex-col gap-2">
              <Typography fontSize="xxl" className="text-wrap" font="GreatVibes">
                {event.event}
              </Typography>

              {event?.description && (
                <Typography fontSize="xl" className="text-wrap" font="Cormorant">
                  {event.description}
                </Typography>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
};
