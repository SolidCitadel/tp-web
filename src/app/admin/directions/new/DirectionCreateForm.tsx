'use client';
import { useState } from "react";
import Link from "next/link";
import axios from "axios";

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
  const [requiredTime, setRequiredTime] = useState("");
  const [fare, setFare] = useState(0);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await axios.post("/api/directions",{
        fare,
        requiredTime,
        departureStopId,
        arrivalStopId,
    });
    setLoading(false);
    window.location.href = "/directions";
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-4 rounded-xl shadow flex flex-col gap-4 mt-6">
      <div>
        <label htmlFor="departureStopId" className="block font-semibold mb-1">출발지</label>
        <select
          id="departureStopId"
          className="w-full border border-gray-300 rounded p-2 bg-slate-100"
          value={departureStopId}
          onChange={e => setDepartureStopId(Number(e.target.value))}
        >
          {stops.map(stop => (
            <option key={stop.id} value={stop.id}>{stop.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="arrivalStopId" className="block font-semibold mb-1">도착지</label>
        <select
          id="arrivalStopId"
          className="w-full border border-gray-300 rounded p-2 bg-slate-100"
          value={arrivalStopId}
          onChange={e => setArrivalStopId(Number(e.target.value))}
        >
          {stops.map(stop => (
            <option key={stop.id} value={stop.id}>{stop.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="requiredTime" className="block font-semibold mb-1">소요시간</label>
        <input
          type="time"
          id="requiredTime"
          className="w-full border border-gray-300 rounded p-2 bg-slate-100"
          value={requiredTime}
          onChange={e => setRequiredTime(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="fare" className="block font-semibold mb-1">요금</label>
        <input
          type="number"
          id="fare"
          className="w-full border border-gray-300 rounded p-2 bg-slate-100"
          value={fare}
          onChange={e => setFare(Number(e.target.value))}
        />
      </div>
      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          className="bg-cyan-100 py-2 px-4 rounded-lg font-semibold hover:bg-cyan-200 flex-1"
          disabled={loading}
        >
          추가
        </button>
        <Link
          href="/directions"
          className="bg-amber-100 py-2 px-4 rounded-lg font-semibold hover:bg-amber-200 flex-1 text-center"
        >
          취소
        </Link>
      </div>
    </form>
  );
}