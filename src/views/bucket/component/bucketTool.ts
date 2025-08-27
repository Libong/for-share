import {toSecondOrMilli} from "@/tool/tool";

export function timestamp2DateStr(timestamp: number): string {
    if (timestamp == 0) {
        return "";
    }
    const date = new Date(toSecondOrMilli(timestamp, false));
    const formatTwoDigits = (number: number) => number.toString().padStart(2, '0');
    return formatTwoDigits(date.getFullYear()) + '-' + formatTwoDigits(date.getMonth() + 1) + '-' + formatTwoDigits(date.getDate());
}

//空间大小单位
export function formatSizeTransfer(bytes: number): string {
    if (bytes === 0) return '0 B'

    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}