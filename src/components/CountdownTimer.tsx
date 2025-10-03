import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  endTime: Date;
  onExpire?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer({ endTime, onExpire }: CountdownTimerProps) {
  const calculateTimeLeft = (): TimeLeft | null => {
    const difference = endTime.getTime() - new Date().getTime();

    if (difference <= 0) {
      return null;
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (!newTimeLeft && onExpire) {
        onExpire();
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, onExpire]);

  if (!timeLeft) {
    return (
      <div className="text-gray-400 text-sm font-medium">
        Sale Ended
      </div>
    );
  }

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-gradient-to-br from-red-600 to-red-700 text-white font-bold text-xl sm:text-2xl px-3 py-2 rounded-lg min-w-[50px] text-center shadow-lg">
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-gray-400 text-xs mt-1 uppercase tracking-wide">
        {label}
      </div>
    </div>
  );

  return (
    <div className="flex gap-2 items-center justify-center">
      {timeLeft.days > 0 && (
        <>
          <TimeUnit value={timeLeft.days} label="Days" />
          <span className="text-red-500 font-bold text-xl pb-5">:</span>
        </>
      )}
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <span className="text-red-500 font-bold text-xl pb-5">:</span>
      <TimeUnit value={timeLeft.minutes} label="Mins" />
      <span className="text-red-500 font-bold text-xl pb-5">:</span>
      <TimeUnit value={timeLeft.seconds} label="Secs" />
    </div>
  );
}
