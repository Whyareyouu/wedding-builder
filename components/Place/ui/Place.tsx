"use client";

import { Typography } from "@/components/ui/Typography";

import { motion } from "framer-motion";

import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { IFramePlace, IMapPlace, IPlace } from "@/types/blocks/place";
import { CenteredPlace } from "@/components/Place/ui/CenteredPlace";
import { MapPlace } from "@/components/Place/ui/MapPlace";
import { ILayout, ISectionDecorations } from "@/types/blocks/config";

type PlaceProps = {
  content: IPlace;
  decorations?: ILayout["decorations"];
};

export const Place = ({ content, decorations }: PlaceProps) => {
  return (
    <SectionWrapper className="items-stretch" decorations={decorations}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="w-full flex justify-center"
      >
        <Typography fontSize="title" font="GreatVibes" className="text-center">
          {content?.title ?? "Локация"}
        </Typography>
      </motion.div>

      {content.places.map((place, index) => {
        switch (content.type) {
          case "MAP":
            return (
              <MapPlace
                place={place as IMapPlace}
                isRight={index % 2 !== 0}
                isLastElement={content.places.length - 1 === index}
                key={index}
              />
            );
          case "FRAME":
            return <CenteredPlace place={place as IFramePlace} numberOfElement={index} key={index} />;
          default:
            return null;
        }
      })}
    </SectionWrapper>
  );
};
