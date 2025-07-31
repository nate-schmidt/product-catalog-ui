import React from 'react';

interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  timeRemaining: TimeRemaining | null;
  size?: 'small' | 'medium' | 'large';
  theme?: 'dark' | 'light' | 'urgent';
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ 
  timeRemaining, 
  size = 'medium',
  theme = 'dark'
}) => {
  if (!timeRemaining) {
    return (
      <div className={`
        inline-flex items-center px-3 py-1 rounded-full
        ${theme === 'urgent' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'}
        ${size === 'small' ? 'text-xs' : size === 'large' ? 'text-lg' : 'text-sm'}
      `}>
        <span className="font-medium">Sale Ended</span>
      </div>
    );
  }

  const isUrgent = timeRemaining.hours === 0 && timeRemaining.minutes < 10;
  const displayTheme = isUrgent ? 'urgent' : theme;

  const sizeClasses = {
    small: 'text-xs px-2 py-1',
    medium: 'text-sm px-3 py-1.5',
    large: 'text-lg px-4 py-2'
  };

  const themeClasses = {
    dark: 'bg-gray-900 text-white',
    light: 'bg-white text-gray-900 border border-gray-200',
    urgent: 'bg-red-600 text-white animate-pulse'
  };

  const unitClasses = {
    small: 'text-xs',
    medium: 'text-xs',
    large: 'text-sm'
  };

  const formatTime = (value: number): string => {
    return value.toString().padStart(2, '0');
  };

  return (
    <div className={`
      inline-flex items-center space-x-1 rounded-lg font-mono
      ${sizeClasses[size]}
      ${themeClasses[displayTheme]}
      ${isUrgent ? 'shadow-lg shadow-red-500/25' : 'shadow-sm'}
    `}>
      <div className="flex items-center space-x-1">
        <span className="font-bold">{formatTime(timeRemaining.hours)}</span>
        <span className={`${unitClasses[size]} opacity-75`}>h</span>
      </div>
      <span className="opacity-50">:</span>
      <div className="flex items-center space-x-1">
        <span className="font-bold">{formatTime(timeRemaining.minutes)}</span>
        <span className={`${unitClasses[size]} opacity-75`}>m</span>
      </div>
      <span className="opacity-50">:</span>
      <div className="flex items-center space-x-1">
        <span className="font-bold">{formatTime(timeRemaining.seconds)}</span>
        <span className={`${unitClasses[size]} opacity-75`}>s</span>
      </div>
      {size !== 'small' && (
        <div className="ml-2 flex items-center">
          <svg className="w-4 h-4 opacity-75" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default CountdownTimer;