import { StopEditForm } from "./StopEditForm";
import { getServerApiClient } from "@/lib/api-server";

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
  const apiClient = await getServerApiClient();
  const { data: stop } = await apiClient<StopDetail>(`/api/admin/stops/${stopId}`);
  return <StopEditForm stop={stop} />;
}