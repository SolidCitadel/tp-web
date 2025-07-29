'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { PlanListItem } from '@/types/plan';
import axios from 'axios';
import Link from 'next/link';

export default function PlansPage() {
  const { user, isLoading } = useAuth();
  const [plans, setPlans] = useState<PlanListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && user) {
      axios.get(`/api/user/users/${user.id}/plans`)
        .then(res => setPlans(res.data))
        .catch(() => setError('계획 목록을 불러오지 못했습니다.'))
        .finally(() => setLoading(false));
    }
  }, [user, isLoading]);

  const handleAddPlan = async () => {
    if (!newPlanName.trim()) {
      setAddError('이름을 입력하세요.');
      return;
    }
    setAdding(true);
    setAddError(null);
    try {
      const res = await axios.post(`/api/user/users/${user?.id}/plans`, { name: newPlanName });
      setPlans(prev => [...prev, res.data]);
      setShowModal(false);
      setNewPlanName('');
    } catch {
      setAddError('계획 추가에 실패했습니다.');
    } finally {
      setAdding(false);
    }
  };

  if (isLoading || loading) {
    return <div className="p-6">불러오는 중...</div>;
  }
  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">나의 계획 목록</h1>
        <button
          className="border border-green-600 text-green-700 hover:bg-green-50 px-4 py-2 rounded-md text-sm font-medium transition duration-200 ml-8"
          onClick={() => setShowModal(true)}
        >
          + 계획 추가
        </button>
      </div>
      {plans.length === 0 ? (
        <div className="text-gray-500">계획이 없습니다.</div>
      ) : (
        <div className="space-y-4">
          {plans.map(plan => (
            <div key={plan.id} className="bg-white rounded-lg shadow-md p-6 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{plan.name}</h2>
              </div>
              <div className="flex gap-1">
                <button 
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition duration-200"
                  title="수정"
                >
                  <Link href={`/plans/${plan.id}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Link>
                </button>
                <button
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition duration-200"
                  title="삭제"
                  onClick={async () => {
                    if (!window.confirm('정말 삭제하시겠습니까?')) return;
                    try {
                      await axios.delete(`/api/user/plans/${plan.id}`);
                      setPlans(prev => prev.filter(p => p.id !== plan.id));
                    } catch {
                      alert('삭제에 실패했습니다.');
                    }
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 계획 추가 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">계획 추가</h2>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="계획 이름을 입력하세요"
              value={newPlanName}
              onChange={e => setNewPlanName(e.target.value)}
              disabled={adding}
              autoFocus
            />
            {addError && <div className="text-red-500 text-sm mb-2">{addError}</div>}
            <div className="flex justify-end space-x-2 mt-4">
              <button
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700"
                onClick={() => { setShowModal(false); setNewPlanName(''); setAddError(null); }}
                disabled={adding}
              >
                취소
              </button>
              <button
                className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white"
                onClick={handleAddPlan}
                disabled={adding}
              >
                {adding ? '추가 중...' : '추가'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 