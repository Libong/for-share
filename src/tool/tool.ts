export function ObjClear(obj: any) {
    for (let key in obj) {
        if (typeof obj[key] === "boolean") {
            obj[key] = false;
            continue
        }
        obj[key] = typeof obj[key as keyof typeof obj] === "number" ? 0 : "";
    }
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

export function timestampToYYYYMMDD(timestamp: number): string {
    // 如果时间戳是秒级的，需要转换为毫秒
    if (timestamp.toString().length === 10) {
        timestamp *= 1000;
    }

    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}