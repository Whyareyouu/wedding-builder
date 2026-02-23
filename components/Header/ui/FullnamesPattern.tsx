"use client";

import Image from "next/image";
import { Typography } from "@/components/ui/Typography";
import { motion } from "framer-motion";

import { IHeader } from "@/types/blocks/header";

export const FullnamesPattern = ({ wifeName, husbandName, date }: IHeader) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <Typography fontSize="title" font="GreatVibes">
        {husbandName}
      </Typography>

      <div className="flex flex-col items-center gap-1">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          <Image src="/icons/gem.svg" width={48} height={48} alt="и" />
        </motion.div>
        <Typography fontSize="xl">{date}</Typography>
      </div>

      <Typography fontSize="title" font="GreatVibes">
        {wifeName}
      </Typography>
    </div>
  );
};
