import axios, {AxiosRequestConfig} from "axios";
import {toSnakeCase} from "@/tool/tool";
import router from "@/router";
import {localStorage_roleObj_label, localStorage_tokenObj_label} from "@/config/localStorage";

export interface IApiResponse {
    code: number;
    error: string;
    data: object;
}

axios.defaults.timeout = 25000;
axios.defaults.baseURL = "http://localhost:8001/libong";
axios.defaults.headers.common = {
    "Content-Type": "application/json",
    app_id: "1231",
};
//请求拦截器
axios.interceptors.request.use((config: AxiosRequestConfig | any) => config);

function handleAuthenticationError(redirectPath: string) {
    // 执行一些登出操作，比如清除token等
    // ...

    // 跳转到登录页面，并附带重定向路径
    router.push({path: '/login', query: {redirect: redirectPath}}).then(r => {
    });
}

//响应拦截器
axios.interceptors.response.use(
    //成功时调用
    (res) => {
        const apiResponse = res.data as IApiResponse;
        if (apiResponse.error != "") {
            return Promise.reject(apiResponse.error);
        }
        return res;
    },
    //失败时调用 返回Promise.reject可以使得在链路的catch中捕获该err
    (err) => {
        //未授权的话就直接返回到登录页面
        if (err.response && err.response.status == 401) {
            if (err.response.data) {
                handleAuthenticationError(router.currentRoute.value.path);
                return Promise.reject(err.response.data.error);
            }
        }
        return Promise.reject(err);
    },
);

interface IHttp {
    get<T>(url: string, auth: boolean, param?: unknown): Promise<IApiResponse>;

    post<T>(url: string, auth: boolean, data?: unknown): Promise<IApiResponse>;
}

const http: IHttp = {
    get(url, auth, params) {
        if (auth) {
            let tokenObjStr = localStorage.getItem(localStorage_tokenObj_label);
            if (tokenObjStr != null) {
                let tokenObj = JSON.parse(tokenObjStr);
                axios.defaults.headers.common['li-token'] = tokenObj.localStorage_token_label;
            }
        }
        return new Promise((resolve, reject) => {
            axios
                .get(url, {params})
                .then((res) => {
                    resolve(res.data);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    post(url, auth, data) {
        if (auth) {
            let tokenObjStr = localStorage.getItem(localStorage_tokenObj_label);
            if (tokenObjStr != null) {
                let tokenObj = JSON.parse(tokenObjStr);
                axios.defaults.headers.common['li-token'] = tokenObj.localStorage_token_label;
            }
        }
        let roleObjStr = localStorage.getItem(localStorage_roleObj_label);
        if (roleObjStr != null) {
            let roleObj = JSON.parse(roleObjStr);
            axios.defaults.headers.common['li-role'] = roleObj.id;
        }
        return new Promise((resolve, reject) => {
            axios
                .post(url, toSnakeCase(data), {})
                .then((res) => {
                    resolve(res.data);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
};

export default http;