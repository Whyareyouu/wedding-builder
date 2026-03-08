"use client";

import { useState } from "react";
import { Typography } from "@/components/ui/Typography";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { ColorSchemaItem, IDressCode } from "@/types/blocks/dresscode";
import { ILayout } from "@/types/blocks/config";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";

type DressCodeProps = {
  dresscode: IDressCode;
  decorations?: ILayout["decorations"];
};

export const DressCode = ({ dresscode, decorations }: DressCodeProps) => {
  const [selectedColor, setSelectedColor] = useState<ColorSchemaItem | null>(null);
  const [modalImage, setModalImage] = useState<string | null>(null);

  const imageVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  const handleImageClick = (imageSrc: string) => {
    setModalImage(imageSrc);
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
            key={item.id}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.6,
              delay: index * 0.15,
              ease: "easeOut",
            }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.08 }}
            onClick={() => setSelectedColor((prev) => (item.id === prev?.id ? null : item))}
            className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
              item.id === selectedColor?.id
                ? "ring-2 ring-[#C6A769] ring-offset-4 ring-offset-white shadow-xl"
                : "ring-1 ring-transparent hover:ring-[#C6A769]/40"
            }`}
          >
            {item.colorImage ? (
              <div className="w-40 h-20 rounded-2xl relative">
                <Image
                  src={item.colorImage}
                  alt="Цветовая схема"
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-2xl"
                />
              </div>
            ) : (
              <div className="w-40 h-20 rounded-2xl" style={{ backgroundColor: item.color }} />
            )}
            <div className="absolute inset-0 bg-black/5" />
          </motion.div>
        ))}
      </div>

      {selectedColor && (
        <motion.div
          key={selectedColor.id}
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.15 } },
          }}
          className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-8"
        >
          {!selectedColor.onlyForFemale && selectedColor.maleDressCodeImg && (
            <motion.div
              variants={imageVariants}
              className="w-80 h-96 relative rounded-2xl overflow-hidden shadow-lg cursor-pointer group"
              onClick={() => handleImageClick(selectedColor.maleDressCodeImg!)}
            >
              <Image src={selectedColor.maleDressCodeImg} alt="Мужской аутфит" fill style={{ objectFit: "cover" }} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                    <line x1="11" y1="8" x2="11" y2="14" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                </div>
              </div>
            </motion.div>
          )}

          {/* Женский образ */}
          {!selectedColor.onlyForMale && selectedColor.femaleDressCodeImg && (
            <motion.div
              variants={imageVariants}
              className="w-80 h-96 relative rounded-2xl overflow-hidden shadow-lg cursor-pointer group"
              onClick={() => handleImageClick(selectedColor.femaleDressCodeImg!)}
            >
              <Image src={selectedColor.femaleDressCodeImg} alt="Женский аутфит" fill style={{ objectFit: "cover" }} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                    <line x1="11" y1="8" x2="11" y2="14" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Модальное окно для просмотра изображения */}
      <Dialog open={!!modalImage} onOpenChange={(open) => !open && setModalImage(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden bg-black/95 border-none">
          <DialogClose className="absolute right-4 top-4 z-50 rounded-full bg-white/10 p-2 hover:bg-white/20 transition-colors backdrop-blur-sm">
            <X className="h-6 w-6 text-white" />
            <span className="sr-only">Закрыть</span>
          </DialogClose>

          {modalImage && (
            <div className="relative w-full h-[95vh] flex items-center justify-center">
              <Image src={modalImage} alt="Просмотр образа" fill style={{ objectFit: "contain" }} className="p-4" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SectionWrapper>
  );
};
