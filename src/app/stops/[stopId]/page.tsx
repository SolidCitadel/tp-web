import { apiFetch } from "@/app/_lib/api";

interface StopDetail {
  id: number,
  name: string,
  transportType: string,
  departureDirectionIds: number[],
  arrivalDirectionIds: number[],
}

type Params = Promise<{stopId: string}>

export default async function Page({params}: { params: Params }) {
  const { stopId } = await params;
  const stop = await apiFetch<StopDetail>(`/stops/${stopId}`);

  return (
    <div className="flex flex-col items-start gap-4 w-full max-w-md px-4 py-10 md:px-8 mx-auto">
      <h2 className="text-2xl font-bold text-cyan-700 mb-2">{stop.name}</h2>
      <div className="flex flex-col gap-1 text-base w-full">
        <div>
          <span className="font-semibold text-gray-600">ID: </span>
          <span>{stop.id}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-600">유형: </span>
          <span>{stop.transportType}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-600">출발 노선 ID: </span>
          <span>{stop.departureDirectionIds.join(", ") || "없음"}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-600">도착 노선 ID: </span>
          <span>{stop.arrivalDirectionIds.join(", ") || "없음"}</span>
        </div>
      </div>
    </div>
  );
}