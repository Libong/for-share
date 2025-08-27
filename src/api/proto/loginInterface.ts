import http from "@/tool/http";
import {toCamelCaseObject, toSnakeCase} from "@/tool/tool";
import {Meta} from "@/config/common";

export enum FormTypeEnum {
    Phone = 1,
    Email = 4,
    Account = 2,
}

export interface ILoginInReq {
    loginInType: number;
    account: string;
    phone: string;
    password: string;
    verifyCode: string;
    email: string;
}

export interface ILoginInResp {
    accountId: string;
    accessToken: string;
    refreshToken: string;
}

export function loginInInterface(req: ILoginInReq): Promise<ILoginInResp> {
    return new Promise((resolve, reject) => {
        http
            .post("/manager/api/login/in", false, req)
            .then((res) => {
                resolve(toCamelCaseObject(res.data) as ILoginInResp);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export interface ISendLoginSmsReq {
    phone: string;
}

export function sendLoginSmsInterface(req: ISendLoginSmsReq): Promise<void> {
    return new Promise((resolve, reject) => {
        http
            .get("/manager/api/login/login/sms/send", false, toSnakeCase(req))
            .then((res) => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export interface IUserInfoResp {
    roles: Meta[];
    account: string;
    sex: number;
    avatar: string;
    departments: Meta[];
    hasPassword: boolean;
    encryptPhone: string,
}

export function userInfoInterface(): Promise<IUserInfoResp> {
    return new Promise((resolve, reject) => {
        http
            .get("/manager/api/login/user/info", true, null)
            .then((res) => {
                resolve(toCamelCaseObject(res.data) as IUserInfoResp);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export interface IUserRolesResp {
    roles: Meta[];
}

export function userRolesInterface(): Promise<IUserRolesResp> {
    return new Promise((resolve, reject) => {
        http
            .get("/manager/api/login/user/roles", true, null)
            .then((res) => {
                resolve(toCamelCaseObject(res.data) as IUserRolesResp);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

// 根据 proto 的 UpdateUserInfoReq 定义
export interface IUpdateUserInfoReq {
    account?: string;
    sex?: number;
    avatar?: string;
    curPassword?: string;
    newPassword?: string;
}

// 根据 proto 的 rpc updateUserInfo 定义
export function updateUserInfoInterface(req: IUpdateUserInfoReq): Promise<void> {
    return new Promise((resolve, reject) => {
        http
            .post("/manager/api/login/user/info/update", true, req)
            .then((res) => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
}

// 根据 proto 的 RegisterReq 定义
export interface IRegisterReq {
    registerType: RegisterType;
    username: string;
    password: string;
    phone: string;
    verifyCode: string;
}

// 根据 proto 的 RegisterResp 定义
export interface IRegisterResp {
    accountId: string;
    accessToken: string;
    refreshToken: string;
}

// 根据 proto 的 rpc register 定义
export function registerInterface(req: IRegisterReq): Promise<IRegisterResp> {
    return new Promise((resolve, reject) => {
        http
            .post("/manager/api/login/register", false, req)
            .then((res) => {
                resolve(toCamelCaseObject(res.data) as IRegisterResp);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

// 根据 proto 的 rpc signOut 定义
export function loginOutInterface(): Promise<void> {
    return new Promise((resolve, reject) => {
        http
            .post("/manager/api/login/out", true, null)
            .then((res) => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
}

// 添加登录类型枚举
export enum LoginType {
    LoginTypeUnknown = 0,
    LoginTypeByPhoneSms = 1,           // 手机短信
    LoginTypeByAccountOrPhonePwd = 2,  // 账户密码
    LoginTypeByEmailPwd = 3            // 邮箱密码
}

// 添加注册类型枚举
export enum RegisterType {
    RegisterTypeUnknown = 0,
    RegisterTypeByPhoneSms = 1,           // 手机短信
    RegisterTypeByAccountOrPhonePwd = 2,  // 账户密码
    RegisterTypeByEmailPwd = 3            // 邮箱密码
}