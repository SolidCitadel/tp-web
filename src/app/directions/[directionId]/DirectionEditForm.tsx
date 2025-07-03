'use client';
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiSend } from "@/app/_lib/api";

interface Stop {
  id: number;
  name: string;
  transportType: string;
}

interface DirectionDetail {
  id: number;
  fare: number;
  requiredTime: string;
  departureStop: Stop;
  arrivalStop: Stop;
  departureTimes: string[];
}

export function DirectionEditForm({ direction, stops }: { direction: DirectionDetail; stops: Stop[] }) {
  const router = useRouter();
  const [departureStopId, setDepartureStopId] = useState(direction.departureStop.id);
  const [arrivalStopId, setArrivalStopId] = useState(direction.arrivalStop.id);
  const [requiredTime, setRequiredTime] = useState(direction.requiredTime);
  const [fare, setFare] = useState(direction.fare);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await apiSend(`/directions/${direction.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fare,
        requiredTime,
        departureStopId,
        arrivalStopId,
      }),
    });
    setLoading(false);
    router.push("/directions");
  }

  async function handleDelete() {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    setLoading(true);
    await apiSend(`/directions/${direction.id}`, { method: "DELETE" });
    setLoading(false);
    router.push("/directions");
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
          className="bg-green-100 py-2 px-4 rounded-lg font-semibold hover:bg-green-200 flex-1"
          disabled={loading}
        >
          수정
        </button>
        <button
          type="button"
          className="bg-red-100 py-2 px-4 rounded-lg font-semibold hover:bg-red-200 flex-1"
          onClick={handleDelete}
          disabled={loading}
        >
          삭제
        </button>
        <Link
          href="/directions"
          className="bg-amber-100 py-2 px-4 rounded-lg font-semibold hover:bg-amber-200 flex-1 text-center"
        >
          목록
        </Link>
      </div>
    </form>
  );
}
