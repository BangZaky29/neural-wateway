export interface WhatsAppSession {
    id: string;
    waSessionId?: string;
    name?: string;
    status: 'open' | 'connecting' | 'close' | 'waiting_qr' | 'disconnected';
    isConnected: boolean;
    phoneNumber?: string;
    hasQR?: boolean;
    qrImage?: string;
    isPrimary?: boolean;
    createdAt?: string;
    user?: {
        id?: string;
        name?: string;
        full_name?: string;
        email?: string;
        phone?: string;
        role?: string;
        username?: string;
    };
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    sessions?: WhatsAppSession[];
    instances?: WhatsAppSession[];
    status?: string;
    isConnected?: boolean;
    phoneNumber?: string;
    hasQR?: boolean;
    qrImage?: string;
    user?: { id: string; name: string };
    pairingCode?: string;
}
