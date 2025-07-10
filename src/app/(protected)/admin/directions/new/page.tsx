import { DirectionCreateForm } from "./DirectionCreateForm";
import { getServerApiClient } from "@/lib/api-server";

interface Stop {
  id: number;
  name: string;
  transportType: string;
}

export default async function Page() {
  const apiClient = await getServerApiClient();
  const { data: stops } = await apiClient<Stop[]>("/api/admin/stops");
  return <DirectionCreateForm stops={stops} />;
}