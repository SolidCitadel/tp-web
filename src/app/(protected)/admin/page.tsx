'use client';

import Link from 'next/link';

export default function AdminPage() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">관리자 대시보드</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 사용자 관리 카드 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">사용자 관리</h2>
            <p className="text-gray-600 mb-4">사용자 계정을 관리하고 권한을 설정하세요.</p>
            <Link 
              href="/admin/users" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200"
            >
              사용자 목록 보기
            </Link>
          </div>

          {/* 정류장 관리 카드 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">정류장 관리</h2>
            <p className="text-gray-600 mb-4">정류장 정보를 관리하고 업데이트하세요.</p>
            <Link 
              href="/admin/stops" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200"
            >
              정류장 관리
            </Link>
          </div>

          {/* 노선 관리 카드 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">노선 관리</h2>
            <p className="text-gray-600 mb-4">대중교통 노선을 추가하고 편집하세요.</p>
            <Link 
              href="/admin/directions" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200"
            >
              노선 관리
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}