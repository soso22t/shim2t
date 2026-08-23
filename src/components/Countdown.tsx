import { useState, useEffect } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const TARGET_DATE = new Date("2026-09-18T19:00:00");

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = TARGET_DATE.getTime() - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const items = [
    { label: "DAYS", value: String(timeLeft.days).padStart(2, "0") },
    { label: "HOURS", value: String(timeLeft.hours).padStart(2, "0") },
    { label: "MINUTES", value: String(timeLeft.minutes).padStart(2, "0") },
    { label: "SECONDS", value: String(timeLeft.seconds).padStart(2, "0") },
  ];

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4 dir-ltr py-2">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="w-16 h-20 sm:w-20 sm:h-24 rounded-2xl flex flex-col items-center justify-center backdrop-blur-md shadow-md transition-transform"
          style={{
            background: "transparent",
            color: "#FFFFFF",
            border: "none",
            boxShadow: "0 0 12px rgba(176, 138, 60, 0.4), 0 10px 25px rgba(0, 0, 0, 0.2)",
          }}
        >
          <span
            className="font-display text-xl sm:text-2xl font-bold tracking-tight leading-none mb-1"
            style={{ color: "#B08A3C" }}
          >
            {item.value}
          </span>
          <span
            className="font-sans text-[9px] sm:text-[10px] font-bold tracking-widest uppercase opacity-90"
            style={{ color: "#FFFFFF" }}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Countdown;
