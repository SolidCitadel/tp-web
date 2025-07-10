import { AxiosError, InternalAxiosRequestConfig, AxiosInstance } from 'axios';

export function addCommonInterceptors(instance: AxiosInstance) {
    instance.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error: AxiosError) => {
            const originalRequest = error.config as InternalAxiosRequestConfig;

            if (error.response?.status === 401){
                // SSR 환경: reissue 시도하지 않고, 로그인 페이지로 리디렉션
                // 원래 요청한 경로를 쿼리로 전달
                const reqUrl = originalRequest.url || "/";
                const loginUrl = `/login?redirect=${encodeURIComponent(reqUrl)}`;
                // Next.js SSR에서 리디렉션 응답 반환
                // (throw로 에러를 올려서 page/route handler에서 처리하거나, 직접 Response 반환)
                const redirectError = new Error("REDIRECT");
                (redirectError as any).redirect = loginUrl;
                throw redirectError;
            }
            return Promise.reject(error);
        }
    );
} 