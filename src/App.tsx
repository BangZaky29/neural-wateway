import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QRScanner } from './features/connector/QRScanner'
import { DashboardStats } from './features/dashboard/DashboardStats'
import { BotRegistry } from './features/ai-map/BotRegistry'
import { Navbar } from './components/shared/Navbar'

function App() {
    const [activeTab, setActiveTab] = useState<'connector' | 'dashboard' | 'aimap'>('connector')

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
