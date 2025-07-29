import { useState } from "react";

export function useHourMinute(initialHour = 0, initialMinute = 0) {
  const [hour, setHour] = useState(initialHour);
  const [minute, setMinute] = useState(initialMinute);

  // 2자리 문자열로 패딩
  const pad = (n: number) => n.toString().padStart(2, "0");
  const timeString = `${pad(hour)}:${pad(minute)}:00`;

  // setter에서 범위 제한
  const setHourSafe = (value: number) => setHour(Math.max(0, Math.min(23, value)));
  const setMinuteSafe = (value: number) => setMinute(Math.max(0, Math.min(59, value)));

  return {
    hour,
    setHour: setHourSafe,
    minute,
    setMinute: setMinuteSafe,
    timeString,
  };
}

// 시간 표기 유틸리티 함수들
export const formatTime = (timeString: string): string => {
  const [hourStr, minuteStr] = timeString.split(':');
  const hour = parseInt(hourStr) || 0;
  const minute = parseInt(minuteStr) || 0;
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

export const formatDuration = (timeString: string): string => {
  const [hourStr, minuteStr] = timeString.split(':');
  const hour = parseInt(hourStr) || 0;
  const minute = parseInt(minuteStr) || 0;
  
  if (hour === 0) {
    return `${minute}분`;
  } else if (minute === 0) {
    return `${hour}시간`;
  } else {
    return `${hour}시간 ${minute}분`;
  }
}; 