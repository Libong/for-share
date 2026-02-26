/**
 * 将目标值重置为“空”形态
 * - 数组  -> []
 * - 对象  -> 每个字段递归清零
 * - 布尔  -> false
 * - 数字  -> 0
 * - 字符串 -> ''
 * - null / undefined 保持不动（可按需改）
 */
export function ObjClear<T>(target: T): T {
    if (Array.isArray(target)) {
        // 直接清空数组
        target.length = 0;
        return target;
    }

    if (target === null || target === undefined) return target;

    if (typeof target !== 'object') {
        // 基本类型兜底，实际调用时不会走到这里
        return target;
    }

    // 普通对象
    for (const key in target) {
        if (!Object.prototype.hasOwnProperty.call(target, key)) continue;

        const val = (target as any)[key];

        if (Array.isArray(val)) {
            (target as any)[key] = [];
        } else if (val && typeof val === 'object') {
            (target as any)[key] = ObjClear(val);
        } else if (typeof val === 'boolean') {
            (target as any)[key] = false;
        } else if (typeof val === 'number') {
            (target as any)[key] = 0;
        } else if (typeof val === 'string') {
            (target as any)[key] = '';
        }
        // null / undefined 保持原样
    }
    return target;
}

// 转换函数，将驼峰式命名转换为下划线式命名
export function toSnakeCase(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(toSnakeCase);
    }

    let result: { [key: string]: any } = {};
    for (const [key, value] of Object.entries(obj)) {
        const snakeCaseKey = key.replace(/([A-Z])/g, (match) => `_${match.toLowerCase()}`).replace(/^_/, '');
        result[snakeCaseKey] = toSnakeCase(value);
    }
    return result;
}

function toCamelCase(str: string): string {
    return str.replace(/(_\w)/g, (m) => m[1].toUpperCase());
}

export function toCamelCaseObject(obj: any): any {
    if (typeof obj === 'object' && obj !== null) {
        if (Array.isArray(obj)) {
            return obj.map(toCamelCaseObject);
        } else {
            const newObj: { [key: string]: any } = {};
            Object.keys(obj).forEach(key => {
                const camelCaseKey = toCamelCase(key);
                newObj[camelCaseKey] = toCamelCaseObject(obj[key]);
            });
            return newObj;
        }
    }
    return obj;
}

//毫秒和秒互转
export function toSecondOrMilli(timestamp: number, toSecond: boolean): number {
    //如果是毫秒 转秒
    if (toSecond) {
        timestamp = Math.floor(timestamp / 1000);
    } else {
        timestamp *= 1000;
    }
    return timestamp;
}

export interface ShelfLife {
    DateType: string;
    Num: number;
}

//时间戳转换为保质期
export function calculateShelfLife(production: number, expiry: number): ShelfLife {
    let shelfLife: ShelfLife = {
        DateType: "",
        Num: 0,
    };
    const differenceInMilliseconds = expiry - production;

    if (differenceInMilliseconds < 0) {
        return shelfLife;
    }

    const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // 1 day in milliseconds
    const totalDays = Math.floor(differenceInMilliseconds / oneDayInMilliseconds);

    if (totalDays === 0) {
        return shelfLife;
    }

    // Check for exactly divisible by a year
    if (totalDays % 365 === 0) {
        const years = totalDays / 365;
        shelfLife.DateType = "年";
        shelfLife.Num = years;
    } else if (totalDays % 30 === 0) {
        const months = totalDays / 30;
        shelfLife.DateType = "月";
        shelfLife.Num = months;
    } else {
        shelfLife.DateType = "日";
        shelfLife.Num = totalDays;
    }
    return shelfLife;
}

export function timestampToYYYYMMDD(timestamp: number, remY?: boolean): string {
    // 如果时间戳是秒级的，需要转换为毫秒
    if (timestamp.toString().length === 10) {
        timestamp *= 1000;
    }

    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1
    const day = String(date.getDate()).padStart(2, '0');
    if (remY) {
        return `${month}-${day}`;
    }
    return `${year}-${month}-${day}`;
}

export function isPlainObject(value: any): value is Record<string, unknown> {
    return value !== null &&
        typeof value === 'object' &&
        Object.prototype.toString.call(value) === '[object Object]';
}