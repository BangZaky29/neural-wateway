export interface WhatsAppSession {
    id: string;
    name: string;
    status: 'open' | 'connecting' | 'close' | 'waiting_qr';
    isConnected: boolean;
    phoneNumber?: string;
    hasQR: boolean;
    qrImage?: string;
    user?: {
        id: string;
        name: string;
    };
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    sessions?: WhatsAppSession[];
    status?: string;
    isConnected?: boolean;
    phoneNumber?: string;
    hasQR?: boolean;
    qrImage?: string;
    user?: { id: string; name: string };
    pairingCode?: string;
}
