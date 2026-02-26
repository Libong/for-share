import axios, {AxiosInstance, AxiosRequestConfig} from "axios";
import {isPlainObject, toSnakeCase} from "@/tool/tool";
import router from "@/router";
import {GetCurRole, GetCurToken, localStorage_roleObj_label, localStorage_tokenObj_label} from "@/config/localStorage";
import {envConfig, isProd} from "@/config/env/envConfig";
import {decryptAES, encryptAES, encryptRSA, generateAESKey} from "@/tool/crypt";

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
            "li-app-id": envConfig.APP_ID
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
            config.headers['li-token'] = GetCurToken();
            config.headers['li-role'] = GetCurRole();
        }

        if (config.headers['Content-Type'] === 'application/json' && isProd) {
            /*数据加密*/
            //1.生成对称加密的key 随机每次请求不同 并存于axios的自定义属性透传 用于响应时获取并解析后端传递的对称加密数据
            const aesKey = generateAESKey()
            config.__AESKey = aesKey
            //2.将key进行非对称加密 传递给后端
            config.headers['li-key'] = encryptRSA(aesKey)
            //3.将数据进行对称加密
            const encryptObj = encryptAES(JSON.stringify(config.data), aesKey);
            config.data = encryptObj.ciphertext + encryptObj.iv;
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
            if (res.config && !isPlainObject(res.data.data) && isProd) {
                const aesKey = res.config.__AESKey
                const decryptData = decryptAES(res.data.data, aesKey);
                res.data.data = JSON.parse(decryptData)
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

export function handleAuthenticationError(redirectPath: string) {
    localStorage.removeItem(localStorage_tokenObj_label);
    localStorage.removeItem(localStorage_roleObj_label);
    router.push({path: '/login', query: {redirect: redirectPath}}).then(r => {
    });
}

interface IHttp {
    get<T>(url: string, auth: boolean, param?: unknown, urlPrefix?: string): Promise<IApiResponse>;

    post<T>(url: string, auth: boolean, data?: unknown, urlPrefix?: string): Promise<IApiResponse>;

    filePost<T>(url: string, auth: boolean, data?: unknown, param?: unknown): Promise<IApiResponse>;
}

const http: IHttp = {
    async get(url, auth, params, urlPrefix) {
        const axiosInstance = createAxiosInstance(auth, undefined, urlPrefix);
        try {
            const parsedParams = toSnakeCase(params)
            const response = await axiosInstance.get(url, {params: parsedParams});
            return response.data;
        } catch (err) {
            return Promise.reject(err);
        }
    },

    async post(url, auth, data, urlPrefix) {
        const axiosInstance = createAxiosInstance(auth, undefined, urlPrefix);
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
    },
};

export default http;