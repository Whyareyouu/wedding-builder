"use client";
import Image from "next/image";
import { Typography } from "@/components/ui/Typography";
import { motion } from "framer-motion";
import { useMemo } from "react";

import { IHeader } from "@/types/blocks/header";

export const InitialsPattern = ({ wifeName, husbandName, date }: IHeader) => {
  const { husbandInitial, wifeInitial } = useMemo(
    () => ({
      husbandInitial: husbandName.at(0)?.toUpperCase(),
      wifeInitial: wifeName.at(0)?.toUpperCase(),
    }),
    [wifeName, husbandName],
  );

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center">
        <div className="flex items-center">
          <Typography fontSize="title">{husbandInitial}</Typography>
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <Image src="/icons/gem.svg" width={24} height={24} alt="и" />
          </motion.div>
          <Typography fontSize="title">{wifeInitial}</Typography>
        </div>

        <div className="flex gap-2 items-center">
          <Typography fontSize="xxl" font="GreatVibes">
            {husbandName}
          </Typography>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: [0.9, 1, 0.9] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <Image src="/icons/ampersand.svg" width={24} height={24} alt="и" />
          </motion.div>
          <Typography fontSize="xxl" font="GreatVibes">
            {wifeName}
          </Typography>
        </div>
      </div>

      <Typography fontSize="xxl" font="GreatVibes">
        {date}
      </Typography>
    </div>
  );
};
