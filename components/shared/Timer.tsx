"use client";

import { useEffect, useState } from "react";

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
  const radius = 45;
  const stroke = 3;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const progress = value / max;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-[72px] h-[72px] sm:w-[100px] sm:h-[100px]">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle
            stroke="hsl(var(--border))"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx="50"
            cy="50"
          />
          <circle
            stroke="hsl(var(--foreground))"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
            r={normalizedRadius}
            cx="50"
            cy="50"
            transform="rotate(-90 50 50)"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center text-lg sm:text-2xl font-light text-foreground">
          {value}
        </div>
      </div>

      <span className="text-xs sm:text-sm text-muted-foreground tracking-wide uppercase">{label}</span>
    </div>
  );
};

const parseDate = (input: string) => {
  const [day, month, year] = input.split(".").map(Number);
  return new Date(year, month - 1, day);
};

export const CountdownTimer = ({ date }: Props) => {
  const targetDate = parseDate(date);

  const calculateTimeLeft = (): TimeLeft => {
    const difference = targetDate.getTime() - new Date().getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-4 sm:gap-10 justify-center items-center">
      <TimeCircle value={timeLeft.days} max={365} label="дней" />
      <TimeCircle value={timeLeft.hours} max={24} label="часов" />
      <TimeCircle value={timeLeft.minutes} max={60} label="минут" />
      <TimeCircle value={timeLeft.seconds} max={60} label="секунд" />
    </div>
  );
};
