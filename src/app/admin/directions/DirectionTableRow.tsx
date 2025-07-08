'use client';
import { useRouter } from "next/navigation";
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
  departureTimes?: string[];
}

interface DirectionTableRowProps {
  direction: Direction;
  isEven: boolean;
}

export function DirectionTableRow({ direction }: DirectionTableRowProps) {
  return (
    <tr className="hover:bg-gray-50 transition duration-150">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {direction.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {direction.departureStop.transportType}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {direction.departureStop.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {direction.arrivalStop.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {direction.requiredTime}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {direction.fare.toLocaleString()}원
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {direction.departureTimes ? direction.departureTimes.length : 0}대
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <Link
            href={`/admin/directions/${direction.id}`}
            className="text-blue-600 hover:text-blue-900 font-medium transition duration-150"
          >
            편집
          </Link>
        </div>
      </td>
    </tr>
  );
}
