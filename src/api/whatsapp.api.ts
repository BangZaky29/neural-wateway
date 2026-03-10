import axios from 'axios';
import { ApiResponse } from '../types';

const API_BASE = import.meta.env.VITE_WA_API_URL || 'http://localhost:3001';

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const whatsappApi = {
    getAllSessions: async () => {
        const { data } = await api.get<ApiResponse<any>>('/');
        return data.sessions || [];
    },

    getStatus: async (sessionId: string) => {
        const { data } = await api.get<ApiResponse<any>>(`/api/whatsapp/${sessionId}/status`, {
            headers: { 'X-Session-Id': sessionId }
        });
        return data;
    },

    getQR: async (sessionId: string) => {
        const { data } = await api.get<ApiResponse<any>>(`/api/whatsapp/${sessionId}/qr`, {
            headers: { 'X-Session-Id': sessionId }
        });
        return data.qrImage;
    },

    init: async (sessionId: string) => {
        const { data } = await api.post<ApiResponse<any>>(`/api/whatsapp/${sessionId}/init`,
            {},
            { headers: { 'X-Session-Id': sessionId } }
        );
        return data;
    },

    initWithPhone: async (sessionId: string, phoneNumber: string) => {
        const { data } = await api.post<ApiResponse<any>>(`/api/whatsapp/${sessionId}/init`,
            { phoneNumber },
            { headers: { 'X-Session-Id': sessionId } }
        );
        return data;
    },

    getPairingCode: async (sessionId: string) => {
        const { data } = await api.get<ApiResponse<any>>(`/api/whatsapp/${sessionId}/pairing-code`, {
            headers: { 'X-Session-Id': sessionId }
        });
        return data.pairingCode;
    },

    logout: async (sessionId: string) => {
        const { data } = await api.post<ApiResponse<any>>(`/api/whatsapp/${sessionId}/logout`, {}, {
            headers: { 'X-Session-Id': sessionId }
        });
        return data.success;
    }
};
