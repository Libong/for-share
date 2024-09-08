export function ObjClear(obj: any) {
    for (let key in obj) {
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