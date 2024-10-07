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

export interface ISearchShoppingRecordsPageReq {
    pageSize: number,
    pageNum: number,
    recordType: RecordType,
}

export interface ISearchRecord {
    establishAt: number, //创建时间
    produceAt: number, //生产日期
    overdueAt: number, //过期时间
    buyAt: number, //购买日期
    goodsName: string, //物品名称
    goodsTypes: Label[], //物品标签
    recordId: string, //记录编号
}

export interface ISearchShoppingRecordsPageResp {
    list: ISearchRecord[],
    total: number,
}

export function searchShoppingRecordsPageInterface(req: ISearchShoppingRecordsPageReq): Promise<ISearchShoppingRecordsPageResp> {
    return new Promise((resolve, reject) => {
        http
            .post("/libong/xxxx", false, req)
            .then((res) => {
                resolve(toCamelCaseObject(res.data) as ISearchShoppingRecordsPageResp);
            })
            .catch((err) => {
                reject(err);
            });
    });
}