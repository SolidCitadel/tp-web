import { apiFetch } from "@/app/_lib/api";
import { StopEditForm } from "./StopEditForm";

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
  return <StopEditForm stop={stop} />;
}