export const localStorage_tokenObj_label = "tokenObj";

export const localStorage_token_label = "token";

export const localStorage_refresh_token_label = "refresh_token";

export const localStorage_roleObj_label = "roleObj";

export const localStorage_role_label = "role";

export function GetCurRole(): string {
    const roleObjStr = localStorage.getItem(localStorage_roleObj_label);
    if (roleObjStr) {
        const roleObj = JSON.parse(roleObjStr);
        return roleObj.id;
    }
    return "";
}

export function GetCurToken(): string {
    const tokenObjStr = localStorage.getItem(localStorage_tokenObj_label);
    if (tokenObjStr) {
        const tokenObj = JSON.parse(tokenObjStr);
        return tokenObj.localStorage_token_label;
    }
    return "";
}