"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiSend } from "@/app/_lib/api";

const TRANSPORT_TYPES = ["BUS", "SUBWAY", "TRAIN"];

export function StopCreateForm() {
  const [name, setName] = useState("");
  const [transportType, setTransportType] = useState(TRANSPORT_TYPES[0]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await apiSend("/stops", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, transportType }),
    });
    setLoading(false);
    router.push("/stops");
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto bg-white p-6 rounded-xl shadow flex flex-col gap-6 mt-6">
      <div className="mb-2">
        <label htmlFor="name">이름</label>
        <input
          type="text"
          id="name"
          className="form-control border-black bg-slate-100 p-1 w-full"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>
      <div className="mb-2">
        <label htmlFor="transportType">종류</label>
        <select
          id="transportType"
          className="form-control border-black bg-slate-100 p-1 w-full"
          value={transportType}
          onChange={e => setTransportType(e.target.value)}
        >
          {TRANSPORT_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <button className="bg-cyan-100 py-2 px-4 rounded-lg min-w-[80px]" type="submit" disabled={loading}>추가</button>
        <Link href="/stops" className="bg-amber-100 py-2 px-4 rounded-lg text-center min-w-[80px]">취소</Link>
      </div>
    </form>
  );
}
