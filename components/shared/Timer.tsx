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
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-[100px] h-[100px]">
        <svg height="100" width="100">
          <circle stroke="#d6d6c2" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx="50" cy="50" />

          <circle
            stroke="#5b6b2d"
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

        <div className="absolute inset-0 flex items-center justify-center text-2xl font-light text-[#5b6b2d]">
          {value}
        </div>
      </div>

      <span className="text-sm text-[#5b6b2d] tracking-wide uppercase">{label}</span>
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
    <div className="flex gap-10 justify-center items-center">
      <TimeCircle value={timeLeft.days} max={365} label="дней" />
      <TimeCircle value={timeLeft.hours} max={24} label="часов" />
      <TimeCircle value={timeLeft.minutes} max={60} label="минут" />
      <TimeCircle value={timeLeft.seconds} max={60} label="секунд" />
    </div>
  );
};
