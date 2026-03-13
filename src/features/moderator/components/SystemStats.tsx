import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Image, Coins, Package, Shield, Activity, RefreshCw } from 'lucide-react';
import { moderatorApi, SystemStats as StatsType } from '../../../api/moderator.api';

export const SystemStats: React.FC = () => {
    const [stats, setStats] = useState<StatsType | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const data = await moderatorApi.getStats();
            setStats(data);
        } catch (err) {
            console.error('Failed to fetch stats', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStats(); }, []);

    const cards = stats ? [
        {
            label: 'Total Users',
            value: stats.totalUsers,
            icon: <Users className="w-5 h-5" />,
            gradient: 'from-violet-600 to-purple-700',
            shadow: 'shadow-violet-600/20'
        },
        {
            label: 'Media Files',
            value: stats.totalMedia,
            icon: <Image className="w-5 h-5" />,
            gradient: 'from-blue-600 to-cyan-600',
            shadow: 'shadow-blue-600/20'
        },
        {
            label: 'Token Transaksi',
            value: stats.totalTransactions,
            icon: <Coins className="w-5 h-5" />,
            gradient: 'from-amber-500 to-orange-600',
            shadow: 'shadow-amber-500/20'
        },
        {
            label: 'Paket Aktif',
            value: stats.activeSubscriptions,
            icon: <Package className="w-5 h-5" />,
            gradient: 'from-emerald-500 to-teal-600',
            shadow: 'shadow-emerald-500/20'
        },
        {
            label: 'Token Didistribusi',
            value: stats.totalTokensDistributed.toLocaleString('id-ID'),
            icon: <Activity className="w-5 h-5" />,
            gradient: 'from-pink-500 to-rose-600',
            shadow: 'shadow-pink-500/20'
        },
        {
            label: 'Moderator Actions',
            value: stats.totalModeratorActions,
            icon: <Shield className="w-5 h-5" />,
            gradient: 'from-indigo-500 to-violet-600',
            shadow: 'shadow-indigo-500/20'
        },
    ] : [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-white">System Statistics</h2>
                    <p className="text-slate-500 text-sm mt-1">Statistik global platform WA-BOT-AI</p>
                </div>
                <button
                    onClick={fetchStats}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2.5 bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-400 rounded-xl text-xs font-bold transition-all"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Stats Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <RefreshCw className="w-8 h-8 text-violet-500 animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cards.map((card, idx) => (
                        <motion.div
                            key={card.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.08 }}
                            className="relative group"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl ${card.shadow}`} />
                            <div className="relative bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 hover:border-white/[0.15] transition-all duration-300">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white shadow-lg ${card.shadow}`}>
                                        {card.icon}
                                    </div>
                                </div>
                                <div className="text-3xl font-black text-white tracking-tight">
                                    {card.value}
                                </div>
                                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">
                                    {card.label}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* System Info */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 mt-8">
                <h3 className="text-sm font-bold text-slate-400 mb-3">System Info</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[11px]">
                    <div>
                        <span className="text-slate-600">Platform</span>
                        <p className="text-white font-medium mt-0.5">WA Neural Gateway</p>
                    </div>
                    <div>
                        <span className="text-slate-600">Database</span>
                        <p className="text-white font-medium mt-0.5">Supabase (PostgreSQL)</p>
                    </div>
                    <div>
                        <span className="text-slate-600">AI Engine</span>
                        <p className="text-white font-medium mt-0.5">Gemini 2.0 Flash</p>
                    </div>
                    <div>
                        <span className="text-slate-600">Moderator</span>
                        <p className="text-violet-400 font-medium mt-0.5">✅ Active</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
