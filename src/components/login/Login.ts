import http from "@/tool/http";
import {toCamelCaseObject, toSnakeCase} from "@/tool/tool";

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
            .post("/libong/login/in", false, req)
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
            .get("/libong/login/login/sms/send", false, toSnakeCase(req))
            .then((res) => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
}
