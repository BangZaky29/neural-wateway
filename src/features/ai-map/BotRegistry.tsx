import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Users, Layers, ExternalLink } from 'lucide-react';
import { whatsappApi } from '../../api/whatsapp.api';
import { WhatsAppSession } from '../../types';

export const BotRegistry: React.FC = () => {
    const [sessions, setSessions] = useState<WhatsAppSession[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await whatsappApi.getEnrichedInstances();
                // Neural Map specifically shows the modular AI bot instances
                setSessions(data.filter(s => s.id.startsWith('wa-bot-ai-')));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
        const inv = setInterval(load, 10000);
        return () => clearInterval(inv);
    }, []);

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter">AI Bot <span className="text-whatsapp-teal">Neural Map</span></h2>
                    <p className="text-slate-500 font-medium mt-2">Active instances linked to wa_ai platform subscribers.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white px-6 py-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-whatsapp-light" />
                        <span className="text-sm font-black text-slate-600">{sessions.filter(s => s.isConnected).length} ONLINE</span>
                    </div>
                    <div className="bg-white px-6 py-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-slate-300" />
                        <span className="text-sm font-black text-slate-600">{sessions.length} TOTAL</span>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-slate-50 animate-pulse rounded-[2.5rem]" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sessions.map((session, i) => (
                        <motion.div
                            key={session.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`group bg-white p-8 rounded-[2.5rem] border-2 transition-all duration-500 relative overflow-hidden ${session.isConnected
                                ? 'border-whatsapp-soft shadow-xl shadow-whatsapp-light/5 hover:border-whatsapp-light'
                                : 'border-slate-100 hover:border-slate-200 grayscale opacity-60'
                                }`}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-whatsapp-soft/10 rounded-full -mr-16 -mt-16 transform transition-transform group-hover:scale-150 duration-700"></div>

                            <div className="relative z-10 flex items-center justify-between mb-8">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${session.isConnected ? 'bg-whatsapp-light text-white shadow-lg shadow-whatsapp-light/30' : 'bg-slate-100 text-slate-400'
                                    }`}>
                                    <Cpu className="w-7 h-7" />
                                </div>
                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${session.isConnected ? 'bg-whatsapp-soft text-whatsapp-teal' : 'bg-slate-100 text-slate-400'
                                    }`}>
                                    {session.isConnected ? 'Operational' : 'Idle'}
                                </div>
                            </div>

                            <div className="relative z-10 space-y-2">
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                                    {session.id.toUpperCase()}
                                    {session.isConnected && <Layers className="w-4 h-4 text-whatsapp-teal" />}
                                </h3>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                    Instance ID • {session.id.replace('wa-bot-ai-', '')}
                                </p>

                                <div className="pt-8 mt-8 border-t border-slate-50 flex items-center justify-between">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <Users className="w-4 h-4 text-slate-400 shrink-0" />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-600 truncate">
                                                {session.user?.full_name || session.user?.username || 'Enterprise User'}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-medium">
                                                {session.user?.email || 'System Account'}
                                            </span>
                                        </div>
                                    </div>
                                    <button className="p-2 hover:bg-slate-50 rounded-lg text-whatsapp-teal transition-colors">
                                        <ExternalLink className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    <button className="flex flex-col items-center justify-center p-8 rounded-[2.5rem] border-4 border-dashed border-slate-100 text-slate-300 hover:border-whatsapp-soft hover:text-whatsapp-teal transition-all group">
                        <div className="w-16 h-16 rounded-full border-4 border-current flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <span className="text-4xlfont-bold">+</span>
                        </div>
                        <p className="font-black uppercase tracking-widest text-sm text-center">Spawn New<br />Neural Instance</p>
                    </button>
                </div>
            )}
        </div>
    );
};
