import http from "@/tool/http";

export enum FormTypeEnum {
    Phone = 1,
    Email = 2,
    UserName = 3,
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
            .post("/login/in", false, req)
            .then((res) => {
                return res.data as ILoginInResp;
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
            .get("/login/sms/send", false, req)
            .then((res) => {
            })
            .catch((err) => {
                reject(err);
            });
    });
}
