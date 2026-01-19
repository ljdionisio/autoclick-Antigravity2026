import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Save,
    RotateCcw,
    Wifi,
    Shield,
    Bell,
    Palette,
    Volume2,
    VolumeX,
    Moon,
    Monitor
} from 'lucide-react';
import MotionButton from '../components/MotionButton';
import { AppSettings } from '../types';

const DEFAULT_SETTINGS: AppSettings = {
    bridgeUrl: 'ws://localhost:8765',
    maxFilesPerBatch: 5,
    autoReconnect: true,
    soundEnabled: true,
    theme: 'dark'
};

const Settings: React.FC = () => {
    const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        // In a real app, this would persist to localStorage or backend
        localStorage.setItem('antigravity-settings', JSON.stringify(settings));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleReset = () => {
        setSettings(DEFAULT_SETTINGS);
    };

    const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="p-6 h-full overflow-y-auto">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-xl font-bold text-white">Configurações</h1>
                        <p className="text-sm text-slate-400 mt-1">Ajuste as preferências do sistema Antigravity</p>
                    </div>
                    <div className="flex gap-2">
                        <MotionButton variant="ghost" onClick={handleReset} icon={<RotateCcw className="w-4 h-4" />}>
                            Restaurar
                        </MotionButton>
                        <MotionButton onClick={handleSave} icon={<Save className="w-4 h-4" />}>
                            {saved ? 'Salvo!' : 'Salvar'}
                        </MotionButton>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Connection Settings */}
                    <motion.section
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-slate-900/50 border border-slate-800 rounded-lg p-5"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Wifi className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-white">Conexão da Ponte</h2>
                                <p className="text-xs text-slate-500">Configurações de WebSocket</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">URL do WebSocket</label>
                                <input
                                    type="text"
                                    value={settings.bridgeUrl}
                                    onChange={(e) => updateSetting('bridgeUrl', e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-sm text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-sm text-slate-200">Reconexão Automática</span>
                                    <p className="text-xs text-slate-500">Reconectar automaticamente se a conexão cair</p>
                                </div>
                                <button
                                    onClick={() => updateSetting('autoReconnect', !settings.autoReconnect)}
                                    className={`w-11 h-6 rounded-full transition-colors relative ${settings.autoReconnect ? 'bg-blue-600' : 'bg-slate-700'
                                        }`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.autoReconnect ? 'left-6' : 'left-1'
                                        }`} />
                                </button>
                            </div>
                        </div>
                    </motion.section>

                    {/* Safety Settings */}
                    <motion.section
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-slate-900/50 border border-slate-800 rounded-lg p-5"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <Shield className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-white">Segurança</h2>
                                <p className="text-xs text-slate-500">Limites e travas de proteção</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-xs font-medium text-slate-400">Limite de Arquivos por Lote</label>
                                    <span className="text-xs text-blue-400 font-mono">{settings.maxFilesPerBatch}</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="20"
                                    value={settings.maxFilesPerBatch}
                                    onChange={(e) => updateSetting('maxFilesPerBatch', parseInt(e.target.value))}
                                    className="w-full accent-blue-500"
                                />
                                <p className="text-xs text-slate-500 mt-1">
                                    A trava de segurança será acionada se mais de {settings.maxFilesPerBatch} arquivos forem alterados simultaneamente.
                                </p>
                            </div>
                        </div>
                    </motion.section>

                    {/* UI Preferences */}
                    <motion.section
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-slate-900/50 border border-slate-800 rounded-lg p-5"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <Palette className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-white">Preferências de Interface</h2>
                                <p className="text-xs text-slate-500">Aparência e som</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-slate-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                                    <div>
                                        <span className="text-sm text-slate-200">Sons de Notificação</span>
                                        <p className="text-xs text-slate-500">Tocar sons ao detectar alvos</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}
                                    className={`w-11 h-6 rounded-full transition-colors relative ${settings.soundEnabled ? 'bg-blue-600' : 'bg-slate-700'
                                        }`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.soundEnabled ? 'left-6' : 'left-1'
                                        }`} />
                                </button>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-2">Tema</label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => updateSetting('theme', 'dark')}
                                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md border transition-all ${settings.theme === 'dark'
                                                ? 'bg-blue-500/10 border-blue-500/50 text-blue-400'
                                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                                            }`}
                                    >
                                        <Moon className="w-4 h-4" />
                                        <span className="text-sm">Escuro</span>
                                    </button>
                                    <button
                                        onClick={() => updateSetting('theme', 'system')}
                                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md border transition-all ${settings.theme === 'system'
                                                ? 'bg-blue-500/10 border-blue-500/50 text-blue-400'
                                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                                            }`}
                                    >
                                        <Monitor className="w-4 h-4" />
                                        <span className="text-sm">Sistema</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Version Info */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-center py-6"
                    >
                        <p className="text-xs text-slate-600">
                            Antigravity V5.0 • Centro de Automação de IDE
                        </p>
                        <p className="text-[10px] text-slate-700 mt-1">
                            © 2025 Antigravity Systems
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default Settings;
