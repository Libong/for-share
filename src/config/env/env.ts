interface EnvConfig {
    BASE_URL: string;
    FILE_UPLOAD_URL: string;
    APP_ID: string;
}

const env: EnvConfig = {
    BASE_URL: import.meta.env.VITE_BASE_API || '',
    APP_ID: import.meta.env.VITE_APP_ID || '',
    FILE_UPLOAD_URL: import.meta.env.VITE_FILE_UPLOAD_URL
}

export default env; 