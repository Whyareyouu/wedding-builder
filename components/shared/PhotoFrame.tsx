"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { IImage } from "@/types/blocks/config";

type PhotoFrameProps = {
  images: IImage[];
  borderColor?: string;
  intervalMs?: number;
};

export const PhotoFrame = ({ images, borderColor = "#4a5c3a", intervalMs = 4000 }: PhotoFrameProps) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [images.length, intervalMs]);

  const image = images[current];

  return (
    <div className="relative w-full aspect-[4/3]">
      <div
        className="relative w-full h-full overflow-hidden"
        style={{
          border: `4px solid ${borderColor}`,
          borderRadius: "4px",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <Image src={image.path} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 672px" />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
