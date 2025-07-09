"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

const TRANSPORT_TYPES = ["BUS", "SUBWAY", "TRAIN"];

export function StopCreateForm() {
  const [name, setName] = useState("");
  const [transportType, setTransportType] = useState(TRANSPORT_TYPES[0]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await axios.post("/api/admin/stops", {
      name,
      transportType,
    });
    setLoading(false);
    router.push("/admin/stops");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl flex flex-col gap-8 mt-10 border border-slate-200"
    >
      <div className="mb-2 flex flex-col gap-2">
        <label htmlFor="name" className="font-semibold text-slate-700">이름</label>
        <input
          type="text"
          id="name"
          className="form-control rounded-lg border border-slate-300 bg-slate-50 p-3 w-full focus:outline-none focus:ring-2 focus:ring-cyan-300 transition placeholder:text-slate-400 text-base shadow-sm"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          placeholder="정류장 이름을 입력하세요"
        />
      </div>
      <div className="mb-2 flex flex-col gap-2">
        <label htmlFor="transportType" className="font-semibold text-slate-700">종류</label>
        <select
          id="transportType"
          className="form-control rounded-lg border border-slate-300 bg-slate-50 p-3 w-full focus:outline-none focus:ring-2 focus:ring-cyan-300 transition text-base shadow-sm"
          value={transportType}
          onChange={e => setTransportType(e.target.value)}
        >
          {TRANSPORT_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-3 justify-end">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed"
          type="submit"
          disabled={loading}
        >
          {loading ? "추가 중..." : "추가"}
        </button>
        <Link
          href="/admin/stops"
          className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2 px-6 rounded-lg shadow-md transition text-center min-w-[80px] flex items-center justify-center"
        >
          취소
        </Link>
      </div>
    </form>
  );
}
