import React from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, Cpu, Link2, Settings } from 'lucide-react';

interface NavbarProps {
    activeTab: string;
    setActiveTab: (tab: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
    const navItems = [
        { id: 'connector', label: 'Connector', icon: <Link2 className="w-5 h-5" /> },
        { id: 'dashboard', label: 'Monitor', icon: <LayoutGrid className="w-5 h-5" /> },
        { id: 'aimap', label: 'AI Bot Map', icon: <Cpu className="w-5 h-5" /> },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-whatsapp-soft/50 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-whatsapp-light rounded-xl flex items-center justify-center shadow-lg shadow-whatsapp-light/30">
                        <span className="text-white text-2xl font-bold">W</span>
                    </div>
                    <span className="text-xl font-black tracking-tighter text-slate-800">
                        NEURAL<span className="text-whatsapp-teal">GATEWAY</span>
                    </span>
                </div>

                <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`relative flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === item.id
                                    ? 'text-whatsapp-teal'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                                }`}
                        >
                            {activeTab === item.id && (
                                <motion.div
                                    layoutId="active-nav"
                                    className="absolute inset-0 bg-white shadow-sm rounded-xl"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{item.icon}</span>
                            <span className="relative z-10">{item.label}</span>
                        </button>
                    ))}
                </div>

                <button className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                    <Settings className="w-6 h-6 text-slate-500" />
                </button>
            </div>
        </nav>
    );
};
