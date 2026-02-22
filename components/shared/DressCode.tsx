"use client";

import { useState } from "react";
import { Typography } from "@/components/ui/Typography";
import { motion } from "framer-motion";
import Image from "next/image";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { IDressCode } from "@/types/blocks/dresscode";
import { ILayout, ISectionDecorations } from "@/types/blocks/config";

type ColorSchemaItem = {
  color: string;
  maleDressCodeImg: string;
  femaleDressCodeImg: string;
};

type DressCodeProps = {
  dresscode: IDressCode;
  decorations?: ILayout["decorations"];
};

export const DressCode = ({ dresscode, decorations }: DressCodeProps) => {
  const [selectedColor, setSelectedColor] = useState<ColorSchemaItem | null>(null);

  const imageVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <SectionWrapper decorations={decorations}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <Typography fontSize="title" font="GreatVibes" className="text-center">
          {dresscode.title}
        </Typography>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
        {dresscode.colorSchema.map((item, index) => (
          <motion.div
            key={item.color}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.6,
              delay: index * 0.15,
              ease: "easeOut",
            }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.08 }}
            onClick={() => setSelectedColor((prev) => (item.color === prev?.color ? null : item))}
            className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
              item.color === selectedColor?.color
                ? "ring-2 ring-[#C6A769] ring-offset-4 ring-offset-white shadow-xl"
                : "ring-1 ring-transparent hover:ring-[#C6A769]/40"
            }`}
          >
            <div className="w-32 h-16 rounded-2xl" style={{ backgroundColor: item.color }} />
            <div className="absolute inset-0 bg-black/5" />
          </motion.div>
        ))}
      </div>

      {selectedColor && (
        <motion.div
          key={selectedColor.color}
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.15 } },
          }}
          className="flex flex-col sm:flex-row items-center gap-8 mt-8"
        >
          <motion.div variants={imageVariants} className="w-80 h-96 relative rounded-2xl overflow-hidden shadow-lg">
            <Image src={selectedColor.maleDressCodeImg} alt="Мужской аутфит" fill style={{ objectFit: "cover" }} />
          </motion.div>

          <motion.div variants={imageVariants} className="w-80 h-96 relative rounded-2xl overflow-hidden shadow-lg">
            <Image src={selectedColor.femaleDressCodeImg} alt="Женский аутфит" fill style={{ objectFit: "cover" }} />
          </motion.div>
        </motion.div>
      )}
    </SectionWrapper>
  );
};
