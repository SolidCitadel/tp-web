'use client';
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DepartureTimesModal from "./DepartureTimesModal";
import axios from "axios";
import { useHourMinute } from "@/hooks/useHourMinute";

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

export function DirectionEditForm({ direction, stops }: { direction: DirectionDetail; stops: Stop[] }) {
  const router = useRouter();
  const [departureStopId, setDepartureStopId] = useState(direction.departureStop.id);
  const [arrivalStopId, setArrivalStopId] = useState(direction.arrivalStop.id);
  const [fare, setFare] = useState(direction.fare);
  const [loading, setLoading] = useState(false);
  // useHourMinute 훅 사용 (초기값 파싱)
  const [initHour, initMinute] = direction.requiredTime.split(":").map(Number);
  const { hour, setHour, minute, setMinute, timeString } = useHourMinute(initHour, initMinute);
  // 출발 시간표 모달 상태 및 시간표 상태 추가
  const [modalOpen, setModalOpen] = useState(false);
  const [departureTimes, setDepartureTimes] = useState<string[]>(direction.departureTimes);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await axios.put(`/api/directions/${direction.id}`, {
      fare,
      requiredTime: timeString,
      departureStopId,
      arrivalStopId,
    });
    setLoading(false);
    router.push("/admin/directions");
  }

  async function handleDelete() {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    setLoading(true);
    await axios.delete(`/api/directions/${direction.id}`);
    setLoading(false);
    router.push("/admin/directions");
  }

  // 시간표 저장 핸들러
  async function handleSaveDepartureTimes(times: string[]) {
    setLoading(true);
    await axios.put(`/api/directions/${direction.id}/departure-times`, times);
    setDepartureTimes(times);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              노선 상세정보
            </h2>
            <p className="text-gray-600 mt-2">노선 정보를 수정하거나 삭제할 수 있습니다</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ID 표시 */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700">노선 ID</span>
                <span className="text-2xl font-bold text-green-600">{direction.id}</span>
              </div>
            </div>

            {/* 출발지 선택 */}
            <div className="space-y-2">
              <label htmlFor="departureStopId" className="block text-sm font-semibold text-gray-700 flex items-center">
                <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                출발지
              </label>
              <select
                id="departureStopId"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                value={departureStopId}
                onChange={e => setDepartureStopId(Number(e.target.value))}
              >
                {stops.map(stop => (
                  <option key={stop.id} value={stop.id}>{stop.name} ({stop.transportType})</option>
                ))}
              </select>
            </div>

            {/* 도착지 선택 */}
            <div className="space-y-2">
              <label htmlFor="arrivalStopId" className="block text-sm font-semibold text-gray-700 flex items-center">
                <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                도착지
              </label>
              <select
                id="arrivalStopId"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                value={arrivalStopId}
                onChange={e => setArrivalStopId(Number(e.target.value))}
              >
                {stops.map(stop => (
                  <option key={stop.id} value={stop.id}>{stop.name} ({stop.transportType})</option>
                ))}
              </select>
            </div>

            {/* 소요시간과 요금 */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  소요시간
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    min={0}
                    max={23}
                    value={hour}
                    onChange={e => setHour(Number(e.target.value))}
                    className="w-20 px-4 py-3 border border-gray-300 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-center"
                    aria-label="시"
                  />
                  <span className="self-center">시</span>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={minute}
                    onChange={e => setMinute(Number(e.target.value))}
                    className="w-20 px-4 py-3 border border-gray-300 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-center"
                    aria-label="분"
                  />
                  <span className="self-center">분</span>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="fare" className="block text-sm font-semibold text-gray-700 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  요금 (원)
                </label>
                <input
                  type="number"
                  id="fare"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  value={fare}
                  onChange={e => setFare(Number(e.target.value))}
                  placeholder="요금을 입력하세요"
                />
              </div>
            </div>

            {/* 출발 시간 정보 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  출발 시간표
                </h3>
                <button
                  type="button"
                  className="ml-2 px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 text-sm font-medium"
                  onClick={() => setModalOpen(true)}
                  disabled={loading}
                >
                  출발 시간표 수정
                </button>
              </div>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
                {departureTimes.length > 0 ? (
                  <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
                    {departureTimes.map((time, index) => (
                      <span key={index} className="px-3 py-2 bg-indigo-100 text-indigo-800 rounded-lg text-sm font-medium text-center">
                        {time.slice(0, 5)}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    등록된 출발 시간이 없습니다
                  </div>
                )}
              </div>
            </div>

            {/* 버튼 그룹 */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
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
                href="/admin/directions"
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
      {/* 출발 시간표 모달 */}
      <DepartureTimesModal
        open={modalOpen}
        initialTimes={departureTimes}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveDepartureTimes}
      />
    </div>
  );
}
