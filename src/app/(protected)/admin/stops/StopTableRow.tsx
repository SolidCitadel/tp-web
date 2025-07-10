'use client';
import Link from "next/link";

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

export function StopTableRow({ stop }: StopTableRowProps) {
  return (
    <tr className="hover:bg-gray-50 transition duration-150">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {stop.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {stop.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {stop.transportType}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <Link
            href={`/admin/stops/${stop.id}`}
            className="text-blue-600 hover:text-blue-900 font-medium transition duration-150"
          >
            편집
          </Link>
        </div>
      </td>
    </tr>
  );
}
