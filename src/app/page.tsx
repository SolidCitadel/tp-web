import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <Link
        href="/stops"
        className="flex items-center gap-2 bg-cyan-500 text-white font-semibold py-3 px-8 rounded-xl shadow-md hover:bg-cyan-600 transition min-w-[180px] justify-center"
      >
        <span>🚌</span>
        터미널 목록
      </Link>
      <Link
        href="/directions"
        className="flex items-center gap-2 bg-emerald-500 text-white font-semibold py-3 px-8 rounded-xl shadow-md hover:bg-emerald-600 transition min-w-[180px] justify-center"
      >
        <span>🗺️</span>
        노선 목록
      </Link>
    </div>
  );
}
