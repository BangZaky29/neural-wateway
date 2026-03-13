import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, Mail, Coins, Package, Image, Search, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { moderatorApi, UserInfo } from '../../../api/moderator.api';

export const UserList: React.FC = () => {
    const [users, setUsers] = useState<UserInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [expandedUser, setExpandedUser] = useState<string | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await moderatorApi.getUsers();
            setUsers(data);
        } catch (err) {
            console.error('Failed to fetch users', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const filteredUsers = users.filter(u => {
        const q = search.toLowerCase();
        return (u.full_name?.toLowerCase().includes(q) ||
            u.phone?.includes(q) ||
            u.username?.toLowerCase().includes(q) ||
            u.email?.toLowerCase().includes(q));
    });

    const getRoleBadge = (role: string) => {
        if (role === 'moderator') {
            return <span className="px-2 py-0.5 bg-violet-500/20 text-violet-400 text-[10px] font-black uppercase tracking-wider rounded-md border border-violet-500/30">Moderator</span>;
        }
        return <span className="px-2 py-0.5 bg-slate-500/20 text-slate-400 text-[10px] font-black uppercase tracking-wider rounded-md border border-slate-500/30">User</span>;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-white">User Management</h2>
                    <p className="text-slate-500 text-sm mt-1">{users.length} registered users</p>
                </div>
                <button
                    onClick={fetchUsers}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2.5 bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-400 rounded-xl text-xs font-bold transition-all"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                    type="text"
                    placeholder="Cari user (nama, phone, username, email)..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white text-sm font-medium placeholder:text-slate-600 focus:border-violet-500/50 focus:outline-none transition-all"
                />
            </div>

            {/* User Cards */}
            <div className="space-y-3">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <RefreshCw className="w-8 h-8 text-violet-500 animate-spin" />
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-20 text-slate-600">
                        <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="font-bold">Tidak ada user ditemukan</p>
                    </div>
                ) : (
                    filteredUsers.map((user, idx) => (
                        <motion.div
                            key={user.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.03 }}
                            className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-violet-500/20 transition-all"
                        >
                            {/* Main Row */}
                            <button
                                onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                                className="w-full flex items-center gap-4 p-4 text-left"
                            >
                                {/* Avatar */}
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                                    user.role === 'moderator'
                                        ? 'bg-gradient-to-br from-violet-600 to-purple-700 text-white'
                                        : 'bg-white/10 text-slate-400'
                                }`}>
                                    {(user.full_name || user.username || 'U').charAt(0).toUpperCase()}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-white text-sm truncate">
                                            {user.full_name || user.username || 'N/A'}
                                        </span>
                                        {getRoleBadge(user.role)}
                                    </div>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                                            <Phone className="w-3 h-3" /> {user.phone}
                                        </span>
                                        {user.username && (
                                            <span className="text-[11px] text-slate-500">@{user.username}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="hidden md:flex items-center gap-4">
                                    <div className="text-center px-3">
                                        <div className="text-xs font-bold text-white">{user.token_balance ?? 0}</div>
                                        <div className="text-[9px] text-slate-600 uppercase tracking-wider">Token</div>
                                    </div>
                                    <div className="text-center px-3">
                                        <div className="text-xs font-bold text-white">{user.media_count ?? 0}</div>
                                        <div className="text-[9px] text-slate-600 uppercase tracking-wider">Media</div>
                                    </div>
                                    <div className="text-center px-3">
                                        <div className={`text-xs font-bold ${user.active_package ? 'text-emerald-400' : 'text-slate-600'}`}>
                                            {user.active_package || '—'}
                                        </div>
                                        <div className="text-[9px] text-slate-600 uppercase tracking-wider">Paket</div>
                                    </div>
                                </div>

                                {/* Expand Icon */}
                                {expandedUser === user.id
                                    ? <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                                    : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                                }
                            </button>

                            {/* Expanded Detail */}
                            <AnimatePresence>
                                {expandedUser === user.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-4 pb-4 pt-2 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="bg-white/5 rounded-xl p-3">
                                                <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                                                    <Mail className="w-3 h-3" /> Email
                                                </div>
                                                <div className="text-xs text-white font-medium truncate">{user.email || '—'}</div>
                                            </div>
                                            <div className="bg-white/5 rounded-xl p-3">
                                                <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                                                    <Coins className="w-3 h-3" /> Total Terpakai
                                                </div>
                                                <div className="text-xs text-white font-medium">{user.total_used ?? 0} token</div>
                                            </div>
                                            <div className="bg-white/5 rounded-xl p-3">
                                                <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                                                    <Package className="w-3 h-3" /> Paket Aktif
                                                </div>
                                                <div className={`text-xs font-medium ${user.active_package ? 'text-emerald-400' : 'text-slate-500'}`}>
                                                    {user.active_package || 'Tidak ada'}
                                                </div>
                                            </div>
                                            <div className="bg-white/5 rounded-xl p-3">
                                                <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                                                    <Image className="w-3 h-3" /> Media Files
                                                </div>
                                                <div className="text-xs text-white font-medium">{user.media_count ?? 0} file</div>
                                            </div>
                                        </div>
                                        <div className="px-4 pb-4">
                                            <p className="text-[10px] text-slate-600">
                                                ID: {user.id} • Bergabung: {new Date(user.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};
