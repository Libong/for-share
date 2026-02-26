import {decryptAES, encryptAES} from "@/tool/crypt";
import {envConfig, isProd} from "@/config/env/envConfig";

export const localStorage_tokenObj_label = "tokenObj";

export const localStorage_token_label = "token";

export const localStorage_refresh_token_label = "refresh_token";

export const localStorage_roleObj_label = "roleObj";

export const localStorage_role_label = "role";

export const localStorage_cryptKey_label = "cryptKey";

export async function SetCurRole(roleStr: string) {
    let v: string = roleStr
    if (isProd) {
        const encryptObj = encryptAES(roleStr, envConfig.CRYPT_KEY)
        v = encryptObj.ciphertext + encryptObj.iv
    }
    localStorage.setItem(localStorage_roleObj_label, v);
}

export async function SetCurToken(tokenStr: string) {
    let v: string = tokenStr
    if (isProd) {
        const encryptObj = encryptAES(tokenStr, envConfig.CRYPT_KEY)
        v = encryptObj.ciphertext + encryptObj.iv
    }
    localStorage.setItem(localStorage_tokenObj_label, v);
}

export function GetCurRole(): string {
    let roleObjJson: string
    const roleEncryptStr = localStorage.getItem(localStorage_roleObj_label);
    if (!roleEncryptStr) {
        return '';
    }
    if (isProd) {
        roleObjJson = decryptAES(roleEncryptStr);
    } else {
        roleObjJson = roleEncryptStr
    }
    if (!roleObjJson) {
        return '';
    }
    let roleObj: any
    try {
        roleObj = JSON.parse(roleObjJson);
    } catch (err) {
        return "";
    }
    return roleObj.id;
}

export function GetCurToken(): string {
    let tokenObjJson: string
    const tokenEncryptStr = localStorage.getItem(localStorage_tokenObj_label);
    if (!tokenEncryptStr) {
        return '';
    }
    if (isProd) {
        tokenObjJson = decryptAES(tokenEncryptStr);
    } else {
        tokenObjJson = tokenEncryptStr
    }
    if (!tokenObjJson) {
        return '';
    }
    let tokenObj: any
    try {
        tokenObj = JSON.parse(tokenObjJson);
    } catch (err) {
        return "";
    }
    return tokenObj.localStorage_token_label;
}