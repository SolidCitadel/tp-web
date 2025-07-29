'use client';

import React, { useEffect, useState } from 'react';
import { Stop, Direction, DirectionListItem, createSegmentForm } from '@/types/route';
import { formatDuration } from '@/hooks/useHourMinute';
import axios from 'axios';

interface SegmentModalProps {
  routeId: string;
  onClose: () => void;
  onAddSegment: (direction: Direction, departureTime: string) => void;
}

type Step = 1 | 2 | 3;

export default function SegmentModal({ routeId, onClose, onAddSegment }: SegmentModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [stops, setStops] = useState<Stop[]>([]);
  const [directions, setDirections] = useState<DirectionListItem[]>([]);
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [selectedDirection, setSelectedDirection] = useState<Direction | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1단계: 출발지 목록 조회
  useEffect(() => {
    if (currentStep === 1) {
      setLoading(true);
      axios.get('/api/user/stops')
        .then(res => setStops(res.data))
        .catch(() => setError('출발지 목록을 불러오지 못했습니다.'))
        .finally(() => setLoading(false));
    }
  }, [currentStep]);

  // 2단계: Direction 목록 조회
  useEffect(() => {
    if (currentStep === 2 && selectedStop) {
      setLoading(true);
      axios.get(`/api/user/directions?departureStopId=${selectedStop.id}`)
        .then(res => setDirections(res.data))
        .catch(() => setError('경로 목록을 불러오지 못했습니다.'))
        .finally(() => setLoading(false));
    }
  }, [currentStep, selectedStop]);

  const handleStopSelect = (stop: Stop) => {
    setSelectedStop(stop);
    setCurrentStep(2);
    setError(null);
  };

  const handleDirectionSelect = async (direction: DirectionListItem) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/user/directions/${direction.id}`);
      setSelectedDirection(response.data);
      setCurrentStep(3);
      setError(null);
    } catch {
      setError('경로 상세 정보를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 제출
  const handleSubmit = () => {
    if (!selectedDirection || !selectedTime) {
      setError('모든 항목을 선택해주세요.');
      return;
    }

    // POST 요청 대신 parent component의 state 업데이트
    onAddSegment(selectedDirection, selectedTime);
    onClose();
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
      setSelectedStop(null);
      setSelectedDirection(null);
      setSelectedTime('');
    } else if (currentStep === 3) {
      setCurrentStep(2);
      setSelectedDirection(null);
      setSelectedTime('');
    }
    setError(null);
  };

  const renderStep1 = () => (
    <div>
      <h3 className="text-lg font-semibold mb-4">1단계: 출발지 선택</h3>
      {loading ? (
        <div className="text-center py-4">불러오는 중...</div>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {stops.map(stop => (
            <button
              key={stop.id}
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => handleStopSelect(stop)}
            >
              <div className="font-medium">{stop.name}</div>
              <div className="text-sm text-gray-600">{stop.transportType}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div>
      <h3 className="text-lg font-semibold mb-4">2단계: 경로 선택</h3>
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600">선택된 출발지</div>
        <div className="font-medium">{selectedStop?.name}</div>
      </div>
      {loading ? (
        <div className="text-center py-4">불러오는 중...</div>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {directions.map(direction => (
            <button
              key={direction.id}
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => handleDirectionSelect(direction)}
            >
              <div className="font-medium">
                {direction.departureStop.name} → {direction.arrivalStop.name}
              </div>
              <div className="text-sm text-gray-600">
                요금: {direction.fare}원 | 소요시간: {formatDuration(direction.requiredTime)}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div>
      <h3 className="text-lg font-semibold mb-4">3단계: 출발 시간 선택</h3>
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600">선택된 경로</div>
        <div className="font-medium">
          {selectedDirection?.departureStop.name} → {selectedDirection?.arrivalStop.name}
        </div>
      </div>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {selectedDirection?.departureTimes.map(time => (
          <button
            key={time}
            className={`w-full text-left p-3 border rounded-lg transition-colors ${
              selectedTime === time 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => setSelectedTime(time)}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">구간 추가</h2>
          <button
            className="text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        <div className="flex justify-between mt-6">
          {currentStep > 1 && (
            <button
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              onClick={handleBack}
              disabled={loading}
            >
              뒤로
            </button>
          )}
          <div className="flex gap-2 ml-auto">
            <button
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              onClick={onClose}
              disabled={loading}
            >
              취소
            </button>
            {currentStep === 3 && (
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                onClick={handleSubmit}
                disabled={loading || !selectedTime}
              >
                {loading ? '추가 중...' : '추가'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 