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

export interface FinanceBillByIDReq {
    billId: string; // 账单编号
}

export interface FinanceBillByIDResp {
    financeBill: IFinanceBill; // 账单详情
}

export function financeBillByIDInterface(req: FinanceBillByIDReq): Promise<FinanceBillByIDResp> {
    return new Promise((resolve, reject) => {
        http
            .get(`/financeBill/detail?billId=${req.billId}`, true)
            .then((res) => {
                resolve(toCamelCaseObject(res.data) as FinanceBillByIDResp);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export interface SearchFinanceBillsPageReq {
    startTimestamp: number, //开始时间戳
    endTimestamp: number, //结束时间戳

    pageNum: number; // 当前页码
    pageSize: number; // 每页大小
}

export interface SearchFinanceBillsPageResp {
    list: IFinanceBill[]; // 账单列表
    total: number; // 总记录数
}

export function searchFinanceBillsPageInterface(req: SearchFinanceBillsPageReq): Promise<SearchFinanceBillsPageResp> {
    return new Promise((resolve, reject) => {
        http
            .post("/financeBill/search/page", true, req)
            .then((res) => {
                resolve(toCamelCaseObject(res.data) as SearchFinanceBillsPageResp);
            })
            .catch((err) => {
                reject(err);
            });
    });
}