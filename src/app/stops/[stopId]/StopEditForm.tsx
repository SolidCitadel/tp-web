'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiSend } from "@/app/_lib/api";

interface StopDetail {
  id: number;
  name: string;
  transportType: string;
  departureDirectionIds: number[];
  arrivalDirectionIds: number[];
}

interface StopEditFormProps {
  stop: StopDetail;
}

export function StopEditForm({ stop }: StopEditFormProps) {
  const router = useRouter();
  const [name, setName] = useState(stop.name);
  const [transportType, setTransportType] = useState(stop.transportType);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await apiSend(`/stops/${stop.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, transportType }),
    });
    setLoading(false);
    router.push("/stops");
  }

  async function handleDelete() {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    setLoading(true);
    await apiSend(`/stops/${stop.id}`, { method: "DELETE" });
    setLoading(false);
    router.push("/stops");
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto bg-white p-6 rounded-xl shadow flex flex-col gap-6 mt-6">
      <h2 className="text-2xl font-bold text-cyan-700 mb-2">정류장 상세정보</h2>
      <div className="flex flex-col gap-4 text-base">
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-gray-600">ID: <span className="font-normal text-gray-800">{stop.id}</span></span>
        </div>
        <div>
          <label htmlFor="name" className="block font-semibold mb-1 mt-2">이름</label>
          <input
            type="text"
            id="name"
            className="w-full border border-gray-300 rounded p-2 bg-slate-100"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="transportType" className="block font-semibold mb-1">종류</label>
          <select
            id="transportType"
            className="w-full border border-gray-300 rounded p-2 bg-slate-100"
            value={transportType}
            onChange={e => setTransportType(e.target.value)}
          >
            <option value={transportType}>{transportType}</option>
            {/* 필요시 다른 옵션 추가 가능 */}
          </select>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mt-2">
        <div className="flex-1">
          <div className="font-semibold text-gray-600 mb-1">출발 노선</div>
          <ul className="bg-gray-50 rounded border border-gray-200 p-2 min-h-[40px]">
            {stop.departureDirectionIds.length > 0 ? (
              stop.departureDirectionIds.map(id => (
                <li key={id} className="text-gray-800">{id}</li>
              ))
            ) : (
              <li className="text-gray-400">없음</li>
            )}
          </ul>
        </div>
        <div className="flex-1">
          <div className="font-semibold text-gray-600 mb-1">도착 노선</div>
          <ul className="bg-gray-50 rounded border border-gray-200 p-2 min-h-[40px]">
            {stop.arrivalDirectionIds.length > 0 ? (
              stop.arrivalDirectionIds.map(id => (
                <li key={id} className="text-gray-800">{id}</li>
              ))
            ) : (
              <li className="text-gray-400">없음</li>
            )}
          </ul>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          className="bg-cyan-100 py-2 px-4 rounded-lg font-semibold hover:bg-cyan-200 flex-1"
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
          href="/stops"
          className="bg-amber-100 py-2 px-4 rounded-lg font-semibold hover:bg-amber-200 flex-1 text-center"
        >
          목록
        </Link>
      </div>
    </form>
  );
} 