'use client';
import { useRouter } from "next/navigation";

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
  departureTimes?: string[];
}

interface DirectionTableRowProps {
  direction: Direction;
  isEven: boolean;
}

export function DirectionTableRow({ direction, isEven }: DirectionTableRowProps) {
  const router = useRouter();
  return (
    <tr
      className={`cursor-pointer hover:bg-yellow-50 ${isEven ? "bg-gray-50" : ""}`}
      onClick={() => router.push(`/directions/${direction.id}`)}
    >
      <td className={`p-2 border-b border-gray-200`}>{direction.id}</td>
      <td className={`p-2 border-b border-gray-200`}>{direction.departureStop.transportType}</td>
      <td className={`p-2 border-b border-gray-200`}>{direction.departureStop.name}</td>
      <td className={`p-2 border-b border-gray-200`}>{direction.arrivalStop.name}</td>
      <td className={`p-2 border-b border-gray-200`}>{direction.requiredTime}</td>
      <td className={`p-2 border-b border-gray-200`}>{direction.fare.toLocaleString()}</td>
      <td className={`p-2 border-b border-gray-200`}>
        <span>
          {direction.departureTimes ? direction.departureTimes.length : 0}
        </span>
      </td>
    </tr>
  );
}
