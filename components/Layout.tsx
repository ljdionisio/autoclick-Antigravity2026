import React, { createContext, useContext, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { SystemMetrics, BreadcrumbItem } from '../types';

// Context for global app state
interface AppContextType {
    metrics: SystemMetrics;
    setMetrics: React.Dispatch<React.SetStateAction<SystemMetrics>>;
    sidebarCollapsed: boolean;
    setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext must be used within AppProvider');
    return context;
};

// Route labels for breadcrumbs
const routeLabels: Record<string, string> = {
    '/': 'Painel',
    '/targets': 'Biblioteca de Alvos',
    '/patterns': 'Padrões',
    '/settings': 'Configuração'
};

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [metrics, setMetrics] = useState<SystemMetrics>({
        totalClicks: 1402,
        uptime: '04:12:33',
        filesChangedCurrentBatch: 0,
        bridgeStatus: 'disconnected',
        safetyLockActive: false,
    });

    // Generate breadcrumbs
    const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Antigravity', path: '/' },
        { label: routeLabels[location.pathname] || 'Página', path: location.pathname }
    ];

    // Page transition variants
    const pageVariants = {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 }
    };

    return (
        <AppContext.Provider value={{ metrics, setMetrics, sidebarCollapsed, setSidebarCollapsed }}>
            <div className="flex h-screen bg-[#020617] text-slate-300 font-light overflow-hidden">
                <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

                <main className="flex-1 flex flex-col relative overflow-hidden">
                    <Navbar breadcrumbs={breadcrumbs} />

                    <div className="flex-1 overflow-y-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={location.pathname}
                                variants={pageVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.2, ease: 'easeOut' }}
                                className="h-full"
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </AppContext.Provider>
    );
};

export default Layout;
