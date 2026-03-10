import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Smartphone, LogOut, RefreshCw, CheckCircle2 } from 'lucide-react';
import { whatsappApi } from '../../api/whatsapp.api';

export const QRScanner: React.FC = () => {
    const [sessionId, setSessionId] = useState('main-session');
    const [status, setStatus] = useState<any>(null);
    const [qrImage, setQrImage] = useState<string | null>(null);
    const [pairingCode, setPairingCode] = useState<string | null>(null);
    const [linkMode, setLinkMode] = useState<'qr' | 'phone'>('qr');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchStatus = useCallback(async () => {
        try {
            const data = await whatsappApi.getStatus(sessionId);
            setStatus(data);
            if (data.hasQR) {
                const qr = await whatsappApi.getQR(sessionId);
                setQrImage(qr || null);
                if (linkMode === 'phone' && !pairingCode) {
                    const pCode = await whatsappApi.getPairingCode(sessionId);
                    setPairingCode(pCode || null);
                }
            } else {
                setQrImage(null);
                setPairingCode(null);
            }
        } catch (err) {
            console.error('Fetch status failed', err);
        }
    }, [sessionId, linkMode, pairingCode]);

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 5000);
        return () => clearInterval(interval);
    }, [fetchStatus]);

    // Auto-initiate session if not connected
    useEffect(() => {
        if (status && !status.isConnected && status.status === 'disconnected' && !loading) {
            whatsappApi.init(sessionId).catch(e => console.error('Auto-init failed', e));
        }
    }, [sessionId, status, loading]);

    const handleInitWithPhone = async () => {
        if (!phoneNumber) return;
        setLoading(true);
        try {
            await whatsappApi.initWithPhone(sessionId, phoneNumber);
            setLinkMode('phone');
        } catch (err) {
            alert('Failed to initialize phone linking');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        if (window.confirm('Are you sure you want to logout?')) {
            await whatsappApi.logout(sessionId);
            fetchStatus();
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Session Sidebar */}
            <div className="lg:col-span-3 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-6 px-4">Active Instances</h3>
                {['main-session', 'CS-BOT', 'wa-bot-ai-1'].map((id) => (
                    <button
                        key={id}
                        onClick={() => setSessionId(id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 ${sessionId === id
                            ? 'bg-whatsapp-soft/30 border-whatsapp-light shadow-lg shadow-whatsapp-light/10 transform scale-[1.02]'
                            : 'bg-white border-slate-100 hover:border-whatsapp-soft hover:bg-slate-50'
                            }`}
                    >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${sessionId === id ? 'bg-whatsapp-light text-white' : 'bg-slate-100 text-slate-400'
                            }`}>
                            {id === 'main-session' ? '⚡' : id.startsWith('wa-bot-ai') ? '🤖' : '🏢'}
                        </div>
                        <div className="text-left">
                            <p className={`font-black uppercase text-[10px] tracking-widest ${sessionId === id ? 'text-whatsapp-teal' : 'text-slate-400'
                                }`}>
                                {id === 'main-session' ? 'Master' : 'Bot AI'}
                            </p>
                            <p className={`font-bold text-sm truncate w-24 ${sessionId === id ? 'text-slate-900' : 'text-slate-500'
                                }`}>{id}</p>
                        </div>
                    </button>
                ))}
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9 space-y-8">
                <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-whatsapp-soft/20 rounded-full -mr-32 -mt-32 blur-3xl"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1 space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-whatsapp-soft/30 rounded-full border border-whatsapp-light/20">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-whatsapp-light opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-whatsapp-light"></span>
                                </span>
                                <span className="text-[10px] font-black text-whatsapp-teal uppercase tracking-widest">
                                    {status?.isConnected ? 'Active Tunnel' : 'Sync Pending'}
                                </span>
                            </div>

                            <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight">
                                Connect your <span className="text-whatsapp-teal">Nexus Node</span>
                            </h2>

                            <p className="text-slate-500 font-medium leading-relaxed max-w-md">
                                Securely link your WhatsApp account to enable automated responses and AI-powered interactions.
                            </p>

                            <div className="flex bg-slate-100 p-1.5 rounded-2xl self-start">
                                <button
                                    onClick={() => setLinkMode('qr')}
                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${linkMode === 'qr' ? 'bg-white text-whatsapp-teal shadow-sm' : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                >
                                    <QrCode className="w-4 h-4" /> QR Code
                                </button>
                                <button
                                    onClick={() => setLinkMode('phone')}
                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${linkMode === 'phone' ? 'bg-white text-whatsapp-teal shadow-sm' : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                >
                                    <Smartphone className="w-4 h-4" /> Phone Linking
                                </button>
                            </div>
                        </div>

                        <div className="flex shrink-0">
                            <AnimatePresence mode="wait">
                                {status?.isConnected ? (
                                    <motion.div
                                        key="connected"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="flex flex-col items-center"
                                    >
                                        <div className="w-64 h-64 bg-whatsapp-soft/30 rounded-[3rem] border-4 border-whatsapp-light flex items-center justify-center shadow-2xl">
                                            <CheckCircle2 className="w-32 h-32 text-whatsapp-light" />
                                        </div>
                                        <div className="mt-8 text-center">
                                            <p className="font-black text-slate-900 text-xl">Verified Connection</p>
                                            <p className="text-slate-400 font-bold text-sm mt-1">+{status.phoneNumber}</p>
                                            <button
                                                onClick={handleLogout}
                                                className="mt-6 flex items-center gap-2 px-6 py-3 bg-red-50 text-red-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-100 transition-all"
                                            >
                                                <LogOut className="w-4 h-4" /> Disconnect
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : linkMode === 'qr' ? (
                                    <motion.div
                                        key="qr"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="bg-white p-6 rounded-[3rem] shadow-2xl border-4 border-slate-50 group hover:scale-[1.02] transition-transform duration-500"
                                    >
                                        {qrImage ? (
                                            <img src={qrImage} alt="WhatsApp QR" className="w-56 h-56 rounded-2xl" />
                                        ) : (
                                            <div className="w-56 h-56 bg-slate-50 flex items-center justify-center rounded-2xl border-2 border-dashed border-slate-200">
                                                <RefreshCw className="w-12 h-12 text-slate-300 animate-spin" />
                                            </div>
                                        )}
                                        <div className="mt-6 text-center">
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Scan via WhatsApp</p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="phone"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="w-full max-w-sm space-y-6"
                                    >
                                        {pairingCode ? (
                                            <div className="bg-slate-50 p-8 rounded-[2.5rem] border-2 border-whatsapp-soft flex flex-col items-center gap-6">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registration Code</p>
                                                <div className="flex gap-2">
                                                    {pairingCode.split('').map((c, i) => (
                                                        <div key={i} className="w-10 h-14 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-2xl font-black text-whatsapp-teal">
                                                            {c}
                                                        </div>
                                                    ))}
                                                </div>
                                                <p className="text-[10px] text-center text-slate-400 font-bold leading-relaxed px-4">
                                                    Enter this code on: <br /> Linked Devices &gt; Link with Phone
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <input
                                                    type="text"
                                                    placeholder="62812XXXX"
                                                    value={phoneNumber}
                                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                                    className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-xl text-slate-800 focus:border-whatsapp-light outline-none transition-all"
                                                />
                                                <button
                                                    onClick={handleInitWithPhone}
                                                    disabled={loading}
                                                    className="w-full py-5 wh-gradient text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-whatsapp-light/20 active:scale-95 transition-all"
                                                >
                                                    {loading ? 'Processing...' : 'Generate Pairing Code'}
                                                </button>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
