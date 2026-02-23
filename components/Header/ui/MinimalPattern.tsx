"use client";
import { Typography } from "@/components/ui/Typography";
import { motion } from "framer-motion";

import { IHeader } from "@/types/blocks/header";

export const MinimalPattern = ({ wifeName, husbandName, date }: IHeader) => {
  return (
    <div className="flex flex-col items-center gap-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
        <Typography fontSize="title" font="GreatVibes">
          {husbandName} & {wifeName}
        </Typography>
      </motion.div>

      <div className="w-16 h-px bg-current opacity-30" />

      <Typography fontSize="xxl">{date}</Typography>
    </div>
  );
};
