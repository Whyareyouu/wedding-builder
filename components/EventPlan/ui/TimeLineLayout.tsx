"use client";

import { motion, useInView } from "framer-motion";
import { Typography } from "@/components/ui/Typography";
import Image from "next/image";
import { useRef } from "react";
import { IEvent } from "@/types/blocks/event";

type TimelineLayoutProps = {
  plan: IEvent["plan"];
};

type TimelineItemProps = {
  event: IEvent["plan"][number];
  index: number;
  isLast: boolean;
};

const DOT_OFFSET = 15;

const TimelineItem = ({ event, index, isLast }: TimelineItemProps) => {
  const isLeft = index % 2 === 0;

  return (
    <div className="relative flex items-start w-full min-h-[120px] sm:min-h-[140px]">
      {/* Левая сторона */}
      <div className="flex-1 flex justify-end pr-4 sm:pr-8 pt-1">
        {isLeft ? (
          <motion.div
            className="flex flex-col items-end gap-1 sm:gap-2 text-right max-w-[140px] sm:max-w-[220px]"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.15 + 0.4, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <Typography fontSize="xxl" font="GreatVibes">
              {event.startTime}
            </Typography>
            <Typography fontSize="xxl" font="GreatVibes" className="text-wrap leading-tight">
              {event.event}
            </Typography>
            {event?.description && (
              <Typography fontSize="xl" font="Cormorant" className="text-wrap">
                {event.description}
              </Typography>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.15 + 0.4, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <MediaCircle event={event} />
          </motion.div>
        )}
      </div>

      <div className="relative z-10 flex items-start justify-center w-4 shrink-0 mt-3">
        <motion.div
          className="w-3 h-3 rounded-full bg-foreground shrink-0"
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: index * 0.15 + 0.25, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.5 }}
        />
      </div>

      <div className="flex-1 flex justify-start pl-4 sm:pl-8 pt-1">
        {!isLeft ? (
          <motion.div
            className="flex flex-col items-start gap-1 sm:gap-2 max-w-[140px] sm:max-w-[220px]"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.15 + 0.4, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <Typography fontSize="xxl" font="GreatVibes">
              {event.startTime}
            </Typography>
            <Typography fontSize="xxl" font="GreatVibes" className="text-wrap leading-tight">
              {event.event}
            </Typography>
            {event?.description && (
              <Typography fontSize="xl" font="Cormorant" className="text-wrap">
                {event.description}
              </Typography>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.15 + 0.4, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <MediaCircle event={event} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

const MediaCircle = ({ event }: { event: IEvent["plan"][number] }) => {
  const src = event.image?.path ?? event.icon?.path;
  const width = event.image?.width ?? event.icon?.width ?? 80;
  const height = event.image?.height ?? event.icon?.height ?? 80;

  if (!src) return null;

  const isPhoto = !!event.image?.path;

  return (
    <div
      className={`
        relative overflow-hidden shrink-0
        w-[72px] h-[72px] sm:w-[100px] sm:h-[100px]
        ${isPhoto ? "rounded-full border-2 border-border" : ""}
      `}
    >
      <Image
        src={src}
        alt={event.event}
        width={width}
        height={height}
        className={isPhoto ? "object-cover w-full h-full" : "w-full h-full object-contain"}
      />
    </div>
  );
};

const AnimatedLine = ({ itemCount }: { itemCount: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <div ref={ref} className="absolute inset-0 flex justify-center pointer-events-none">
      <motion.div
        className="w-[2px] bg-foreground origin-top"
        style={{ marginTop: DOT_OFFSET }}
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: itemCount * 0.3, ease: "easeInOut" }}
      />
    </div>
  );
};

export const TimelineLayout = ({ plan }: TimelineLayoutProps) => {
  return (
    <div className="relative flex flex-col items-center mt-8 sm:mt-16 w-full">
      <AnimatedLine itemCount={plan.length} />

      {plan.map((event, index) => (
        <TimelineItem key={index} event={event} index={index} isLast={index === plan.length - 1} />
      ))}
    </div>
  );
};
