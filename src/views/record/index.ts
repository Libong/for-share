import http from "@/tool/http";
import {toCamelCaseObject} from "@/tool/tool";

export enum RecordType {
    Current = 1,
    History = 2,
}

export interface Label {
    id: string,
    name: string,
}

export interface TimeRange {
    startAt: number,
    endAt: number,
}

export interface ISearchRecordsPageReq {
    pageSize: number,
    pageNum: number,
    recordType: RecordType,
    fuzzyGoodName: string,
    recordIds: string[],
    status: number,
    buyAtRange: TimeRange,
    produceAtRange: TimeRange,
    overdueAtRange: TimeRange,
    establishAtRange: TimeRange,
    starLevels: number[],
}

export interface IRecord {
    establishAt: number, //创建时间
    produceAt: number, //生产日期
    overdueAt: number, //过期时间
    buyAt: number, //购买日期
    goodsName: string, //物品名称
    goodsTypes: Label[], //物品标签
    recordId: string, //记录编号
}

export interface ISearchRecordsPageResp {
    list: IRecord[],
    total: number,
}

export function searchRecordsPageInterface(req: ISearchRecordsPageReq): Promise<ISearchRecordsPageResp> {
    return new Promise((resolve, reject) => {
        http
            .post("/record/search/page", true, req)
            .then((res) => {
                resolve(toCamelCaseObject(res.data) as ISearchRecordsPageResp);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export interface IAddRecordReq {
    goodsName: string, //物品名称
    buyAt: number, //购买日期
    produceAt: number, //生产日期
    overdueAt: number, //过期时间
    categoryIds: string[], //物品标签编号
}

export interface IAddRecordResp {
    recordId: string, //记录编号
}

export function addRecordInterface(req: IAddRecordReq): Promise<IAddRecordResp> {
    console.log(req);
    return new Promise((resolve, reject) => {
        http
            .post("/record/add", true, req)
            .then((res) => {
                resolve(toCamelCaseObject(res.data) as IAddRecordResp);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export interface IDeleteRecordReq {
    recordId: string, //记录编号
}

export function deleteRecordInterface(req: IDeleteRecordReq): Promise<void> {
    console.log(req);
    return new Promise((resolve, reject) => {
        http
            .post("/record/delete", true, req)
            .then((res) => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
}