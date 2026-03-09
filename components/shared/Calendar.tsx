"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

import Image from "next/image";
import { Typography } from "@/components/ui/Typography";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { ILayout } from "@/types/blocks/config";

type CalendarProps = {
  targetDate: string;
  decorations?: ILayout["decorations"];
  mobileDecorations?: ILayout["decorations"];
};

const WEEK_DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const parseDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split(".").map(Number);

  return new Date(year, month - 1, day);
};

const getMonthData = (date: Date): { year: number; month: number; days: (number | null)[] } => {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const daysInMonth = lastDayOfMonth.getDate();

  let startWeekDay = firstDayOfMonth.getDay();
  startWeekDay = startWeekDay === 0 ? 6 : startWeekDay - 1;

  const days = [];

  for (let i = 0; i < startWeekDay; i++) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return { year, month, days };
};

export const Calendar = ({ targetDate, decorations, mobileDecorations }: CalendarProps) => {
  const date = useMemo(() => parseDate(targetDate), [targetDate]);
  const selectedDay = date.getDate();

  const { year, days } = useMemo(() => getMonthData(date), [date]);

  const monthName = date.toLocaleString("ru-RU", { month: "long" });

  return (
    <SectionWrapper decorations={decorations} mobileDecorations={mobileDecorations}>
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl ">
        <div className="text-center mb-4 flex justify-between items-center">
          <Typography className="capitalize italic text-justify" fontSize="xxl" font="Cormorant">
            {monthName}
          </Typography>
          <Image src="/icons/heart.svg" alt="<3" width={48} height={24} />
          <Typography className="capitalize italic text-justify" fontSize="xxl" font="Cormorant">
            {year}
          </Typography>
        </div>

        <div className="grid grid-cols-7 mb-3 text-sm font-medium text-gray-500">
          {WEEK_DAYS.map((day) => (
            <div key={day} className="text-center">
              {day.toUpperCase()}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => (
            <div key={index} className="h-12 flex items-center justify-center relative">
              {day && day === selectedDay ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 15 }}
                  className="relative w-12 h-12 flex items-center justify-center"
                >
                  <motion.div
                    initial={{ rotate: 0, scale: 1 }}
                    animate={{
                      rotate: [0, -20, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute top-[-2px]"
                  >
                    <Image src="/icons/diamond-ring.svg" alt="♡" width={64} height={64} />
                  </motion.div>
                  <div className="absolute text-gray-950">{day}</div>
                </motion.div>
              ) : (
                <div className="w-12 h-12 flex items-center justify-center rounded-xl  transition text-gray-700">
                  {day ?? ""}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};
