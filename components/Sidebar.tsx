import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    Target,
    FileCode,
    Settings,
    Zap,
    ChevronLeft,
    ChevronRight,
    Wifi,
    WifiOff
} from 'lucide-react';
import { useAppContext } from './Layout';

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

const navItems = [
    { path: '/', icon: Activity, label: 'Painel' },
    { path: '/targets', icon: Target, label: 'Biblioteca de Alvos' },
    { path: '/patterns', icon: FileCode, label: 'Padrões' },
    { path: '/settings', icon: Settings, label: 'Configuração' },
];

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
    const location = useLocation();
    const { metrics } = useAppContext();

    // Animation variants
    const sidebarVariants = {
        expanded: { width: 288 },
        collapsed: { width: 80 }
    };

    const labelVariants = {
        expanded: { opacity: 1, x: 0, display: 'block' },
        collapsed: { opacity: 0, x: -10, transitionEnd: { display: 'none' } }
    };

    return (
        <motion.aside
            className="glass-panel flex flex-col border-r border-slate-800/50 z-20 h-full"
            variants={sidebarVariants}
            animate={collapsed ? 'collapsed' : 'expanded'}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
            {/* Header */}
            <div className="p-4 border-b border-slate-800/50 flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-hidden">
                    <Zap className="w-5 h-5 text-blue-500 fill-blue-500/20 shrink-0" />
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.div
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden whitespace-nowrap"
                            >
                                <h1 className="text-lg font-bold tracking-tight text-white">
                                    ANTIGRAVITY
                                    <span className="text-blue-500 text-xs align-top font-normal border border-blue-500/30 rounded px-1 ml-1">V5.0</span>
                                </h1>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <button
                    onClick={onToggle}
                    className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors shrink-0"
                >
                    {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1">
                {navItems.map((item, index) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <motion.div
                            key={item.path}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <NavLink
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive
                                        ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-400' : ''}`} />
                                <AnimatePresence>
                                    {!collapsed && (
                                        <motion.span
                                            variants={labelVariants}
                                            initial="collapsed"
                                            animate="expanded"
                                            exit="collapsed"
                                            transition={{ duration: 0.2 }}
                                            className="font-medium text-sm whitespace-nowrap overflow-hidden"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </NavLink>
                        </motion.div>
                    );
                })}
            </nav>

            {/* Bridge Status */}
            <div className="p-3 border-t border-slate-800/50">
                <div className={`p-3 rounded-lg border ${metrics.bridgeStatus === 'connected'
                        ? 'bg-emerald-950/20 border-emerald-500/30'
                        : 'bg-slate-900 border-slate-800'
                    }`}>
                    <div className="flex items-center justify-between">
                        {metrics.bridgeStatus === 'connected'
                            ? <Wifi className="w-4 h-4 text-emerald-500" />
                            : <WifiOff className="w-4 h-4 text-slate-500" />
                        }
                        <AnimatePresence>
                            {!collapsed && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className={`text-xs font-medium ${metrics.bridgeStatus === 'connected' ? 'text-emerald-400' : 'text-slate-500'
                                        }`}
                                >
                                    {metrics.bridgeStatus === 'connected' ? 'Conectado' :
                                        metrics.bridgeStatus === 'connecting' ? 'Conectando...' : 'Desconectado'}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.aside>
    );
};

export default Sidebar;
