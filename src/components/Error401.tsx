"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Error401() {
  const router = useRouter();
  useEffect(() => {
    fetch("/api/user/reissue", { method: "POST", credentials: "include" })
      .then(res => {
        if (res.ok) {
          router.refresh();
        } else {
          router.replace("/login");
        }
      });
  }, [router]);
  return <div>세션이 만료되었습니다. 다시 로그인 중...</div>;
} 