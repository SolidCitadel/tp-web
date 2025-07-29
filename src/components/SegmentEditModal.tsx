'use client';

import React, { useState, useEffect } from 'react';
import { Segment, Direction, DirectionListItem, Stop } from '@/types/route';
import { formatDuration, formatTime } from '@/hooks/useHourMinute';
import axios from 'axios';

interface SegmentEditModalProps {
  segment: Segment;
  onClose: () => void;
  onUpdateSegment: (updatedSegment: Segment) => void;
}

export default function SegmentEditModal({ segment, onClose, onUpdateSegment }: SegmentEditModalProps) {
  const [stops, setStops] = useState<Stop[]>([]);
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [directions, setDirections] = useState<DirectionListItem[]>([]);
  const [selectedDirectionId, setSelectedDirectionId] = useState<number>(segment.direction.id);
  const [selectedDirection, setSelectedDirection] = useState<Direction | null>(segment.direction);
  const [departureTime, setDepartureTime] = useState(segment.departureTime);
  const [loading, setLoading] = useState(false);

  // 초기 설정: 현재 segment의 출발지로 설정
  useEffect(() => {
    if (segment.direction.departureStop) {
      setSelectedStop(segment.direction.departureStop);
    }
  }, [segment]);

  // 정류장 목록 조회
  useEffect(() => {
    axios.get('/api/user/stops')
      .then(res => setStops(res.data))
      .catch(() => alert('정류장 목록을 불러오지 못했습니다.'));
  }, []);

  // 선택된 정류장의 방향 목록 조회
  useEffect(() => {
    if (selectedStop) {
      setLoading(true);
      axios.get(`/api/user/directions?departureStopId=${selectedStop.id}`)
        .then(res => {
          setDirections(res.data);
          // 현재 선택된 방향이 목록에 있는지 확인
          const currentDirection = res.data.find((dir: DirectionListItem) => dir.id === selectedDirectionId);
          if (!currentDirection) {
            setSelectedDirectionId(res.data[0]?.id || 0);
          }
        })
        .catch(() => alert('방향 목록을 불러오지 못했습니다.'))
        .finally(() => setLoading(false));
    }
  }, [selectedStop]);

  // 선택된 방향의 상세 정보 조회 (departureTimes 포함)
  useEffect(() => {
    if (selectedDirectionId) {
      axios.get(`/api/user/directions/${selectedDirectionId}`)
        .then(res => {
          setSelectedDirection(res.data);
          // 현재 departure time이 새로운 direction의 departureTimes에 있는지 확인
          const newDirection: Direction = res.data;
          if (!newDirection.departureTimes.includes(departureTime)) {
            setDepartureTime(newDirection.departureTimes[0] || '');
          }
        })
        .catch(() => alert('방향 상세 정보를 불러오지 못했습니다.'));
    }
  }, [selectedDirectionId]);

  const handleConfirm = () => {
    if (!selectedDirectionId || !departureTime || !selectedDirection) {
      alert('모든 정보를 입력하세요.');
      return;
    }

    // 업데이트된 segment 객체 생성 (API 호출 없이 로컬 상태만 업데이트)
    const updatedSegment: Segment = {
      ...segment,
      direction: selectedDirection,
      departureTime: departureTime
    };

    onUpdateSegment(updatedSegment);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">구간 수정</h3>
          <button
            className="text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {/* 출발지 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">출발지</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedStop?.id || ''}
              onChange={(e) => {
                const stopId = parseInt(e.target.value);
                const stop = stops.find(s => s.id === stopId);
                setSelectedStop(stop || null);
                setSelectedDirectionId(0); // 방향 초기화
              }}
            >
              <option value="">출발지를 선택하세요</option>
              {stops.map(stop => (
                <option key={stop.id} value={stop.id}>
                  {stop.name} ({stop.transportType})
                </option>
              ))}
            </select>
          </div>

          {/* 방향 선택 */}
          {selectedStop && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">방향</label>
              {loading ? (
                <div className="text-gray-500">방향 목록을 불러오는 중...</div>
              ) : directions.length === 0 ? (
                <div className="text-gray-500">선택 가능한 방향이 없습니다.</div>
              ) : (
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedDirectionId}
                  onChange={(e) => setSelectedDirectionId(parseInt(e.target.value))}
                >
                  <option value="">방향을 선택하세요</option>
                  {directions.map(direction => (
                    <option key={direction.id} value={direction.id}>
                      → {direction.arrivalStop.name} ({direction.arrivalStop.transportType}) 
                      - {direction.fare}원, {formatDuration(direction.requiredTime)}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* 출발시간 선택 */}
          {selectedDirection && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">출발시간</label>
              {selectedDirection.departureTimes.length === 0 ? (
                <div className="text-gray-500">선택 가능한 출발시간이 없습니다.</div>
              ) : (
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                >
                  <option value="">출발시간을 선택하세요</option>
                  {selectedDirection.departureTimes.map(time => (
                    <option key={time} value={time}>
                      {formatTime(time)}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-end mt-6">
          <button
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            onClick={handleConfirm}
            disabled={!selectedDirectionId || !departureTime}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
