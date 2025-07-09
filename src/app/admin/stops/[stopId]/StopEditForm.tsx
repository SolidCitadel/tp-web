'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

interface StopDetail {
  id: number;
  name: string;
  transportType: string;
  departureDirectionIds: number[];
  arrivalDirectionIds: number[];
}

interface StopEditFormProps {
  stop: StopDetail;
}

export function StopEditForm({ stop }: StopEditFormProps) {
  const router = useRouter();
  const [name, setName] = useState(stop.name);
  const [transportType, setTransportType] = useState(stop.transportType);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await axios.put(`/api/admin/stops/${stop.id}`, {
      name,
      transportType
    });
    setLoading(false);
    router.push("/admin/stops");
  }

  async function handleDelete() {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    setLoading(true);
    await axios.delete(`/api/admin/stops/${stop.id}`);
    setLoading(false);
    router.push("/admin/stops");
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              정류장 상세정보
            </h2>
            <p className="text-gray-600 mt-2">정류장 정보를 수정하거나 삭제할 수 있습니다</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ID 표시 */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700">정류장 ID</span>
                <span className="text-2xl font-bold text-cyan-600">{stop.id}</span>
              </div>
            </div>

            {/* 이름 입력 */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                정류장 이름
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="정류장 이름을 입력하세요"
              />
            </div>

            {/* 교통수단 종류 */}
            <div className="space-y-2">
              <label htmlFor="transportType" className="block text-sm font-semibold text-gray-700">
                교통수단 종류
              </label>
              <select
                id="transportType"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                value={transportType}
                onChange={e => setTransportType(e.target.value)}
              >
                <option value="버스">버스</option>
                <option value="지하철">지하철</option>
                <option value="전철">전철</option>
                <option value="버스정류장">버스정류장</option>
                <option value="지하철역">지하철역</option>
              </select>
            </div>

            {/* 노선 정보 */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  출발 노선
                </h3>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200 min-h-[80px]">
                  {stop.departureDirectionIds.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {stop.departureDirectionIds.map(id => (
                        <span key={id} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          {id}번
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      등록된 출발 노선이 없습니다
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  도착 노선
                </h3>
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200 min-h-[80px]">
                  {stop.arrivalDirectionIds.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {stop.arrivalDirectionIds.map(id => (
                        <span key={id} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {id}번
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      등록된 도착 노선이 없습니다
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 버튼 그룹 */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    처리중...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    수정하기
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-red-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                삭제하기
              </button>
              
              <Link
                href="/admin/stops"
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                목록으로
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 