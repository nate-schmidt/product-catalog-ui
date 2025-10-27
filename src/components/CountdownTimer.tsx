import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetTime: Date;
  onExpire?: () => void;
  showLabels?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'urgent';
}

interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export function CountdownTimer({ 
  targetTime, 
  onExpire, 
  showLabels = true, 
  size = 'medium',
  variant = 'default'
}: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0
  });

  const calculateTimeRemaining = (targetDate: Date): TimeRemaining => {
    const now = new Date().getTime();
    const target = new Date(targetDate).getTime();
    const difference = target - now;

    if (difference <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { hours, minutes, seconds, total: difference };
  };

  useEffect(() => {
    const updateTimer = () => {
      const remaining = calculateTimeRemaining(targetTime);
      setTimeRemaining(remaining);

      if (remaining.total <= 0 && onExpire) {
        onExpire();
      }
    };

    // Update immediately
    updateTimer();

    // Then update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [targetTime, onExpire]);

  if (timeRemaining.total <= 0) {
    return (
      <div className="text-red-500 font-bold">
        ⏰ Time's Up!
      </div>
    );
  }

  // Style variants
  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-2xl'
  };

  const variantClasses = {
    default: 'text-gray-800 bg-gray-100',
    urgent: timeRemaining.total < 5 * 60 * 1000 // less than 5 minutes
      ? 'text-red-600 bg-red-100 animate-pulse'
      : 'text-orange-600 bg-orange-100'
  };

  const containerClass = `inline-flex items-center gap-2 px-3 py-1 rounded-lg font-mono font-bold ${sizeClasses[size]} ${variantClasses[variant]}`;

  const formatTime = (value: number): string => {
    return value.toString().padStart(2, '0');
  };

  return (
    <div className={containerClass}>
      {timeRemaining.hours > 0 && (
        <>
          <span className="flex flex-col items-center">
            <span>{formatTime(timeRemaining.hours)}</span>
            {showLabels && <span className="text-xs opacity-75">hrs</span>}
          </span>
          <span className="opacity-50">:</span>
        </>
      )}
      
      <span className="flex flex-col items-center">
        <span>{formatTime(timeRemaining.minutes)}</span>
        {showLabels && <span className="text-xs opacity-75">min</span>}
      </span>
      
      <span className="opacity-50">:</span>
      
      <span className="flex flex-col items-center">
        <span>{formatTime(timeRemaining.seconds)}</span>
        {showLabels && <span className="text-xs opacity-75">sec</span>}
      </span>
    </div>
  );
}

export default CountdownTimer;