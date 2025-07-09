import { DirectionEditForm } from "./DirectionEditForm";
import { getServerApiClient } from "@/lib/api-server";

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

type Params = Promise<{ directionId: string }>;

export default async function Page({ params }: { params: Params }) {
  const { directionId } = await params;
  const apiClient = await getServerApiClient();
  const { data: direction } = await apiClient<DirectionDetail>(`/api/admin/directions/${directionId}`);
  const { data: stops } = await apiClient<Stop[]>(`/api/admin/stops`);
  return <DirectionEditForm direction={direction} stops={stops} />;
}