import {toCamelCaseObject} from "@/tool/tool";
import http from "@/tool/http";

export interface IFinanceBill {
    billId: string; //账单编号
    dayIncome: number, //今日收入
    cash: number, //现金收入
    onlineIncome: number, //在线收入
    goodsExpenses: number, //货物支出
    drinksExpenses: number, //酒水支出
    otherExpenses: number, //其他支出
    otherExpensesRemark: string, //其他支出备注
    isDraw: number, //是否提款
    drawIncome: number, //提款收入
    cardIncome: number, //卡收入
    remark: string, //备注
    timestamp: number, //时间戳
}

export enum FinanceBillIsDraw {
    Unknown,
    Yes,
    No
}

export interface IAddFinanceBillReq {
    dayIncome: number; // 今日收入
    cash: number; // 现金收入
    onlineIncome: number; // 在线收入
    goodsExpenses: number; // 货物支出
    drinksExpenses: number; // 酒水支出
    otherExpenses: number; // 其他支出
    otherExpensesRemark: string; // 其他支出备注
    isDraw: number; // 是否提款
    drawIncome: number; // 提款收入
    cardIncome: number; // 卡收入
    remark: string; // 备注
    timestamp: number, //时间戳
}

export interface IAddFinanceBillResp {
    billId: string; // 账单编号
}

export function addFinanceBillInterface(req: IAddFinanceBillReq): Promise<IAddFinanceBillResp> {
    return new Promise((resolve, reject) => {
        http
            .post("/financeBill/add", true, req)
            .then((res) => {
                resolve(toCamelCaseObject(res.data) as IAddFinanceBillResp);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export interface IUpdateFinanceBillReq {
    billId: string; // 账单编号
    dayIncome: number; // 今日收入
    cash: number; // 现金收入
    onlineIncome: number; // 在线收入
    goodsExpenses: number; // 货物支出
    drinksExpenses: number; // 酒水支出
    otherExpenses: number; // 其他支出
    otherExpensesRemark: string; // 其他支出备注
    isDraw: number; // 是否提款
    drawIncome: number; // 提款收入
    cardIncome: number; // 卡收入
    remark: string; // 备注
    timestamp: number, //时间戳
}

export function updateFinanceBillInterface(req: IUpdateFinanceBillReq): Promise<void> {
    return new Promise((resolve, reject) => {
        http
            .post("/financeBill/update", true, req)
            .then((res) => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export interface IDeleteFinanceBillReq {
    billId: string; // 账单编号
}

export function deleteFinanceBillInterface(req: IDeleteFinanceBillReq): Promise<void> {
    return new Promise((resolve, reject) => {
        http
            .post("/financeBill/delete", true, req)
            .then((res) => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export interface IFinanceBillByIDReq {
    billId: string; // 账单编号
}

export interface IFinanceBillByIDResp {
    financeBill: IFinanceBill; // 账单详情
}

export function financeBillByIDInterface(req: IFinanceBillByIDReq): Promise<IFinanceBillByIDResp> {
    return new Promise((resolve, reject) => {
        http
            .get(`/financeBill/detail?billId=${req.billId}`, true)
            .then((res) => {
                resolve(toCamelCaseObject(res.data) as IFinanceBillByIDResp);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export interface ISearchFinanceBillsPageReq {
    startTimestamp: number; //开始时间戳
    endTimestamp: number; //结束时间戳
    owner: string; //拥有者
    pageNum: number; // 当前页码
    pageSize: number; // 每页大小
}

export interface ISearchFinanceBillsPageResp {
    list: IFinanceBill[]; // 账单列表
    total: number; // 总记录数
}

export function searchFinanceBillsPageInterface(req: ISearchFinanceBillsPageReq): Promise<ISearchFinanceBillsPageResp> {
    return new Promise((resolve, reject) => {
        http
            .post("/financeBill/search/page", true, req)
            .then((res) => {
                resolve(toCamelCaseObject(res.data) as ISearchFinanceBillsPageResp);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export interface IFinanceBillAccount {
    avatar: string;
    accountId: string;
    account: string;
}

export interface ISearchFinanceBillAccountsReq {

}

export interface ISearchFinanceBillAccountsResp {
    list: IFinanceBillAccount[];
}

export function searchFinanceBillAccountsInterface(req: ISearchFinanceBillAccountsReq): Promise<ISearchFinanceBillAccountsResp> {
    return new Promise((resolve, reject) => {
        http
            .get("/financeBill/account/search", true, req)
            .then((res) => {
                resolve(toCamelCaseObject(res.data) as ISearchFinanceBillAccountsResp);
            })
            .catch((err) => {
                reject(err);
            });
    });
}