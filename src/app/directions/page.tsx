import { apiFetch } from "../_lib/api";
import { DirectionTableRow } from "./DirectionTableRow";
import Link from "next/link";

interface Stop {
  id: number;
  name: string;
  transportType: string;
}

interface Direction {
  id: number;
  fare: number;
  requiredTime: string;
  departureStop: Stop;
  arrivalStop: Stop;
  departureTimes?: string[]; // departureTimes가 있을 경우를 대비
}

export default async function Page() {
  const directions = await apiFetch<Direction[]>("/directions");

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 w-full px-4 md:px-8 py-8">
      <table className="w-full max-w-2xl mb-4 text-center rounded-xl bg-white shadow">
        <thead>
          <tr>
            <th className="bg-cyan-200 py-2 rounded-tl-xl">ID</th>
            <th className="bg-cyan-200 py-2">유형</th>
            <th className="bg-cyan-200 py-2">출발</th>
            <th className="bg-cyan-200 py-2">도착</th>
            <th className="bg-cyan-200 py-2">소요시간</th>
            <th className="bg-cyan-200 py-2">요금</th>
            <th className="bg-cyan-200 py-2 rounded-tr-xl">대수</th>
          </tr>
        </thead>
        <tbody>
          {directions.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-6 text-gray-400">노선 정보가 없습니다.</td>
            </tr>
          ) : (
            directions.map((direction, idx) => (
              <DirectionTableRow
                key={direction.id}
                direction={direction}
                isEven={idx % 2 === 0}
              />
            ))
          )}
        </tbody>
      </table>
      <Link
        href="/directions/new"
        className="w-full max-w-2xl flex items-center justify-center gap-2 bg-cyan-500 text-white font-semibold py-3 px-8 rounded-xl shadow-md hover:bg-cyan-600 transition"
      >
        <span>➕</span> 노선 추가
      </Link>
    </div>
  );
}