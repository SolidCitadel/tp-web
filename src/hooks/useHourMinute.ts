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