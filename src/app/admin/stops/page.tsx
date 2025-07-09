import { getServerApiClient } from "@/lib/api-server";
import { StopTableRow } from "./StopTableRow"; // Row 컴포넌트 import
import Link from "next/link";

interface Stop {
  id: number,
  name: string,
  transportType: string
}

export default async function Page(){
  const apiClient = await getServerApiClient();
  const response = await apiClient.get<Stop[]>('/api/admin/stops');
  const stops = response.data;

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">정류장 관리</h1>
          <Link 
            href="/admin/stops/new" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition duration-200 flex items-center gap-2"
          >
            <span>➕</span>
            정류장 추가
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    이름
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    유형
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stops.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <div className="text-4xl mb-2">🚏</div>
                        <p className="text-lg font-medium">정류장 정보가 없습니다</p>
                        <p className="text-sm">새로운 정류장을 추가해보세요</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  stops.map((stop, idx) => (
                    <StopTableRow
                      key={stop.id}
                      stop={stop}
                      isLast={idx === stops.length - 1}
                      isEven={idx % 2 === 0}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}