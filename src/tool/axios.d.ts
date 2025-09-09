// src/types/axios.d.ts
import 'axios'; // ← 只保留这一条，用来引入类型

declare module 'axios' {
    export interface InternalAxiosRequestConfig {
        /** 前端自用的 AES 密钥，不会随请求发到服务器 */
        __AESKey?: string;
    }
}