"use client";

import { motion } from "framer-motion";
import { Typography } from "@/components/ui/Typography";
import { PhotoFrame } from "@/components/shared/PhotoFrame";
import { Button } from "@/components/ui/button";
import { IFramePlace } from "@/types/blocks/place";

type CenteredPlaceProps = {
  place: IFramePlace;
  numberOfElement: number;
};

export const CenteredPlace = ({ place, numberOfElement }: CenteredPlaceProps) => {
  return (
    <motion.div
      className="flex flex-col items-center gap-6 w-full"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: "easeOut", delay: numberOfElement * 0.15 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div
        className="w-full"
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: numberOfElement * 0.15 + 0.1 }}
        viewport={{ once: true }}
      >
        <PhotoFrame content={place.frameSettings} />
      </motion.div>

      <motion.div
        className="flex flex-col items-center gap-2 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: numberOfElement * 0.15 + 0.25 }}
        viewport={{ once: true }}
      >
        <Typography fontSize="xxl" font="GreatVibes">
          {place.title}
        </Typography>

        <Typography fontSize="xl" font="Cormorant" className="text-center">
          {place.address}
        </Typography>

        <Typography fontSize="xl" font="Cormorant" className="text-center">
          Начало в {place.startTime}
        </Typography>
      </motion.div>

      {place.mapSettings?.yandexMapUrl && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: numberOfElement * 0.15 + 0.4 }}
          viewport={{ once: true }}
        >
          <Button variant="outline" asChild className="rounded-full px-10">
            <a href={place.mapSettings.yandexMapUrl} target="_blank" rel="noopener noreferrer">
              На карте
            </a>
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};
