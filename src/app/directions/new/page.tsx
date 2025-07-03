import { apiFetch } from "@/app/_lib/api";
import { DirectionCreateForm } from "./DirectionCreateForm";

interface Stop {
  id: number;
  name: string;
  transportType: string;
}

export default async function Page() {
  const stops = await apiFetch<Stop[]>("/stops");
  return <DirectionCreateForm stops={stops} />;
}