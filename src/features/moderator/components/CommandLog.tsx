import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { History, CheckCircle2, XCircle, ShieldAlert, Clock, RefreshCw } from 'lucide-react';
import { moderatorApi, ModeratorLog } from '../../../api/moderator.api';

export const CommandLog: React.FC = () => {
    const [logs, setLogs] = useState<ModeratorLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const data = await moderatorApi.getLogs(100);
            setLogs(data);
        } catch (err) {
            console.error('Failed to fetch logs', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchLogs(); }, []);

    const filteredLogs = filter === 'all' ? logs : logs.filter(l => l.status === filter);

    const statusConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
        success: {
            icon: <CheckCircle2 className="w-4 h-4" />,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10 border-emerald-500/20'
        },
        failed: {
            icon: <XCircle className="w-4 h-4" />,
            color: 'text-red-400',
            bg: 'bg-red-500/10 border-red-500/20'
        },
        blocked: {
            icon: <ShieldAlert className="w-4 h-4" />,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10 border-amber-500/20'
        },
        cancelled: {
            icon: <XCircle className="w-4 h-4" />,
            color: 'text-slate-400',
            bg: 'bg-slate-500/10 border-slate-500/20'
        },
    };

    const actionLabels: Record<string, string> = {
        delete_media: '🗑️ Hapus Media',
        activate_package: '📦 Aktifkan Paket',
        add_tokens: '💰 Tambah Token',
        reset_tokens: '🔄 Reset Token',
        get_user_info: '📋 Info User',
        block_contact: '🚫 Blokir Kontak',
        list_users: '📋 Daftar User',
        deactivate_bot: '⏸️ Nonaktifkan Bot',
        activate_bot: '▶️ Aktifkan Bot',
        unknown: '❓ Tidak Dikenali',
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-white">Command Log</h2>
                    <p className="text-slate-500 text-sm mt-1">{logs.length} total commands executed</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Filter */}
                    <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/10">
                        {['all', 'success', 'blocked', 'failed'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                                    filter === f
                                        ? 'bg-violet-600/30 text-violet-300 border border-violet-500/30'
                                        : 'text-slate-500 hover:text-slate-300'
                                }`}
                            >
                                {f === 'all' ? 'Semua' : f}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={fetchLogs}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2.5 bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-400 rounded-xl text-xs font-bold transition-all"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Logs */}
            <div className="space-y-2">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <RefreshCw className="w-8 h-8 text-violet-500 animate-spin" />
                    </div>
                ) : filteredLogs.length === 0 ? (
                    <div className="text-center py-20 text-slate-600">
                        <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="font-bold">Belum ada log</p>
                    </div>
                ) : (
                    filteredLogs.map((log, idx) => {
                        const sc = statusConfig[log.status] || statusConfig.failed;
                        return (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.02 }}
                                className={`flex items-start gap-4 p-4 rounded-2xl border bg-white/[0.02] ${sc.bg} transition-all hover:bg-white/[0.04]`}
                            >
                                {/* Status Icon */}
                                <div className={`mt-0.5 ${sc.color}`}>
                                    {sc.icon}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 space-y-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-xs font-bold text-white">
                                            {actionLabels[log.parsed_action] || log.parsed_action}
                                        </span>
                                        {log.target_identifier && (
                                            <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-md">
                                                🎯 {log.target_identifier}
                                            </span>
                                        )}
                                        <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${sc.bg} ${sc.color}`}>
                                            {log.status}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 truncate">
                                        <span className="text-slate-600">Command:</span> {log.raw_command}
                                    </p>
                                    {log.reason && (
                                        <p className="text-[11px] text-amber-400/70 truncate">
                                            ⚠️ {log.reason}
                                        </p>
                                    )}
                                </div>

                                {/* Time */}
                                <div className="text-right shrink-0">
                                    <div className="text-[10px] text-slate-500 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {new Date(log.executed_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="text-[9px] text-slate-600 mt-0.5">
                                        {new Date(log.executed_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
