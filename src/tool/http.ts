import axios, {AxiosInstance, AxiosRequestConfig} from "axios";
import {toSnakeCase} from "@/tool/tool";
import router from "@/router";
import {localStorage_roleObj_label, localStorage_tokenObj_label} from "@/config/localStorage";
import {envConfig} from "@/config/env/envConfig";

export interface IApiResponse {
    code: number;
    error: string;
    data: object;
}

// 创建axios实例
const createAxiosInstance = (auth: boolean, contentType?: string, baseUrl?: string): AxiosInstance => {
    let axiosParam = {
        timeout: 25000,
        baseURL: envConfig.BASE_URL,
        headers: {
            "Content-Type": "application/json",
            "app_id": envConfig.APP_ID
        }
    }
    if (contentType) {
        axiosParam.headers["Content-Type"] = contentType
    }
    if (baseUrl) {
        axiosParam.baseURL = baseUrl;
    }
    const instance = axios.create(axiosParam);
    // 请求拦截器
    instance.interceptors.request.use((config: AxiosRequestConfig | any) => {
        // 只有在需要认证的情况下才添加token
        if (auth) {
            const tokenObjStr = localStorage.getItem(localStorage_tokenObj_label);
            if (tokenObjStr) {
                const tokenObj = JSON.parse(tokenObjStr);
                config.headers['li-token'] = tokenObj.localStorage_token_label;
            }

            const roleObjStr = localStorage.getItem(localStorage_roleObj_label);
            if (roleObjStr) {
                const roleObj = JSON.parse(roleObjStr);
                config.headers['li-role'] = roleObj.id;
            }
        }

        return config;
    });

    // 响应拦截器
    instance.interceptors.response.use(
        (res) => {
            const apiResponse = res.data as IApiResponse;
            if (apiResponse.error !== "") {
                return Promise.reject(apiResponse.error);
            }
            return res;
        },
        (err) => {
            if (err.response?.status === 401 && auth) {
                if (err.response.data) {
                    handleAuthenticationError(router.currentRoute.value.path);
                    return Promise.reject("登录过期，请重新登录");
                }
            }
            return Promise.reject(err);
        }
    );

    return instance;
};

function handleAuthenticationError(redirectPath: string) {
    router.push({path: '/login', query: {redirect: redirectPath}}).then(r => {
        // 可以添加额外的清理逻辑
    });
}

interface IHttp {
    get<T>(url: string, auth: boolean, param?: unknown): Promise<IApiResponse>;

    post<T>(url: string, auth: boolean, data?: unknown): Promise<IApiResponse>;

    filePost<T>(url: string, auth: boolean, data?: unknown, param?: unknown): Promise<IApiResponse>;
}

const http: IHttp = {
    async get(url, auth, params) {
        const axiosInstance = createAxiosInstance(auth);
        try {
            const response = await axiosInstance.get(url, {params});
            return response.data;
        } catch (err) {
            return Promise.reject(err);
        }
    },

    async post(url, auth, data) {
        const axiosInstance = createAxiosInstance(auth);
        try {
            const response = await axiosInstance.post(url, toSnakeCase(data));
            return response.data;
        } catch (err) {
            return Promise.reject(err);
        }
    },
    async filePost(url, auth, data, params) {
        const axiosInstance = createAxiosInstance(auth, "multipart/form-data", envConfig.FILE_UPLOAD_URL);
        try {
            const response = await axiosInstance.post(url, data, {params});
            return response.data;
        } catch (err) {
            return Promise.reject(err);
        }
    }
};

export default http;