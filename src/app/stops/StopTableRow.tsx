'use client';
import { useRouter } from "next/navigation";

interface Stop {
  id: number;
  name: string;
  transportType: string;
}

interface StopTableRowProps {
  stop: Stop;
  isLast: boolean;
  isEven: boolean;
}

export function StopTableRow({ stop, isLast, isEven }: StopTableRowProps) {
  const router = useRouter();

  return (
    <tr
      className={`cursor-pointer hover:bg-yellow-50 ${isEven ? "bg-gray-50" : ""}`}
      onClick={() => router.push(`/stops/${stop.id}`)}
    >
      <td className={`${isLast ? "" : "border-b border-gray-200"} p-2`}>{stop.id}</td>
      <td className={`${isLast ? "" : "border-b border-gray-200"} p-2`}>{stop.name}</td>
      <td className={`${isLast ? "" : "border-b border-gray-200"} p-2`}>{stop.transportType}</td>
    </tr>
  );
}
