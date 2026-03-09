"use client";
import { Typography } from "@/components/ui/Typography";
import { motion } from "framer-motion";
import { IShared } from "@/types/blocks/config";

export const StackedPattern = ({ wifeName, husbandName, date }: Pick<IShared, "date" | "husbandName" | "wifeName">) => {
  return (
    <div className="flex flex-col items-center gap-2">
      {[husbandName, wifeName].map((name, i) => (
        <motion.div
          key={name}
          initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: i * 0.2 }}
        >
          <Typography fontSize="title" font="GreatVibes">
            {name}
          </Typography>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="mt-4"
      >
        <Typography fontSize="xxl" font="GreatVibes">
          {date}
        </Typography>
      </motion.div>
    </div>
  );
};
