import { useState, useEffect } from 'react';

export interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export function useCountdown(endTime: Date): TimeRemaining {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(() => {
    return calculateTimeRemaining(endTime);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeRemaining = calculateTimeRemaining(endTime);
      setTimeRemaining(newTimeRemaining);
      
      if (newTimeRemaining.isExpired) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return timeRemaining;
}

function calculateTimeRemaining(endTime: Date): TimeRemaining {
  const now = new Date();
  const difference = endTime.getTime() - now.getTime();

  if (difference <= 0) {
    return {
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
    };
  }

  const hours = Math.floor(difference / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return {
    hours,
    minutes,
    seconds,
    isExpired: false,
  };
}