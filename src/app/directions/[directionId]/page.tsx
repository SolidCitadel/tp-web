import { apiFetch } from "@/app/_lib/api";
import { DirectionEditForm } from "./DirectionEditForm";

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
  const direction = await apiFetch<DirectionDetail>(`/directions/${directionId}`);
  const stops = await apiFetch<Stop[]>(`/stops`);
  return <DirectionEditForm direction={direction} stops={stops} />;
}