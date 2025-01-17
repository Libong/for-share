interface EnvConfig {
    apiBaseUrl: string
    appEnv: string
    mockEnabled: boolean
}

export const env: EnvConfig = {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
    appEnv: import.meta.env.VITE_APP_ENV,
    mockEnabled: import.meta.env.VITE_MOCK_ENABLED === 'true'
}

export const isDev = env.appEnv === 'dev'
export const isProd = env.appEnv === 'prod'
export const isMockEnabled = env.mockEnabled

export function getApiUrl(path: string): string {
    return `${env.apiBaseUrl}${path}`
}

// 用于调试的环境信息打印
if (isDev) {
    console.log('当前环境配置:', {
        环境: env.appEnv,
        API地址: env.apiBaseUrl,
        是否启用Mock: env.mockEnabled
    })
}