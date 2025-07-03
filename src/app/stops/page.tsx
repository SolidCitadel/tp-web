import { apiFetch } from "../_lib/api";
import { StopTableRow } from "./StopTableRow"; // Row 컴포넌트 import
import Link from "next/link";

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
            <StopTableRow
              key={stop.id}
              stop={stop}
              isLast={idx === stops.length - 1}
              isEven={idx % 2 === 0}
            />
          ))}
        </tbody>
      </table>
      <Link href="/stops/new" className="w-full max-w-md flex items-center justify-center gap-2 bg-cyan-500 text-white font-semibold py-3 px-8 rounded-xl shadow-md hover:bg-cyan-600 transition">
        <span>➕</span> 터미널 추가
      </Link>
    </div>
  )
}