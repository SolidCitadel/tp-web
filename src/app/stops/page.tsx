import Link from "next/link";
import { apiFetch } from "../_lib/api";

interface Stop {
  id: number,
  name: string,
  transportType: string
}

export default async function Page(){
  const stops = await apiFetch<Stop[]>('/stops');

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 w-full px-4 md:px-8 py-8">
      <table className="w-full max-w-md mb-4 text-center rounded-xl bg-white shadow">
        <thead>
          <tr>
            <th className="bg-cyan-200 py-2 rounded-tl-xl">ID</th>
            <th className="bg-cyan-200 py-2">이름</th>
            <th className="bg-cyan-200 py-2 rounded-tr-xl">유형</th>
          </tr>
        </thead>
        <tbody>
          {stops.map((stop, idx) => (
            <Link href={`/stops/${stop.id}`} key={stop.id} legacyBehavior>
              <tr className={`cursor-pointer hover:bg-yellow-50 ${idx % 2 === 0 ? "bg-gray-50" : ""}`}>
                <td className={`${idx === stops.length - 1 ? "" : "border-b border-gray-200"} p-2`}>{stop.id}</td>
                <td className={`${idx === stops.length - 1 ? "" : "border-b border-gray-200"} p-2`}>{stop.name}</td>
                <td className={`${idx === stops.length - 1 ? "" : "border-b border-gray-200"} p-2`}>{stop.transportType}</td>
              </tr>
            </Link>
          ))}
        </tbody>
      </table>
      <button className="w-full max-w-md flex items-center justify-center gap-2 bg-cyan-500 text-white font-semibold py-3 px-8 rounded-xl shadow-md hover:bg-cyan-600 transition">
        <span>➕</span> 터미널 추가
      </button>
    </div>
  )
}