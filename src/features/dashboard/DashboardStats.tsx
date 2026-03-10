import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Zap, Users } from 'lucide-react';

export const DashboardStats: React.FC = () => {
    const stats = [
        { label: 'System Uptime', value: '99.9%', icon: <Activity className="w-6 h-6" />, color: 'bg-emerald-500' },
        { label: 'Security Layer', value: 'Enabled', icon: <ShieldCheck className="w-6 h-6" />, color: 'bg-blue-500' },
        { label: 'Transmission Speed', value: '45ms', icon: <Zap className="w-6 h-6" />, color: 'bg-yellow-500' },
        { label: 'Active User Load', value: '1.2k', icon: <Users className="w-6 h-6" />, color: 'bg-purple-500' },
    ];

    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-transform duration-300"
                    >
                        <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-current/20`}>
                            {stat.icon}
                        </div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-whatsapp-soft/10 rounded-full -mr-[250px] -mt-[250px] blur-3xl"></div>
                <div className="relative z-10 flex flex-col lg:flex-row gap-16">
                    <div className="flex-1 space-y-8">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Gateway Health <span className="text-whatsapp-teal">Telemetry</span></h2>
                        <div className="space-y-6">
                            {[
                                { label: 'API Endpoint Response', value: 85 },
                                { label: 'Database Sync Latency', value: 92 },
                                { label: 'Webhook Delivery Rate', value: 78 },
                            ].map((item, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between text-sm font-black uppercase tracking-widest">
                                        <span className="text-slate-500">{item.label}</span>
                                        <span className="text-whatsapp-teal">{item.value}%</span>
                                    </div>
                                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.value}%` }}
                                            transition={{ duration: 1.5, delay: 0.5 }}
                                            className="h-full wh-gradient rounded-full"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="lg:w-96 bg-slate-950 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-500/20">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                                <Activity className="w-6 h-6 text-whatsapp-light" />
                            </div>
                            <h3 className="text-xl font-bold tracking-tight">Live Traffic</h3>
                        </div>
                        <div className="space-y-6">
                            {[1, 2, 3, 4].map((_, i) => (
                                <div key={i} className="flex gap-4 items-center">
                                    <div className="w-2 h-2 rounded-full bg-whatsapp-light animate-pulse" />
                                    <div className="flex-1">
                                        <div className="h-2 bg-white/10 rounded-full mb-2 w-full" />
                                        <div className="h-2 bg-white/5 rounded-full w-2/3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all">
                            Access Logs
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
