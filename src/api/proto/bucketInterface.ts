import {toCamelCaseObject} from "@/tool/tool";
import http from "@/tool/http";
import {envConfig} from "@/config/env/envConfig";

export interface IBucketAccount {
    accountId: string;
    accessMode: number; // 访问权限 1只读 2只写 3读写
}

export interface IBucketAccountDetail {
    accountId: string;
    accountName: string;
    accessMode: number; // 访问权限 1只读 2只写 3读写
    avatar: string;
    accessKey: string; //访问密钥
    accessSecret: string; //访问密码
}

export interface IBucket {
    name: string;
    usage: number;
    objectCnt: number;
    establishAt: number;
    bucketId: string;
    accessPolicy: number; // 访问策略 1公有 2私有 3自定义
    lastModifiedAt: number;
    desc: string;
}

export interface IObject {
    name: string;
    lastModifyAt: number;
    size: number;
    isDir: boolean;
    url: string;
}

// 请求响应类型定义
export interface IAddBucketReq {
    name: string;
    accessPolicy: number;
}

export interface IUpdateBucketReq {
    accessPolicy: number;
    accessRule: string;
    bucketId: string;
    bucketAccounts: IBucketAccount[];
    desc: string;
}

export interface IDeleteBucketReq {
    bucketId: string;
}

export interface ISearchBucketsPageReq {
    fuzzyName?: string;
    pageNum?: number;
    pageSize?: number;
}

export interface ISearchBucketsPageResp {
    list: IBucket[];
    total: number;
}

export interface IBucketByIdReq {
    bucketId: string;
}

export interface IBucketByIdResp {
    name: string;
    usage: number;
    accessPolicy: number;
    accessRule: string;
    bucketId: string;
    list: IBucketAccountDetail[];
    objectCnt: number;
    establishAt: number;
    desc: string;
}

export interface IBrowseBucketObjectsReq {
    path: string;
}

export interface IBrowseBucketObjectsResp {
    list: IObject[];
}

export interface IDeleteObjectReq {
    path: string;
}

export interface IShareBucketObjectUrlReq {
    expireType: number; // 1.1小时 2.当天 3.永久有效
    path: string;
}

export interface IShareBucketObjectUrlResp {
    url: string;
}

export interface IDeleteBucketAccountRelReq {
    bucketId: string;
    accountId: string;
}

// URL过期类型枚举
export enum UrlExpireType {
    Unknown = 0,
    Hour = 1,
    Day = 2,
    Forever = 3
}

export enum BucketAccessPolicy {
    Unknown = 0,
    Private = 1, //私有
    Publish = 2, //公有
    Custom = 3, //自定义
}

// 接口实现
export function addBucketInterface(req: IAddBucketReq): Promise<void> {
    return new Promise((resolve, reject) => {
        http
            .post("/bucket/add", true, req, envConfig.STORAGE_URL)
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export function updateBucketInterface(req: IUpdateBucketReq): Promise<void> {
    return new Promise((resolve, reject) => {
        http
            .post("/bucket/update", true, req, envConfig.STORAGE_URL)
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export function deleteBucketInterface(req: IDeleteBucketReq): Promise<void> {
    return new Promise((resolve, reject) => {
        http
            .post("/bucket/delete", true, req, envConfig.STORAGE_URL)
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export function searchBucketsPageInterface(req: ISearchBucketsPageReq): Promise<ISearchBucketsPageResp> {
    return new Promise((resolve, reject) => {
        http
            .get("/bucket/search/page", true, req, envConfig.STORAGE_URL)
            .then((res) => {
                resolve(toCamelCaseObject(res.data) as ISearchBucketsPageResp);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export function bucketByIdInterface(req: IBucketByIdReq): Promise<IBucketByIdResp> {
    return new Promise((resolve, reject) => {
        http
            .get("/bucket/get", true, req, envConfig.STORAGE_URL)
            .then((res) => {
                resolve(toCamelCaseObject(res.data) as IBucketByIdResp);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export function browseBucketObjectsInterface(req: IBrowseBucketObjectsReq): Promise<IBrowseBucketObjectsResp> {
    return new Promise((resolve, reject) => {
        http
            .get("/bucket/object/browse", true, req, envConfig.STORAGE_URL)
            .then((res) => {
                resolve(toCamelCaseObject(res.data) as IBrowseBucketObjectsResp);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export function deleteObjectInterface(req: IDeleteObjectReq): Promise<void> {
    return new Promise((resolve, reject) => {
        http
            .post("/bucket/object/delete", true, req, envConfig.STORAGE_URL)
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export function shareBucketObjectUrlInterface(req: IShareBucketObjectUrlReq): Promise<IShareBucketObjectUrlResp> {
    return new Promise((resolve, reject) => {
        http
            .post("/bucket/object/share", true, req, envConfig.STORAGE_URL)
            .then((res) => {
                resolve(toCamelCaseObject(res.data) as IShareBucketObjectUrlResp);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export function deleteBucketAccountRelInterface(req: IDeleteBucketAccountRelReq): Promise<void> {
    return new Promise((resolve, reject) => {
        http
            .post("/bucket/accountRel/delete", true, req, envConfig.STORAGE_URL)
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
}