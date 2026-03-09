"use client";

import { useEffect, useState } from "react";
import { Typography } from "@/components/ui/Typography";

type Props = {
  date: string;
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

type CircleProps = {
  value: number;
  max: number;
  label: string;
};

const TimeCircle = ({ value, max, label }: CircleProps) => {
  const radius = 44;
  const stroke = 2.5;
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  const progress = value / max;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-[80px] h-[80px] sm:w-[108px] sm:h-[108px]">
        <svg viewBox="0 0 88 88" className="w-full h-full">
          <circle
            stroke="hsl(var(--border))"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx="44"
            cy="44"
          />
          <circle
            stroke="hsl(var(--foreground))"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
            r={normalizedRadius}
            cx="44"
            cy="44"
            transform="rotate(-90 44 44)"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <Typography font="Cormorant" fontSize="xxl" className="leading-none tabular-nums">
            {String(value).padStart(2, "0")}
          </Typography>
        </div>
      </div>

      <Typography font="Cormorant" fontSize="sm" className="tracking-widest uppercase opacity-60">
        {label}
      </Typography>
    </div>
  );
};

const parseDate = (input: string) => {
  const [day, month, year] = input.split(".").map(Number);
  return new Date(year, month - 1, day);
};

export const CountdownTimer = ({ date }: Props) => {
  const targetDate = parseDate(date);

  const calculateTimeLeft = (): TimeLeft | null => {
    const difference = targetDate.getTime() - new Date().getTime();
    if (difference <= 0) return null;

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) {
    return (
      <div className="flex flex-col items-center gap-3 py-4">
        <Typography font="GreatVibes" fontSize="title" className="text-center leading-tight">
          Сегодня наш день
        </Typography>
        <Typography font="Cormorant" fontSize="xl" className="tracking-widest opacity-60 text-center">
          ✦ &nbsp; с любовью ждём вас &nbsp; ✦
        </Typography>
      </div>
    );
  }

  return (
    <div className="flex gap-3 sm:gap-6 justify-center items-center">
      <TimeCircle value={timeLeft.days} max={365} label="дней" />
      <TimeCircle value={timeLeft.hours} max={24} label="часов" />
      <TimeCircle value={timeLeft.minutes} max={60} label="минут" />
      <TimeCircle value={timeLeft.seconds} max={60} label="секунд" />
    </div>
  );
};
