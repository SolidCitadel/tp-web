import { AxiosError, InternalAxiosRequestConfig, AxiosInstance } from 'axios';

export function addCommonInterceptors(instance: AxiosInstance) {
    let isRefreshing = false;
    let failedQueue: {resolve: (value: unknown) => void; reject: (reason?: unknown) => void;}[] = [];

    const processQueue = (error: AxiosError | null, token: string | null = null) => {
        failedQueue.forEach(prom => {
            if (error) {
                prom.reject(error);
            } else {
                prom.resolve(token);
            }
        })
        failedQueue = [];
    };

    instance.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error: AxiosError) => {
            const originalRequest = error.config as InternalAxiosRequestConfig;

            if (error.response?.status === 401 && originalRequest.url !== '/api/reissue'){
                if(isRefreshing){
                    return new Promise((resolve, reject) => {
                        failedQueue.push({resolve, reject});
                    }).then(()=> {
                        return instance(originalRequest);
                    }).catch(err => {
                        return Promise.reject(err);
                    });
                }

                isRefreshing = true;

                try {
                    await instance.post('/api/reissue');
                    processQueue(null);
                    return instance(originalRequest);
                } catch (refreshError){
                    processQueue(refreshError as AxiosError, null);
                    console.error('Session expired. Please login again.');
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }
            return Promise.reject(error);
        }
    );
} 