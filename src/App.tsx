import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QRScanner } from './features/connector/QRScanner'
import { DashboardStats } from './features/dashboard/DashboardStats'
import { BotRegistry } from './features/ai-map/BotRegistry'
import { Navbar } from './components/shared/Navbar'
import { ModeratorDashboard } from './features/moderator/ModeratorDashboard'
import { moderatorApi } from './api/moderator.api'
import { whatsappApi } from './api/whatsapp.api'

function App() {
    const [activeTab, setActiveTab] = useState<'connector' | 'dashboard' | 'aimap'>('connector')
    const [userRole, setUserRole] = useState<string | null>(null)
    const [roleLoading, setRoleLoading] = useState(true)

    // Check user role on mount
    useEffect(() => {
        const checkRole = async () => {
            try {
                let targetPhone: string | null = null;

                // 1. Try to get connected phone from main session status
                try {
                    const status = await whatsappApi.getStatus('main-session');
                    if (status?.isConnected && status?.phoneNumber) {
                        targetPhone = status.phoneNumber;
                        console.log('📡 [App] Detected connected phone:', targetPhone);
                    }
                } catch (e) {
                    console.warn('Failed to get session status', e);
                }

                // 2. Fallback to ENV or localStorage if session not connected
                if (!targetPhone) {
                    targetPhone = import.meta.env.VITE_MODERATOR_PHONE || localStorage.getItem('moderator_phone');
                }
                
                if (targetPhone) {
                    const role = await moderatorApi.getUserRole(targetPhone);
                    console.log(`🛡️ [App] Role for ${targetPhone}:`, role);
                    setUserRole(role);
                } else {
                    setUserRole('user');
                }
            } catch (err) {
                console.error('Role check failed', err);
                setUserRole('user');
            } finally {
                setRoleLoading(false);
            }
        }
        checkRole();
        
        // Re-check every 30s to catch connection changes
        const interval = setInterval(checkRole, 30000);
        return () => clearInterval(interval);
    }, [])

    // Loading state
    if (roleLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full"
                />
            </div>
        )
    }

    // Moderator role → show ModeratorDashboard
    if (userRole === 'moderator') {
        return <ModeratorDashboard />
    }

    // Normal user flow
    return (
        <div className="min-h-screen bg-[#fcfdfc] text-slate-800 font-sans selection:bg-whatsapp-soft">
            <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className="max-w-7xl mx-auto px-6 py-12">
                <AnimatePresence mode="wait">
                    {activeTab === 'connector' && (
                        <motion.div
                            key="connector"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <QRScanner />
                        </motion.div>
                    )}

                    {activeTab === 'dashboard' && (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <DashboardStats />
                        </motion.div>
                    )}

                    {activeTab === 'aimap' && (
                        <motion.div
                            key="aimap"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <BotRegistry />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <footer className="py-12 text-center text-slate-400 font-medium text-sm">
                <p>© 2026 WA Neural Gateway • Premium Cloud Infrastructure</p>
            </footer>
        </div>
    )
}

export default App
