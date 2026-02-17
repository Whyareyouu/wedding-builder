"use client";

import { motion } from "framer-motion";
import { Typography } from "@/components/ui/Typography";
import Image from "next/image";
import { IEvent } from "@/types/blocks/event";

type CardLayoutProps = {
  plan: IEvent["plan"];
};

export const CardLayout = ({ plan }: CardLayoutProps) => {
  return (
    <div className="flex flex-col items-center mt-16 gap-6 w-full max-w-md mx-auto px-4">
      {plan.map((event, index) => (
        <motion.div
          key={index}
          className="relative w-full"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: index * 0.15, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div
            className="relative w-full rounded-2xl border overflow-hidden px-8 py-7"
            style={{ boxShadow: "0 2px 16px 0 rgba(120,110,80,0.07)" }}
          >
            {event.icon?.path && (
              <motion.div
                className="absolute -bottom-0 -left-1 z-10 pointer-events-none"
                animate={{ rotate: [-3, 3, -3] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.5,
                }}
              >
                <Image src={event.icon.path} alt={event.event} width={event.icon.width} height={event.icon.height} />
              </motion.div>
            )}

            <div className="flex justify-center mb-3">
              <Typography fontSize="xxl" font="GreatVibes">
                {event.startTime}
              </Typography>
            </div>

            <div className="w-16 h-px bg-[#c8bfa8] mx-auto mb-4" />

            <div className="text-center mb-2">
              <Typography fontSize="xxl" font="GreatVibes">
                {event.event}
              </Typography>
            </div>

            {event?.description && (
              <div className="text-center">
                <Typography fontSize="xl" font="Cormorant">
                  {event.description}
                </Typography>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
