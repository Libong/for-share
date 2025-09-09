interface EnvConfig {
    BASE_URL: string;
    FILE_UPLOAD_URL: string;
    APP_ID: string;
    ENV: string;
    STORAGE_URL: string;
    CRYPT_KEY: string;
}

export const envConfig: EnvConfig = {
    BASE_URL: import.meta.env.VITE_BASE_API || '',
    APP_ID: import.meta.env.VITE_APP_ID || '',
    FILE_UPLOAD_URL: import.meta.env.VITE_FILE_UPLOAD_URL,
    ENV: import.meta.env.VITE_APP_ENV,
    STORAGE_URL: import.meta.env.VITE_STORAGE_URL,
    CRYPT_KEY: import.meta.env.VITE_CRYPT_KEY,
}

export const isDev = envConfig.ENV === 'dev'
export const isProd = envConfig.ENV === 'prod'