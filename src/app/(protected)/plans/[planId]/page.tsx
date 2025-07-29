'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Plan } from '@/types/plan';
import { formatTime } from '@/hooks/useHourMinute';
import axios from 'axios';

export default function PlanDetailPage() {
  const params = useParams();
  const planId = params.planId as string;
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingRouteId, setDeletingRouteId] = useState<number | null>(null);
  const [showRouteCreateModal, setShowRouteCreateModal] = useState(false);
  const [routeName, setRouteName] = useState('');

  useEffect(() => {
    if (!isLoading && user && planId) {
      axios.get(`/api/user/plans/${planId}`)
        .then(res => {
          setPlan(res.data);
          setEditName(res.data.name);
        })
        .catch(() => setError('계획을 불러오지 못했습니다.'))
        .finally(() => setLoading(false));
    }
  }, [user, isLoading, planId]);

  const handleSave = async () => {
    if (!editName.trim()) {
      alert('이름을 입력하세요.');
      return;
    }
    setSaving(true);
    try {
      await axios.patch(`/api/user/plans/${planId}`, { name: editName });
      setPlan(prev => prev ? { ...prev, name: editName } : null);
      setIsEditing(false);
    } catch {
      alert('수정에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  // Route 추가
  const handleCreateRoute = async () => {
    if (!routeName.trim()) {
      alert('경로 이름을 입력하세요.');
      return;
    }
    setSaving(true);
    try {
      const response = await axios.post(`/api/user/plans/${planId}/routes`, { name: routeName });
      setPlan(prev => prev ? {
        ...prev,
        routes: [...prev.routes, response.data]
      } : null);
      setShowRouteCreateModal(false);
      setRouteName('');
    } catch {
      alert('경로 추가에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  // Route 삭제
  const handleDeleteRoute = async (routeId: number, routeName: string) => {
    if (!window.confirm(`정말 "${routeName}" 경로를 삭제하시겠습니까?\n경로에 포함된 모든 구간도 함께 삭제됩니다.`)) return;
    setDeletingRouteId(routeId);
    try {
      await axios.delete(`/api/user/routes/${routeId}`);
      setPlan(prev => prev ? {
        ...prev,
        routes: prev.routes.filter(route => route.id !== routeId)
      } : null);
    } catch {
      alert('경로 삭제에 실패했습니다.');
    } finally {
      setDeletingRouteId(null);
    }
  };

  if (isLoading || loading) {
    return <div className="p-6">불러오는 중...</div>;
  }
  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }
  if (!plan) {
    return <div className="p-6 text-red-500">계획을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">계획 상세</h1>
        <button
          className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium transition duration-200"
          onClick={() => router.push('/plans')}
        >
          목록으로
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {isEditing ? (
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <input
                type="text"
                className="text-xl font-semibold text-gray-900 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                disabled={saving}
                autoFocus
              />
              <button
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm disabled:opacity-50"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? '저장 중...' : '저장'}
              </button>
              <button
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm"
                onClick={() => {
                  setIsEditing(false);
                  setEditName(plan.name);
                }}
                disabled={saving}
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-6 flex items-center gap-2">
            <h2 className="text-xl font-semibold text-gray-900">{plan.name}</h2>
            <button
              className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition duration-200"
              onClick={() => setIsEditing(true)}
              title="수정"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">경로</h3>
          <button
            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium transition duration-200"
            onClick={() => setShowRouteCreateModal(true)}
          >
            + 경로 추가
          </button>
        </div>
        {plan.routes.length === 0 ? (
          <p className="text-gray-500">등록된 경로가 없습니다.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="px-4 py-2 border">이름</th>
                  <th className="px-4 py-2 border">출발지</th>
                  <th className="px-4 py-2 border">출발시간</th>
                  <th className="px-4 py-2 border">도착지</th>
                  <th className="px-4 py-2 border">도착시간</th>
                  <th className="px-4 py-2 border">요금</th>
                  <th className="px-4 py-2 border">삭제</th>
                </tr>
              </thead>
              <tbody>
                {plan.routes.map((route) => (
                  <tr 
                    key={route.id} 
                    className="text-center hover:bg-blue-50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/routes/${route.id}`)}
                  >
                    <td className="px-4 py-2 border">
                      {route.name != null ? `${route.name}` : '정보 없음'}
                    </td>
                    <td className="px-4 py-2 border">
                      {route.departureStop ? `${route.departureStop.name} (${route.departureStop.transportType})` : '정보 없음'}
                    </td>
                    <td className="px-4 py-2 border">
                      {route.departureTime ? formatTime(route.departureTime) : '정보 없음'}
                    </td>
                    <td className="px-4 py-2 border">
                      {route.arrivalStop ? `${route.arrivalStop.name} (${route.arrivalStop.transportType})` : '정보 없음'}
                    </td>
                    <td className="px-4 py-2 border">
                      {route.arrivalTime ? formatTime(route.arrivalTime) : '정보 없음'}
                    </td>
                    <td className="px-4 py-2 border">
                      {route.fare != null ? `${route.fare}원` : '정보 없음'}
                    </td>
                    <td className="px-4 py-2 border">
                      <button
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRoute(route.id, route.name);
                        }}
                        disabled={deletingRouteId === route.id}
                      >
                        {deletingRouteId === route.id ? '삭제 중...' : '삭제'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Route 추가 모달 */}
      {showRouteCreateModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">경로 추가</h3>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => {
                  setShowRouteCreateModal(false);
                  setRouteName('');
                }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">경로 이름</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={routeName}
                onChange={(e) => setRouteName(e.target.value)}
                placeholder="경로 이름을 입력하세요"
                autoFocus
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                onClick={() => {
                  setShowRouteCreateModal(false);
                  setRouteName('');
                }}
                disabled={saving}
              >
                취소
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                onClick={handleCreateRoute}
                disabled={saving || !routeName.trim()}
              >
                {saving ? '추가 중...' : '추가'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}