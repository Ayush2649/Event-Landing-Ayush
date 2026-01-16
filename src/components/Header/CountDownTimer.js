"use client";
import { useEffect, useState } from "react";

export default function CountdownTimer({ eventDate }) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    function calculateTime() {
      const now = new Date().getTime();
      const eventTime = new Date(eventDate).getTime();
      const diff = eventTime - now;

      if (diff <= 0) {
        setTimeLeft(null);
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }

    calculateTime();
    const timer = setInterval(calculateTime, 1000);

    return () => clearInterval(timer);
  }, [eventDate]);

  if (!timeLeft) {
    return <p>🎉 Event is Live!</p>;
  }

  return (
    <div>
      ⏳ Starts in{" "}
      <strong>
        {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m{" "}
        {timeLeft.seconds}s
      </strong>
    </div>
  );
}
