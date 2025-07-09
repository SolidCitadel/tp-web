'use client';
import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useHourMinute } from "@/hooks/useHourMinute";

interface Stop {
  id: number;
  name: string;
  transportType: string;
}

interface DirectionCreateFormProps {
  stops: Stop[];
}

/*
{
    fare: number,
    requiredTime: string,
    departureStopId: number,
    arrivalStopId: number
}
*/

export function DirectionCreateForm({ stops }: DirectionCreateFormProps) {
  const [departureStopId, setDepartureStopId] = useState(stops[0]?.id ?? 0);
  const [arrivalStopId, setArrivalStopId] = useState(stops[0]?.id ?? 0);
  const [fare, setFare] = useState(0);
  const [loading, setLoading] = useState(false);

  const { hour, setHour, minute, setMinute, timeString } = useHourMinute();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await axios.post("/api/directions",{
        fare,
        requiredTime: timeString,
        departureStopId,
        arrivalStopId,
    });
    setLoading(false);
    window.location.href = "/admin/directions";
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl flex flex-col gap-8 mt-10 border border-slate-200"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="departureStopId" className="font-semibold text-slate-700">출발지</label>
        <select
          id="departureStopId"
          className="form-control rounded-lg border border-slate-300 bg-slate-50 p-3 w-full focus:outline-none focus:ring-2 focus:ring-cyan-300 transition text-base shadow-sm"
          value={departureStopId}
          onChange={e => setDepartureStopId(Number(e.target.value))}
        >
          {stops.map(stop => (
            <option key={stop.id} value={stop.id}>{stop.name}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="arrivalStopId" className="font-semibold text-slate-700">도착지</label>
        <select
          id="arrivalStopId"
          className="form-control rounded-lg border border-slate-300 bg-slate-50 p-3 w-full focus:outline-none focus:ring-2 focus:ring-cyan-300 transition text-base shadow-sm"
          value={arrivalStopId}
          onChange={e => setArrivalStopId(Number(e.target.value))}
        >
          {stops.map(stop => (
            <option key={stop.id} value={stop.id}>{stop.name}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-semibold text-slate-700">소요시간</label>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            min={0}
            max={23}
            value={hour}
            onChange={e => setHour(Number(e.target.value))}
            className="form-control rounded-lg border border-slate-300 bg-slate-50 p-3 w-20 focus:outline-none focus:ring-2 focus:ring-cyan-300 transition text-base shadow-sm text-center"
            required
          />
          <span className="text-slate-600">시</span>
          <input
            type="number"
            min={0}
            max={59}
            value={minute}
            onChange={e => setMinute(Number(e.target.value))}
            className="form-control rounded-lg border border-slate-300 bg-slate-50 p-3 w-20 focus:outline-none focus:ring-2 focus:ring-cyan-300 transition text-base shadow-sm text-center"
            required
          />
          <span className="text-slate-600">분</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="fare" className="font-semibold text-slate-700">요금</label>
        <input
          type="number"
          id="fare"
          className="form-control rounded-lg border border-slate-300 bg-slate-50 p-3 w-full focus:outline-none focus:ring-2 focus:ring-cyan-300 transition text-base shadow-sm"
          value={fare}
          onChange={e => setFare(Number(e.target.value))}
          min={0}
          required
        />
      </div>
      <div className="flex gap-3 justify-end">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "추가 중..." : "추가"}
        </button>
        <Link
          href="/admin/directions"
          className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2 px-6 rounded-lg shadow-md transition text-center min-w-[80px] flex items-center justify-center"
        >
          취소
        </Link>
      </div>
    </form>
  );
}