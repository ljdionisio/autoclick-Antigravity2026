import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    Eye,
    MousePointer2,
    Terminal,
    ShieldCheck,
    ShieldAlert,
    Lock
} from 'lucide-react';
import { useAppContext } from '../components/Layout';
import AnimatedList from '../components/AnimatedList';
import { LogEntry, TargetButton } from '../types';

const INITIAL_TARGETS: TargetButton[] = [
    { id: '1', name: 'Aceitar Alteração', triggerText: 'Accept', color: '#2563EB', confidenceThreshold: 0.92, shortcut: '⌘+Enter', status: 'active' },
    { id: '2', name: 'Rejeitar Alteração', triggerText: 'Reject', color: '#DC2626', confidenceThreshold: 0.95, shortcut: '⌘+Backspace', status: 'inactive' },
    { id: '3', name: 'Commit Preparado', triggerText: 'Commit', color: '#10B981', confidenceThreshold: 0.98, shortcut: '⌘+K', status: 'active' },
];

const Dashboard: React.FC = () => {
    const { metrics, setMetrics } = useAppContext();
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [targets] = useState<TargetButton[]>(INITIAL_TARGETS);
    const [isScanning, setIsScanning] = useState(false);
    const logsEndRef = useRef<HTMLDivElement>(null);

    const addLog = useCallback((type: LogEntry['type'], message: string) => {
        setLogs(prev => [
            ...prev.slice(-49),
            {
                id: Math.random().toString(36).substr(2, 9),
                timestamp: new Date().toLocaleTimeString('pt-BR', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                type,
                message
            }
        ]);
    }, []);

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    // Simulate bridge connection
    useEffect(() => {
        setMetrics(m => ({ ...m, bridgeStatus: 'connecting' }));
        addLog('info', 'Tentando handshake com Ponte Python Local (ws://localhost:8765)...');

        const timer = setTimeout(() => {
            setMetrics(m => ({ ...m, bridgeStatus: 'connected' }));
            addLog('bridge', 'Conectado à Ponte de Entrada do SO Local. Latência: 4ms');
        }, 1500);

        return () => clearTimeout(timer);
    }, [addLog, setMetrics]);

    // Scanning simulation
    useEffect(() => {
        if (!isScanning || metrics.safetyLockActive) return;

        const interval = setInterval(() => {
            const detectedChanges = Math.floor(Math.random() * 8);

            setMetrics(prev => {
                if (detectedChanges > 5) {
                    addLog('error', `TRAVA DE SEGURANÇA ACIONADA: ${detectedChanges} arquivos alterados simultaneamente.`);
                    setIsScanning(false);
                    return { ...prev, filesChangedCurrentBatch: detectedChanges, safetyLockActive: true };
                }

                if (Math.random() > 0.6) {
                    addLog('success', `Alvo 'Aceitar Alteração' detectado (98%). Enviando (x:1204, y:840) para ponte.`);
                    return { ...prev, filesChangedCurrentBatch: detectedChanges, totalClicks: prev.totalClicks + 1 };
                }

                return { ...prev, filesChangedCurrentBatch: detectedChanges };
            });
        }, 2000);

        return () => clearInterval(interval);
    }, [isScanning, metrics.safetyLockActive, addLog, setMetrics]);

    const toggleScanning = () => {
        if (metrics.safetyLockActive) {
            setMetrics(m => ({ ...m, safetyLockActive: false, filesChangedCurrentBatch: 0 }));
            addLog('warning', 'Trava de Segurança substituída manualmente pelo usuário.');
        }
        setIsScanning(!isScanning);
        addLog('info', !isScanning ? 'Sequência de varredura visual iniciada.' : 'Sequência de varredura interrompida.');
    };

    return (
        <div className="p-6 h-full">
            <div className="grid grid-cols-12 gap-6 h-full">
                {/* Visual Monitor */}
                <div className="col-span-8 flex flex-col gap-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-slate-900/50 border border-slate-800 rounded-lg p-1 relative overflow-hidden h-[360px]"
                    >
                        <div className="absolute top-4 left-4 z-10 flex gap-2">
                            <div className="bg-black/40 backdrop-blur px-2 py-1 rounded border border-white/10 text-[10px] text-white font-mono">
                                CAM_01: AO VIVO
                            </div>
                            {isScanning && (
                                <div className="bg-red-500/80 backdrop-blur px-2 py-1 rounded text-[10px] text-white font-bold animate-pulse">
                                    GRAVANDO
                                </div>
                            )}
                        </div>

                        <div className="w-full h-full bg-[#0B1121] rounded-lg relative flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 opacity-20 grid grid-cols-[repeat(20,minmax(0,1fr))] grid-rows-[repeat(12,minmax(0,1fr))]">
                                {Array.from({ length: 240 }).map((_, i) => (
                                    <div key={i} className="border-[0.5px] border-slate-700/30" />
                                ))}
                            </div>

                            {isScanning && !metrics.safetyLockActive && <div className="scan-line z-0" />}

                            <div className="text-center z-10">
                                <Eye className={`w-10 h-10 mx-auto mb-3 ${isScanning ? 'text-blue-500' : 'text-slate-700'}`} />
                                <h3 className="text-slate-400 font-light text-base">Buffer de Quadros do Córtex Visual</h3>
                                <p className="text-slate-600 text-xs mt-2">
                                    Aguardando fluxo de quadros da Ponte WebSocket...
                                </p>
                            </div>

                            {isScanning && !metrics.safetyLockActive && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute top-[60%] left-[65%] w-28 h-9 border-2 border-emerald-500 rounded bg-emerald-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)] animate-pulse"
                                >
                                    <div className="absolute -top-5 left-0 bg-emerald-500 text-black text-[9px] font-bold px-1.5 py-0.5 rounded-t">
                                        CONFIANÇA: 98%
                                    </div>
                                    <MousePointer2 className="w-3.5 h-3.5 text-emerald-400 absolute -bottom-5 -right-5" />
                                </motion.div>
                            )}
                        </div>
                    </motion.div>

                    {/* Logs Terminal */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex-1 bg-[#010409] border border-slate-800 rounded-lg overflow-hidden flex flex-col min-h-[200px]"
                    >
                        <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Terminal className="w-4 h-4 text-slate-500" />
                                <span className="text-xs font-mono text-slate-400">Logs do Sistema</span>
                            </div>
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1.5">
                            {logs.length === 0 && <span className="text-slate-600 italic">Sistema inicializado. Aguardando eventos...</span>}
                            {logs.map((log) => (
                                <div key={log.id} className="flex gap-3">
                                    <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
                                    <span className={`${log.type === 'error' ? 'text-red-400' :
                                            log.type === 'success' ? 'text-emerald-400' :
                                                log.type === 'warning' ? 'text-amber-400' :
                                                    log.type === 'bridge' ? 'text-purple-400' : 'text-blue-300'
                                        }`}>
                                        {log.type === 'bridge' ? '⚡ ' : log.type === 'error' ? '✖ ' : log.type === 'success' ? '✔ ' : '> '}
                                        {log.message}
                                    </span>
                                </div>
                            ))}
                            <div ref={logsEndRef} />
                        </div>
                    </motion.div>
                </div>

                {/* Right Panel */}
                <div className="col-span-4 space-y-6">
                    {/* Safety Status */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-5 rounded-lg border ${metrics.safetyLockActive ? 'bg-red-950/20 border-red-500/50 danger-glow' : 'bg-slate-900/50 border-slate-800'}`}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Conformidade de Auditoria</h3>
                                <div className="flex items-center gap-2">
                                    {metrics.safetyLockActive ? <ShieldAlert className="w-5 h-5 text-red-500" /> : <ShieldCheck className="w-5 h-5 text-emerald-500" />}
                                    <span className={`text-lg font-medium ${metrics.safetyLockActive ? 'text-red-500' : 'text-emerald-500'}`}>
                                        {metrics.safetyLockActive ? 'VIOLAÇÃO DETECTADA' : 'SEGURO'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-500">Limite de Alteração de Arquivos</span>
                                    <span className="text-slate-300">Máx 5</span>
                                </div>
                                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-500 ${metrics.filesChangedCurrentBatch > 5 ? 'bg-red-500' : 'bg-blue-500'}`}
                                        style={{ width: `${(metrics.filesChangedCurrentBatch / 8) * 100}%` }}
                                    />
                                </div>
                                <div className="text-right mt-1">
                                    <span className={`text-[10px] font-mono ${metrics.filesChangedCurrentBatch > 5 ? 'text-red-400' : 'text-slate-500'}`}>
                                        {metrics.filesChangedCurrentBatch} arquivos alterados detectados
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Targets */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-panel p-5 rounded-lg"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-bold text-white">Assinaturas de Alvo</h3>
                            <button className="text-[10px] bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-slate-300 transition-colors">
                                + ADICIONAR
                            </button>
                        </div>

                        <AnimatedList className="space-y-2" staggerDelay={0.08}>
                            {targets.map(target => (
                                <div key={target.id} className="p-3 bg-slate-800/30 border border-slate-700/50 hover:border-slate-600 rounded-lg transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: target.color }} />
                                            <span className="text-sm font-medium text-slate-200">{target.name}</span>
                                        </div>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${target.status === 'active' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10' : 'border-slate-600 text-slate-500'}`}>
                                            {target.status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                                        <span>OCR: "{target.triggerText}"</span>
                                        <span>{target.shortcut}</span>
                                    </div>
                                </div>
                            ))}
                        </AnimatedList>
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-2 gap-3"
                    >
                        <button
                            onClick={() => addLog('info', 'Recalibrando visão...')}
                            className="p-4 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 hover:border-blue-500/30 transition-all text-left group"
                        >
                            <span className="block text-xl mb-1 group-hover:scale-110 transition-transform duration-300">📸</span>
                            <span className="text-xs font-semibold text-slate-400 group-hover:text-blue-400">Recalibrar Visão</span>
                        </button>
                        <button
                            onClick={() => addLog('bridge', 'Testando conexão da ponte...')}
                            className="p-4 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 hover:border-blue-500/30 transition-all text-left group"
                        >
                            <span className="block text-xl mb-1 group-hover:scale-110 transition-transform duration-300">📡</span>
                            <span className="text-xs font-semibold text-slate-400 group-hover:text-blue-400">Testar Ponte</span>
                        </button>
                    </motion.div>

                    {/* Scan Toggle */}
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        onClick={toggleScanning}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full flex items-center justify-center gap-3 py-3 rounded-lg font-semibold transition-all ${metrics.safetyLockActive
                                ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/40'
                                : isScanning
                                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/50 hover:bg-amber-500/20'
                                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/40 neon-glow'
                            }`}
                    >
                        {metrics.safetyLockActive ? (
                            <><Lock className="w-4 h-4" /> REINICIAR SISTEMA</>
                        ) : isScanning ? (
                            'PAUSAR VARREDURA'
                        ) : (
                            'INICIAR VARREDURA'
                        )}
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
