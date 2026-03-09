import { motion } from "framer-motion";
import { Typography } from "@/components/ui/Typography";
import {
  Map as ShadcnMap,
  MapLocateControl,
  MapMarker,
  MapPopup,
  MapTileLayer,
  MapZoomControl,
} from "@/components/ui/map";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { IMapPlace, IPlaceSettings } from "@/types/blocks/place";

type MapPlaceProps = {
  place: IMapPlace;
  isRight: boolean;
  isLastElement: boolean;
};

export const MapPlace = ({ place, isRight, isLastElement }: MapPlaceProps) => {
  return (
    <motion.div
      key={place.title}
      className="flex flex-col gap-8"
      initial={{ opacity: 0, x: isRight ? 80 : -80 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.9,
        ease: "easeOut",
      }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div
        className={`flex flex-col ${isRight ? "self-end text-right" : "self-start text-left"}`}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <Typography fontSize="xxl" font="GreatVibes" className="font-bold">
          {place.title}
        </Typography>

        <Typography fontSize="xl" font="Cormorant">
          {place.address}
        </Typography>

        <Typography fontSize="xl" font="Cormorant">
          Начало в {place.startTime}
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
        className="rounded-2xl overflow-hidden shadow-lg"
      >
        <ShadcnMap center={place.mapSettings.coordinates as [number, number]} zoom={place.mapSettings?.zoom ?? 18}>
          <MapTileLayer />
          <MapZoomControl />
          <MapLocateControl />
          <MapMarker
            position={place.mapSettings.coordinates as [number, number]}
            icon={
              place.mapSettings?.markerIcon && (
                <Image src={place.mapSettings?.markerIcon} alt="Иконка" width={32} height={32} />
              )
            }
          >
            {place.mapSettings?.hint && (
              <MapPopup>
                <div className="flex flex-col">{place.mapSettings.hint}</div>
                {place.mapSettings?.yandexMapUrl && (
                  <Button asChild className="mt-4" variant="secondary">
                    <a
                      href={place.mapSettings.yandexMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white"
                    >
                      Открыть в яндекс картах
                    </a>
                  </Button>
                )}
              </MapPopup>
            )}
          </MapMarker>
        </ShadcnMap>
      </motion.div>

      {!isLastElement && place?.dividerIcon && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
          className="pt-4 self-center"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: [0.9, 1.08, 0.9] }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Image src={place.dividerIcon} alt="|" width={32} height={32} />
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};
