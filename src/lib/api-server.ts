import axios from 'axios';
import { addCommonInterceptors } from './api-common';

// 쿠키를 포함한 서버용 axios 생성 함수
export const createServerApiClient = (cookies?: string) => {
    const instance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_HOST,
        headers: {
            ...(cookies && { 'Cookie': cookies }),
        }
    });
    // addCommonInterceptors(instance);
    return instance;
};

// 서버에서 쿠키를 자동으로 가져와서 axios 인스턴스 생성
export const getServerApiClient = async () => {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    return createServerApiClient(cookieStore.toString());
}; 