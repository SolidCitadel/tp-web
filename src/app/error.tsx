"use client";
import Error401 from "@/components/Error401";

export default function Error({ error }: { error: Error & { status?: number } }) {
  if (error?.message?.includes("401") || error?.status === 401) {
    return <Error401 />;
  }
  return <div>Error: {error?.message || '알 수 없는 에러'}</div>;
}
  