import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, History, BarChart3, Shield, Terminal } from 'lucide-react';
import { UserList } from './components/UserList';
import { CommandLog } from './components/CommandLog';
import { SystemStats } from './components/SystemStats';

type ModTab = 'users' | 'logs' | 'stats';

export const ModeratorDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ModTab>('users');

    const tabs = [
        { id: 'users' as ModTab, label: 'Users', icon: <Users className="w-4 h-4" /> },
        { id: 'logs' as ModTab, label: 'Command Log', icon: <History className="w-4 h-4" /> },
        { id: 'stats' as ModTab, label: 'System Stats', icon: <BarChart3 className="w-4 h-4" /> },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white font-sans">
            {/* Moderator Navbar */}
            <nav className="sticky top-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-violet-500/20 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg shadow-violet-600/30">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <span className="text-xl font-black tracking-tighter text-white">
                                MODERATOR<span className="text-violet-400">PANEL</span>
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-400" />
                                </span>
                                <span className="text-[9px] font-bold text-violet-400 uppercase tracking-widest">
                                    God Mode Active
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-violet-500/10">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                                    activeTab === tab.id
                                        ? 'text-white'
                                        : 'text-slate-500 hover:text-slate-300'
                                }`}
                            >
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="mod-active-tab"
                                        className="absolute inset-0 bg-gradient-to-r from-violet-600/30 to-purple-600/30 border border-violet-500/30 rounded-xl"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10">{tab.icon}</span>
                                <span className="relative z-10 hidden sm:inline">{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-lg">
                            <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wide">
                                <Terminal className="w-3 h-3 inline mr-1" />
                                Full Access
                            </span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {activeTab === 'users' && <UserList />}
                {activeTab === 'logs' && <CommandLog />}
                {activeTab === 'stats' && <SystemStats />}
            </main>

            <footer className="py-8 text-center text-slate-600 font-medium text-sm border-t border-white/5">
                <p>© 2026 WA Neural Gateway • Moderator Control Panel</p>
            </footer>
        </div>
    );
};
