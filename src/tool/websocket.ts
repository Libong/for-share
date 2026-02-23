import {envConfig} from "@/config/env/envConfig";

export interface WsOptions {
    url?: string;
    heartbeatInterval?: number;
    reconnectInterval?: number;
    maxReconnectAttempts?: number;
    onOpen?: (ev: Event) => void;
    onClose?: (ev: CloseEvent) => void;
    onMessage?: (data: any) => void;
    onError?: (ev: Event) => void;
}

export class WebSocketClient {
    private socket: WebSocket | null = null;
    private options: WsOptions;
    private url: string;
    private reconnectAttempts = 0;
    private heartbeatTimer: any = null;
    private forcedClose = false;

    constructor(options: WsOptions = {}) {
        this.options = {
            heartbeatInterval: 30000,
            reconnectInterval: 5000,
            maxReconnectAttempts: 10,
            ...options,
        };
        this.url = this.options.url || this.deriveUrl();
    }

    public connect() {
        if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
            return;
        }

        this.forcedClose = false;
        this.socket = new WebSocket(this.url);

        this.socket.onopen = (event) => {
            console.log('[WS] Connected to', this.url);
            this.reconnectAttempts = 0;
            this.startHeartbeat();
            this.options.onOpen?.(event);
        };

        this.socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.options.onMessage?.(data);
            } catch (e) {
                // 如果不是 JSON，直接透传原始数据
                this.options.onMessage?.(event.data);
            }
        };

        this.socket.onclose = (event) => {
            this.stopHeartbeat();
            this.options.onClose?.(event);
            if (!this.forcedClose) {
                this.reconnect();
            }
        };

        this.socket.onerror = (event) => {
            console.error('[WS] Error:', event);
            this.options.onError?.(event);
        };
    }

    public disconnect() {
        this.forcedClose = true;
        this.stopHeartbeat();
        this.socket?.close();
        this.socket = null;
    }

    public send(data: any) {
        if (this.socket?.readyState === WebSocket.OPEN) {
            const message = typeof data === 'string' ? data : JSON.stringify(data);
            this.socket.send(message);
        } else {
            console.warn('[WS] Cannot send message, socket not open');
        }
    }

    private deriveUrl(): string {
        const baseUrl = envConfig.WEBSOCKET_URL;
        let wsUrl = baseUrl;
        if (baseUrl.startsWith('/')) {
            wsUrl = (window.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.location.host + baseUrl;
        }
        return wsUrl.replace(/^http/, 'ws');
    }

    private startHeartbeat() {
        this.stopHeartbeat();
        this.heartbeatTimer = setInterval(() => {
            this.send({type: 'ping'});
        }, this.options.heartbeatInterval);
    }

    private stopHeartbeat() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
    }

    private reconnect() {
        if (this.reconnectAttempts < (this.options.maxReconnectAttempts || 10)) {
            this.reconnectAttempts++;
            console.log(`[WS] Reconnecting attempt ${this.reconnectAttempts}...`);
            setTimeout(() => {
                this.connect();
            }, this.options.reconnectInterval);
        } else {
            console.error('[WS] Max reconnect attempts reached');
        }
    }
}
