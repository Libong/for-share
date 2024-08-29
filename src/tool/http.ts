import axios from "axios";

axios.defaults.baseURL = "http://192.168.10.101:8000/libong";
axios.defaults.headers.common = {
    "Content-Type": "application/json",
    app_id: "1231",
};
// //请求拦截器
// axios.interceptors.request.use((config: AxiosRequestConfig | any) => config);
//
// //响应拦截器
// axios.interceptors.response.use(
//     //成功时调用
//     (res) => {
//         console.log(res);
//         return res;
//     },
//     //失败时调用 返回Promise.reject可以使得在链路的catch中捕获该err
//     (err) => {
//         return Promise.reject(err);
//     },
// );

interface IHttp {
    get<T>(url: string, auth: boolean, param?: unknown): Promise<T>;

    post<T>(url: string, auth: boolean, data?: unknown): Promise<IApiResponse>;
}

const http: IHttp = {
    get(url, auth, params) {
        if (auth) {
        }
        return new Promise((resolve, reject) => {
            axios
                .get(url, {params})
                .then((res) => {
                    if (res.data.error != "") {
                        reject(res.data.error);
                    } else {
                        resolve(res.data);
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    post(url, auth, data) {
        return new Promise((resolve, reject) => {
            axios
                .post(url, data, {})
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

export interface IApiResponse {
    code: number;
    error: string;
    data: object;
}
