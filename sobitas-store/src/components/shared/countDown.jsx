"use client";
import React, { useState, useEffect } from "react";

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    // Parse the target date string into a Date object
    const targetTime = new Date(targetDate).getTime();

    const calculateTimeLeft = () => {
      // Get current time
      const now = Date.now();

      // Calculate the difference
      const difference = targetTime - now;

      // Check if the target date has passed
      if (difference <= 0) {
        setIsExpired(true);
        return;
      }

      // Calculate days, hours, minutes, and seconds
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    // Initial calculation
    calculateTimeLeft();

    // Set up interval to update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(timer);
  }, [targetDate]);

  if (isExpired) {
    return null; // Don't show anything if expired
  }

  return (
    <div className="flex items-center justify-center mt-3 space-x-2 text-xs text-center">
      <div className="flex flex-col items-center">
        <div className="px-2 py-1 font-bold text-white rounded bg-primary min-w-8">
          {timeLeft.days}
        </div>
        <span className="text-[#777777] text-[10px]">Jours</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="px-2 py-1 font-bold text-white rounded bg-primary min-w-8">
          {timeLeft.hours}
        </div>
        <span className="text-[#777777] text-[10px]">Hrs</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="px-2 py-1 font-bold text-white rounded bg-primary min-w-8">
          {timeLeft.minutes}
        </div>
        <span className="text-[#777777] text-[10px]">Min</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="px-2 py-1 font-bold text-white rounded bg-primary min-w-8">
          {timeLeft.seconds}
        </div>
        <span className="text-[#777777] text-[10px]">Sec</span>
      </div>
    </div>
  );
};

export default CountdownTimer;
