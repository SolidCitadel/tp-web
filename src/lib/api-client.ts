import axios from 'axios';
import { addCommonInterceptors } from './api-common';

// 클라이언트용 axios 인스턴스 (브라우저에서 쿠키 자동 전송)
export const browserApiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_HOST,
    withCredentials: true,
});
addCommonInterceptors(browserApiClient);

