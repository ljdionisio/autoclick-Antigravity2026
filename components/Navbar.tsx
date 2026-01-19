import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Lock, Play, Pause } from 'lucide-react';
import { BreadcrumbItem } from '../types';
import { useAppContext } from './Layout';

interface NavbarProps {
    breadcrumbs: BreadcrumbItem[];
}

const Navbar: React.FC<NavbarProps> = ({ breadcrumbs }) => {
    const { metrics, setMetrics } = useAppContext();
    const [isScanning, setIsScanning] = React.useState(false);

    const toggleScanning = () => {
        if (metrics.safetyLockActive) {
            setMetrics(m => ({ ...m, safetyLockActive: false, filesChangedCurrentBatch: 0 }));
        }
        setIsScanning(!isScanning);
    };

    return (
        <header className="h-16 border-b border-slate-800/50 glass-panel flex justify-between items-center px-6 z-10 shrink-0">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2">
                {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={crumb.path}>
                        {index > 0 && <ChevronRight className="w-4 h-4 text-slate-600" />}
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            {index === breadcrumbs.length - 1 ? (
                                <span className="text-sm font-medium text-white">{crumb.label}</span>
                            ) : (
                                <Link
                                    to={crumb.path}
                                    className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
                                >
                                    {crumb.label}
                                </Link>
                            )}
                        </motion.div>
                    </React.Fragment>
                ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                {/* Metrics */}
                <div className="hidden md:flex gap-6 mr-4">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider">Tempo Ativo</span>
                        <span className="font-mono text-sm text-slate-300">{metrics.uptime}</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider">Cliques</span>
                        <span className="font-mono text-sm text-blue-400">{metrics.totalClicks.toLocaleString()}</span>
                    </div>
                </div>

                {/* Safety Lock Indicator */}
                {metrics.safetyLockActive && (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/50 rounded-md text-red-500"
                    >
                        <Lock className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold uppercase tracking-wide">Trava Ativa</span>
                    </motion.div>
                )}

                {/* Main Action Button */}
                <motion.button
                    onClick={toggleScanning}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-2 px-5 py-2 rounded-md font-semibold text-sm transition-all duration-200 ${metrics.safetyLockActive
                            ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/30'
                            : isScanning
                                ? 'bg-amber-500/10 text-amber-500 border border-amber-500/50 hover:bg-amber-500/20'
                                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30'
                        }`}
                >
                    {metrics.safetyLockActive ? (
                        'REINICIAR'
                    ) : isScanning ? (
                        <><Pause className="w-4 h-4 fill-current" /> PAUSAR</>
                    ) : (
                        <><Play className="w-4 h-4 fill-current" /> ATIVAR</>
                    )}
                </motion.button>
            </div>
        </header>
    );
};

export default Navbar;
