"use client";

import { motion } from "framer-motion";
import { Typography } from "@/components/ui/Typography";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { IEvent } from "@/types/blocks/event";

type RoadLayoutProps = {
  plan: IEvent["plan"];
};

export const RoadLayout = ({ plan }: RoadLayoutProps) => {
  return (
    <div className="flex flex-col items-center mt-8 gap-8 sm:gap-16 sm:mt-16">
      {plan.map((event, index) => (
        <motion.div
          key={index}
          className="grid w-full items-start [grid-template-columns:auto_auto_1fr] sm:[grid-template-columns:1fr_auto_1fr]"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="flex justify-end pr-3 sm:pr-6">
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

            {plan.length - 1 !== index && (
              <Separator orientation="vertical" className="h-[60px] sm:h-[80px] w-[2px] mt-2" />
            )}
          </div>

          <div className="flex justify-start pl-3 sm:pl-6 flex-col gap-1 sm:gap-2">
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
  );
};
