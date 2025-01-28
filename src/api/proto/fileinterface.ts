import http from "@/tool/http";
import {toCamelCaseObject} from "@/tool/tool";

export enum UploadFileType {
    UploadFileTypeImage = 2,
    UploadFileTypeFile = 1
}

export interface IFileUpdateResp {
    Name: string,
    Url: string,
}

export function fileUploadInterface(fileData: FormData, params: object): Promise<IFileUpdateResp> {
    return new Promise((resolve, reject) => {
        http
            .filePost("/x/api/upload", true, fileData, params)
            .then((res) => {
                resolve(toCamelCaseObject(res.data) as IFileUpdateResp);
            })
            .catch((err) => {
                reject(err);
            });
    });
}