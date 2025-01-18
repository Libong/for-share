interface EnvConfig {
    BASE_API: string;
    APP_ID: string;
}

const env: EnvConfig = {
    BASE_API: import.meta.env.VITE_BASE_API || '',
    APP_ID: import.meta.env.VITE_APP_ID || ''
}

export default env; 