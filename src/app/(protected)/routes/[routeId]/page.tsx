'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Route, Direction, Segment } from '@/types/route';
import { formatTime, formatDuration } from '@/hooks/useHourMinute';
import SegmentModal from '@/components/SegmentModal';
import SegmentEditModal from '@/components/SegmentEditModal';
import axios from 'axios';

// 도착시간 계산 함수
const calculateArrivalTime = (departureTime: string, requiredTime: string): string => {
  const [depHour, depMinute] = departureTime.split(':').map(Number);
  const [reqHour, reqMinute] = requiredTime.split(':').map(Number);
  
  const totalMinutes = (depHour * 60 + depMinute) + (reqHour * 60 + reqMinute);
  const arrivalHour = Math.floor(totalMinutes / 60) % 24; // 24시간 형식으로 계산
  const arrivalMinute = totalMinutes % 60;
  
  return `${arrivalHour.toString().padStart(2, '0')}:${arrivalMinute.toString().padStart(2, '0')}:00`;
};

interface UpdateRouteRequest {
  name: string;
  segments: {
    id?: number; // 기존 segment 수정 시 포함, 새 segment 생성 시 생략
    directionId: number;
    departureTime: string;
  }[];
}

export default function RouteDetailPage() {
  const params = useParams();
  const routeId = params.routeId as string;
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [route, setRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);
  const [showSegmentModal, setShowSegmentModal] = useState(false);
  const [showSegmentEditModal, setShowSegmentEditModal] = useState(false);
  const [editingSegment, setEditingSegment] = useState<Segment | null>(null);
  const [deletingSegmentId, setDeletingSegmentId] = useState<number | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const fetchRoute = () => {
    if (!isLoading && user && routeId) {
      setLoading(true);
      axios.get(`/api/user/routes/${routeId}`)
        .then(res => {
          setRoute(res.data);
          setEditName(res.data.name);
        })
        .catch(() => setError('경로를 불러오지 못했습니다.'))
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    fetchRoute();
  }, [user, isLoading, routeId]);

  const handleSave = async () => {
    if (!editName.trim()) {
      alert('이름을 입력하세요.');
      return;
    }
    setSaving(true);
    try {
      // UpdateRouteRequest 타입 사용
      const payload: UpdateRouteRequest = {
        name: editName,
        segments: route?.segments.map(seg => ({
          id: seg.id > 999999999 ? undefined : seg.id, // 임시 ID는 제외
          directionId: seg.direction.id,
          departureTime: seg.departureTime
        })) ?? []
      };
      await axios.put(`/api/user/routes/${routeId}`, payload);
      
      // 저장 후 서버에서 최신 데이터 다시 가져오기
      fetchRoute();
      setIsEditing(false);
      setHasChanges(false);
    } catch {
      alert('수정에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  // 구간 추가
  const handleAddSegment = (direction: Direction, departureTime: string) => {
    // 임시 ID로 새로운 segment 생성 (실제 저장은 handleSave에서)
    const tempId = Date.now(); // 임시 ID
    const newSegment = {
      id: tempId,
      routeId: parseInt(routeId),
      direction: direction, // 실제 Direction 객체 사용
      departureTime
    };
    
    setRoute(prev => prev ? {
      ...prev,
      segments: [...prev.segments, newSegment]
    } : null);
    setHasChanges(true);
  };

  // 구간 수정
  const handleUpdateSegment = (updatedSegment: Segment) => {
    setRoute(prev => prev ? {
      ...prev,
      segments: prev.segments.map(seg => 
        seg.id === updatedSegment.id ? updatedSegment : seg
      )
    } : null);
    setHasChanges(true);
  };

  // 구간 수정 모달 열기
  const handleEditSegment = (segment: Segment) => {
    setEditingSegment(segment);
    setShowSegmentEditModal(true);
  };

  // 구간 삭제
  const handleDeleteSegment = (segmentId: number) => {
    if (!route || !segmentId) return;
    if (!window.confirm('정말 이 구간을 삭제하시겠습니까?')) return;
    setDeletingSegmentId(segmentId);
    setRoute(prev => prev ? {
      ...prev,
      segments: prev.segments.filter(seg => seg.id !== segmentId)
    } : null);
    setDeletingSegmentId(null);
    setHasChanges(true);
  };

  if (isLoading || loading) {
    return <div className="p-6">불러오는 중...</div>;
  }
  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }
  if (!route) {
    return <div className="p-6 text-red-500">경로를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">경로 상세</h1>
        <div className="flex gap-2">
          {hasChanges && (
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? '저장 중...' : '저장'}
            </button>
          )}
          <button
            className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium transition duration-200"
            onClick={() => router.push(`/plans/${route.planId}`)}
          >
            계획으로
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {isEditing ? (
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <input
                type="text"
                className="text-xl font-semibold text-gray-900 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={editName}
                onChange={e => {
                  setEditName(e.target.value);
                  setHasChanges(true);
                }}
                disabled={saving}
                autoFocus
              />
              <button
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm disabled:opacity-50"
                onClick={handleSave}
                disabled={saving}
              >
                확인
              </button>
              <button
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm"
                onClick={() => {
                  setIsEditing(false);
                  setEditName(route.name);
                  setHasChanges(false);
                }}
                disabled={saving}
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-6 flex items-center gap-2">
            <h2 className="text-xl font-semibold text-gray-900">{route.name}</h2>
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
          <h3 className="text-lg font-semibold text-gray-900">구간</h3>
          <button
            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium transition duration-200"
            onClick={() => setShowSegmentModal(true)}
          >
            + 구간 추가
          </button>
        </div>
        {route.segments.length === 0 ? (
          <p className="text-gray-500">등록된 구간이 없습니다.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="px-4 py-2 border">출발지</th>
                  <th className="px-4 py-2 border">출발시간</th>
                  <th className="px-4 py-2 border">도착지</th>
                  <th className="px-4 py-2 border">도착시간</th>
                  <th className="px-4 py-2 border">요금</th>
                  <th className="px-4 py-2 border">삭제</th>
                </tr>
              </thead>
              <tbody>
                {route.segments.map((segment) => (
                  <tr 
                    key={segment.id} 
                    className="text-center hover:bg-blue-50 transition-colors cursor-pointer"
                    onClick={() => handleEditSegment(segment)}
                  >
                    <td className="px-4 py-2 border">
                      {segment.direction.departureStop ? `${segment.direction.departureStop.name} (${segment.direction.departureStop.transportType})` : '정보 없음'}
                    </td>
                    <td className="px-4 py-2 border">
                      {segment.departureTime ? formatTime(segment.departureTime) : '정보 없음'}
                    </td>
                    <td className="px-4 py-2 border">
                      {segment.direction.arrivalStop ? `${segment.direction.arrivalStop.name} (${segment.direction.arrivalStop.transportType})` : '정보 없음'}
                    </td>
                    <td className="px-4 py-2 border">
                      {segment.departureTime && segment.direction.requiredTime 
                        ? formatTime(calculateArrivalTime(segment.departureTime, segment.direction.requiredTime))
                        : '정보 없음'}
                    </td>
                    <td className="px-4 py-2 border">
                      {segment.direction.fare != null ? `${segment.direction.fare}원` : '정보 없음'}
                    </td>
                    <td className="px-4 py-2 border">
                      <button
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSegment(segment.id);
                        }}
                        disabled={deletingSegmentId === segment.id}
                      >
                        {deletingSegmentId === segment.id ? '삭제 중...' : '삭제'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showSegmentModal && (
        <SegmentModal
          routeId={routeId}
          onClose={() => setShowSegmentModal(false)}
          onAddSegment={handleAddSegment}
        />
      )}

      {showSegmentEditModal && editingSegment && (
        <SegmentEditModal
          segment={editingSegment}
          onClose={() => {
            setShowSegmentEditModal(false);
            setEditingSegment(null);
          }}
          onUpdateSegment={handleUpdateSegment}
        />
      )}
    </div>
  );
}
