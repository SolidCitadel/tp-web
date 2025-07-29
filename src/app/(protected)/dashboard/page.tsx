import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">대시보드</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 정류장 조회 카드 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">정류장 조회</h2>
            <p className="text-gray-600 mb-4">주변 정류장을 찾아보세요.</p>
            <Link 
              href="/stops" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200"
            >
              정류장 목록
            </Link>
          </div>

          {/* 노선 조회 카드 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">노선 조회</h2>
            <p className="text-gray-600 mb-4">대중교통 노선을 확인하세요.</p>
            <Link 
              href="/directions" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200"
            >
              노선 목록
            </Link>
          </div>

          {/* 마이페이지 카드 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">마이페이지</h2>
            <p className="text-gray-600 mb-4">내 정보를 관리하세요.</p>
            <Link 
              href="/mypage" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200"
            >
              마이페이지
            </Link>
          </div>

          {/* 계획 조회 카드 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">계획 조회</h2>
            <p className="text-gray-600 mb-4">나의 계획을 확인하고 수정할 수 있습니다.</p>
            <Link 
              href="/plans" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200"
            >
              계획 목록
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 