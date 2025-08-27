import {ElMessage} from "element-plus";

export function ShowCommonMessage(msg: string, typeName: "success" | "warning" | "error" | "info") {
    ElMessage({
        message: msg,
        type: typeName,
        plain: true,
        customClass: "global-message",
        duration: 1000
    });
}